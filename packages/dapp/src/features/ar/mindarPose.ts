import { Matrix4, Quaternion, Vector3 } from 'three'

export type MindARPoseRejectionReason =
  | 'non-finite'
  | 'ratio'
  | 'volume'
  | 'scale-range'

export type MindARPoseSnapReason = 'initial' | 'jump'

export interface MindARPoseParameters {
  poseFilterMinCutOff: number
  poseFilterBeta: number
  poseRotationFilterBeta: number
  /** Maximum filtered-to-raw translation before snapping, in target units. */
  poseTranslationJumpLimit: number
  /** Maximum filtered-to-raw rotation before snapping, in degrees. */
  poseRotationJumpLimitDegrees: number
  warmupUpdates: number
  warmupFadeMs: number
  /**
   * Hard ceiling on the acquisition warmup, in milliseconds. The warmup hides
   * the artifact until refined poses arrive, and resets on every target
   * re-acquisition. Under marginal tracking the target is found and lost faster
   * than the warmup completes, so without this the artifact stays invisible
   * forever while the pose reads accepted. Showing a slightly wrong pose beats
   * showing nothing.
   */
  warmupTimeoutMs: number
  staleFadeUpdates: number
  staleFadeMs: number
  holdTranslationTargetUnits: number
  holdRotationDegrees: number
  holdEngageUpdates: number
  depthFilterMinCutOff: number
  depthRangeTargetUnits: { min: number; max: number } | null
}

// Pose objects in update results are read-only views owned and reused by the
// relay. Copy their values if they need to outlive the current update.
export interface MindARDecomposedPose {
  readonly position: Vector3
  readonly quaternion: Quaternion
  readonly scale: Vector3
}

export interface MindARFilteredPose extends MindARDecomposedPose {
  readonly matrix: Matrix4
}

export interface MindARPoseUpdate {
  readonly status: 'invisible' | 'unchanged' | 'rejected' | 'accepted'
  readonly accepted: boolean
  readonly rejected: boolean
  readonly rejectionReason: MindARPoseRejectionReason | null
  readonly rawPose: MindARDecomposedPose | null
  readonly filteredPose: MindARFilteredPose | null
  readonly targetUnitScale: number | null
  readonly snapped: boolean
  readonly snapReason: MindARPoseSnapReason | null
  readonly translationJumpTargetUnits: number | null
  readonly rotationJumpDegrees: number | null
  readonly staleRunLength: number
  readonly warming: boolean
  readonly held: boolean
  readonly holdRunLength: number
  readonly depthClamped: boolean
  readonly recommendedOpacity: number
}

export interface MindARPoseRelayUpdate {
  anchorVisible: boolean
  matrix: Matrix4
  sampledAt: number
  parameters: MindARPoseParameters
}

export interface MindARPoseFrameState {
  readonly poseVisible: boolean
  readonly rejectionHoldExpired: boolean
}

export interface MindARPoseRelay {
  readonly initialized: boolean
  readonly targetUnitScale: number | null
  update(update: MindARPoseRelayUpdate): MindARPoseUpdate
  advanceFrame(anchorVisible: boolean): MindARPoseFrameState
  reset(): void
}

const MIN_POSE_DELTA_SECONDS = 0.001
const MIN_POSE_CUTOFF_HZ = 0.1
const POSE_DERIVATIVE_CUTOFF_HZ = 1
const POSE_REFERENCE_SAMPLE_COUNT = 5
const MAX_REJECTED_POSE_HOLD_FRAMES = 3
const MIN_POSE_AXIS_RATIO = 0.5
const MIN_POSE_NORMALIZED_VOLUME = 0.5
const MIN_REFERENCE_SCALE_RATIO = 0.5
const MAX_REFERENCE_SCALE_RATIO = 2
const RADIANS_TO_DEGREES = 180 / Math.PI
const MIN_OPACITY = 0
const MAX_OPACITY = 1

// Never let the cutoff reach zero. A zero cutoff makes alpha zero, which freezes
// the pose at its first sample — the artifact stops following the marker
// entirely while *looking* perfectly stable. That reads as "we fixed the
// stutter" and is the most misleading state this relay can be in. 0.1 Hz is
// still extremely heavy smoothing (~1.5% of the delta per update at 40 fps) but
// always converges.
const oneEuroAlpha = (cutOff: number, deltaSeconds: number) => {
  const safeCutOff = Math.max(MIN_POSE_CUTOFF_HZ, cutOff)
  const timeConstant = 1 / (2 * Math.PI * safeCutOff)
  return 1 / (1 + timeConstant / deltaSeconds)
}

const clampUnitInterval = (value: number) =>
  Math.min(MAX_OPACITY, Math.max(MIN_OPACITY, value))

const rigidifyDecomposedPose = (
  quaternion: Quaternion,
  scale: Vector3,
) => {
  quaternion.normalize()
  const uniformScale =
    (Math.abs(scale.x) + Math.abs(scale.y) + Math.abs(scale.z)) / 3
  scale.setScalar(uniformScale)
}

const hasNewPoseMeasurement = (
  previousMatrix: Float64Array,
  hasPreviousMatrix: boolean,
  matrix: Matrix4,
) => {
  const elements = matrix.elements
  let changed = !hasPreviousMatrix

  if (!changed) {
    for (let index = 0; index < 16; index += 1) {
      if (!Object.is(elements[index], previousMatrix[index])) {
        changed = true
        break
      }
    }
  }
  if (!changed) return false

  for (let index = 0; index < 16; index += 1) {
    previousMatrix[index] = elements[index]
  }
  return true
}

interface PoseValidationState {
  referenceScaleSamples: Float64Array
  referenceScaleSampleCount: number
  referenceScale: number | null
}

const getPoseRejectionReason = (
  state: PoseValidationState,
  matrix: Matrix4,
): MindARPoseRejectionReason | null => {
  const elements = matrix.elements
  for (let index = 0; index < 16; index += 1) {
    if (!Number.isFinite(elements[index])) return 'non-finite'
  }

  const xLength = Math.hypot(elements[0], elements[1], elements[2])
  const yLength = Math.hypot(elements[4], elements[5], elements[6])
  const zLength = Math.hypot(elements[8], elements[9], elements[10])
  if (
    !Number.isFinite(xLength) ||
    !Number.isFinite(yLength) ||
    !Number.isFinite(zLength)
  ) {
    return 'non-finite'
  }

  const minAxisLength = Math.min(xLength, yLength, zLength)
  const maxAxisLength = Math.max(xLength, yLength, zLength)
  const axisRatio = minAxisLength / maxAxisLength
  if (!Number.isFinite(axisRatio) || axisRatio < MIN_POSE_AXIS_RATIO) {
    return 'ratio'
  }

  const determinant3 =
    elements[0] *
      (elements[5] * elements[10] - elements[6] * elements[9]) -
    elements[4] *
      (elements[1] * elements[10] - elements[2] * elements[9]) +
    elements[8] *
      (elements[1] * elements[6] - elements[2] * elements[5])
  const normalizedVolume =
    Math.abs(determinant3) / (xLength * yLength * zLength)
  if (
    !Number.isFinite(normalizedVolume) ||
    normalizedVolume < MIN_POSE_NORMALIZED_VOLUME
  ) {
    return 'volume'
  }

  const meanAxisLength = xLength / 3 + yLength / 3 + zLength / 3
  if (state.referenceScale !== null) {
    if (
      meanAxisLength < state.referenceScale * MIN_REFERENCE_SCALE_RATIO ||
      meanAxisLength > state.referenceScale * MAX_REFERENCE_SCALE_RATIO
    ) {
      return 'scale-range'
    }
  } else {
    let insertAt = state.referenceScaleSampleCount
    while (
      insertAt > 0 &&
      state.referenceScaleSamples[insertAt - 1] > meanAxisLength
    ) {
      state.referenceScaleSamples[insertAt] =
        state.referenceScaleSamples[insertAt - 1]
      insertAt -= 1
    }
    state.referenceScaleSamples[insertAt] = meanAxisLength
    state.referenceScaleSampleCount += 1
    if (state.referenceScaleSampleCount === POSE_REFERENCE_SAMPLE_COUNT) {
      state.referenceScale =
        state.referenceScaleSamples[
          Math.floor(POSE_REFERENCE_SAMPLE_COUNT / 2)
        ]
    }
  }

  return null
}

const createIdleUpdate = (
  status: 'invisible' | 'unchanged',
  filteredPose: MindARFilteredPose | null,
  targetUnitScale: number | null,
  staleRunLength: number,
  warming: boolean,
  held: boolean,
  holdRunLength: number,
  recommendedOpacity: number,
): MindARPoseUpdate => ({
  status,
  accepted: false,
  rejected: false,
  rejectionReason: null,
  rawPose: null,
  filteredPose,
  targetUnitScale,
  snapped: false,
  snapReason: null,
  translationJumpTargetUnits: null,
  rotationJumpDegrees: null,
  staleRunLength,
  warming,
  held,
  holdRunLength,
  depthClamped: false,
  recommendedOpacity,
})

export const createMindARPoseRelay = (): MindARPoseRelay => {
  const previousMatrix = new Float64Array(16)
  const rawPose: MindARDecomposedPose = {
    position: new Vector3(),
    quaternion: new Quaternion(),
    scale: new Vector3(),
  }
  const filteredPose: MindARFilteredPose = {
    position: new Vector3(),
    quaternion: new Quaternion(),
    scale: new Vector3(1, 1, 1),
    matrix: new Matrix4(),
  }
  const depthDampedPose: MindARFilteredPose = {
    position: new Vector3(),
    quaternion: new Quaternion(),
    scale: new Vector3(1, 1, 1),
    matrix: new Matrix4(),
  }
  const heldPose: MindARFilteredPose = {
    position: new Vector3(),
    quaternion: new Quaternion(),
    scale: new Vector3(1, 1, 1),
    matrix: new Matrix4(),
  }
  const emittedPose: MindARFilteredPose = {
    position: new Vector3(),
    quaternion: new Quaternion(),
    scale: new Vector3(1, 1, 1),
    matrix: new Matrix4(),
  }
  const previousRawPosition = new Vector3()
  const previousRawQuaternion = new Quaternion()
  const validationState: PoseValidationState = {
    referenceScaleSamples: new Float64Array(POSE_REFERENCE_SAMPLE_COUNT),
    referenceScaleSampleCount: 0,
    referenceScale: null,
  }

  let hasPreviousMatrix = false
  let initialized = false
  let poseSampledAt: number | null = null
  let previousAcceptedScale = 1
  let filteredPositionDerivative = 0
  let filteredRotationDerivative = 0
  let targetUnitScale: number | null = null
  let holdingRejectedPose = false
  let rejectionHoldFrames = 0
  let acceptedWarmupUpdates = 0
  // Deliberately NOT cleared by resetStablePose: reset() runs on every target
  // re-acquisition, so an acquisition-scoped clock restarts faster than it can
  // expire and the timeout never fires. Anchoring it to the first accepted pose
  // of the whole session is what makes the ceiling a real guarantee — the relay
  // is constructed per AR session, so this is session-scoped by construction.
  let sessionWarmupStartedAt: number | null = null
  // Session-scoped for the same reason as sessionWarmupStartedAt. Clearing the
  // fade anchor on re-acquisition makes the artifact re-fade from zero every
  // time the marker is momentarily lost, which under marginal tracking is a
  // flicker rather than a fade. The per-acquisition update count still hides
  // the unrefined pose; only the ramp is anchored to the session.
  let warmupFadeStartedAt: number | null = null
  let staleRunLength = 0
  let staleOpacityFrom = 1
  let staleOpacityTarget = 1
  let staleOpacityStartedAt = 0
  let staleOpacityDurationMs = 0
  let depthFilterInitialized = false
  let depthSampledAt: number | null = null
  let depthFilteredZ = 0
  let heldPoseInitialized = false
  let held = false
  let holdRunLength = 0

  const resetStablePose = () => {
    initialized = false
    poseSampledAt = null
    previousAcceptedScale = 1
    filteredPositionDerivative = 0
    filteredRotationDerivative = 0
    holdingRejectedPose = false
    rejectionHoldFrames = 0
    acceptedWarmupUpdates = 0
    staleRunLength = 0
    staleOpacityFrom = 1
    staleOpacityTarget = 1
    staleOpacityStartedAt = 0
    staleOpacityDurationMs = 0
    depthFilterInitialized = false
    depthSampledAt = null
    depthFilteredZ = 0
    heldPoseInitialized = false
    held = false
    holdRunLength = 0
  }

  const composeFilteredPose = () => {
    filteredPose.scale.setScalar(1)
    filteredPose.matrix.compose(
      filteredPose.position,
      filteredPose.quaternion,
      filteredPose.scale,
    )
  }

  const copyFilteredPose = (
    target: MindARFilteredPose,
    source: MindARFilteredPose,
  ) => {
    target.position.copy(source.position)
    target.quaternion.copy(source.quaternion)
    target.scale.copy(source.scale)
    target.matrix.copy(source.matrix)
  }

  const sampleStaleOpacity = (sampledAt: number) => {
    if (staleOpacityDurationMs <= 0) return staleOpacityTarget
    const progress = clampUnitInterval(
      (sampledAt - staleOpacityStartedAt) / staleOpacityDurationMs,
    )
    return (
      staleOpacityFrom +
      (staleOpacityTarget - staleOpacityFrom) * progress
    )
  }

  const setStaleOpacityTarget = (
    nextTarget: number,
    sampledAt: number,
    durationMs: number,
  ) => {
    if (nextTarget === staleOpacityTarget) return
    staleOpacityFrom = sampleStaleOpacity(sampledAt)
    staleOpacityTarget = nextTarget
    staleOpacityStartedAt = sampledAt
    staleOpacityDurationMs = Math.max(0, durationMs)
  }

  const hasWarmupTimedOut = (
    parameters: MindARPoseParameters,
    sampledAt: number,
  ) =>
    parameters.warmupTimeoutMs > 0 &&
    sessionWarmupStartedAt !== null &&
    sampledAt - sessionWarmupStartedAt >= parameters.warmupTimeoutMs

  // Two thresholds, deliberately one update apart. warmupUpdates counts the
  // updates that are HIDDEN, so the Nth update is still warming and the fade
  // may only start once it has passed; anchoring the ramp on the Nth rather
  // than the (N+1)th is what keeps the artifact from costing an extra update
  // of blankness before it begins to appear.
  const isWarmupSatisfied = (
    parameters: MindARPoseParameters,
    sampledAt: number,
  ) =>
    acceptedWarmupUpdates >
      Math.max(0, Math.floor(parameters.warmupUpdates)) ||
    hasWarmupTimedOut(parameters, sampledAt)

  const getWarmupOpacity = (
    parameters: MindARPoseParameters,
    sampledAt: number,
  ) => {
    if (
      !initialized ||
      !isWarmupSatisfied(parameters, sampledAt) ||
      warmupFadeStartedAt === null
    ) {
      return 0
    }
    if (parameters.warmupFadeMs <= 0) return 1
    return clampUnitInterval(
      (sampledAt - warmupFadeStartedAt) / parameters.warmupFadeMs,
    )
  }

  const getRecommendedOpacity = (
    parameters: MindARPoseParameters,
    sampledAt: number,
    warming = false,
  ) =>
    warming
      ? 0
      : clampUnitInterval(
          getWarmupOpacity(parameters, sampledAt) *
            sampleStaleOpacity(sampledAt),
        )

  const snapToRawPose = () => {
    filteredPose.position.copy(rawPose.position)
    filteredPose.quaternion.copy(rawPose.quaternion)
    previousRawPosition.copy(rawPose.position)
    previousRawQuaternion.copy(rawPose.quaternion)
    previousAcceptedScale = rawPose.scale.x
    filteredPositionDerivative = 0
    filteredRotationDerivative = 0
    initialized = true
  }

  const updateStablePose = (
    parameters: MindARPoseParameters,
    sampledAt: number,
  ) => {
    const deltaSeconds = Math.max(
      poseSampledAt === null
        ? MIN_POSE_DELTA_SECONDS
        : (sampledAt - poseSampledAt) / 1000,
      MIN_POSE_DELTA_SECONDS,
    )
    poseSampledAt = sampledAt

    if (!initialized) {
      if (targetUnitScale === null) targetUnitScale = rawPose.scale.x
      snapToRawPose()
      composeFilteredPose()
      return {
        snapped: true,
        snapReason: 'initial' as const,
        translationJumpTargetUnits: null,
        rotationJumpDegrees: null,
      }
    }

    if (previousRawQuaternion.dot(rawPose.quaternion) < 0) {
      rawPose.quaternion.set(
        -rawPose.quaternion.x,
        -rawPose.quaternion.y,
        -rawPose.quaternion.z,
        -rawPose.quaternion.w,
      )
    }

    const translationJumpTargetUnits =
      filteredPose.position.distanceTo(rawPose.position) /
      (targetUnitScale ?? rawPose.scale.x)
    const rotationJumpDegrees =
      filteredPose.quaternion.angleTo(rawPose.quaternion) * RADIANS_TO_DEGREES
    if (
      translationJumpTargetUnits > parameters.poseTranslationJumpLimit ||
      rotationJumpDegrees > parameters.poseRotationJumpLimitDegrees
    ) {
      snapToRawPose()
      composeFilteredPose()
      return {
        snapped: true,
        snapReason: 'jump' as const,
        translationJumpTargetUnits,
        rotationJumpDegrees,
      }
    }

    const robustScale =
      Math.sqrt(previousAcceptedScale) * Math.sqrt(rawPose.scale.x)
    const positionDerivative =
      previousRawPosition.distanceTo(rawPose.position) /
      (deltaSeconds * robustScale)
    const derivativeAlpha = oneEuroAlpha(
      POSE_DERIVATIVE_CUTOFF_HZ,
      deltaSeconds,
    )
    filteredPositionDerivative +=
      derivativeAlpha *
      (positionDerivative - filteredPositionDerivative)
    const positionCutOff =
      parameters.poseFilterMinCutOff +
      parameters.poseFilterBeta * filteredPositionDerivative
    filteredPose.position.lerp(
      rawPose.position,
      oneEuroAlpha(positionCutOff, deltaSeconds),
    )

    const rotationDerivative =
      previousRawQuaternion.angleTo(rawPose.quaternion) / deltaSeconds
    filteredRotationDerivative +=
      derivativeAlpha *
      (rotationDerivative - filteredRotationDerivative)
    const rotationCutOff =
      parameters.poseFilterMinCutOff +
      parameters.poseRotationFilterBeta * filteredRotationDerivative
    filteredPose.quaternion
      .slerp(
        rawPose.quaternion,
        oneEuroAlpha(rotationCutOff, deltaSeconds),
      )
      .normalize()

    previousRawPosition.copy(rawPose.position)
    previousRawQuaternion.copy(rawPose.quaternion)
    previousAcceptedScale = rawPose.scale.x
    composeFilteredPose()
    return {
      snapped: false,
      snapReason: null,
      translationJumpTargetUnits,
      rotationJumpDegrees,
    }
  }

  const updateDepthDampedPose = (
    parameters: MindARPoseParameters,
    sampledAt: number,
    snapped: boolean,
  ) => {
    const deltaSeconds = Math.max(
      depthSampledAt === null
        ? MIN_POSE_DELTA_SECONDS
        : (sampledAt - depthSampledAt) / 1000,
      MIN_POSE_DELTA_SECONDS,
    )
    depthSampledAt = sampledAt

    if (!depthFilterInitialized || snapped) {
      depthFilteredZ = filteredPose.position.z
      depthFilterInitialized = true
    } else {
      depthFilteredZ +=
        oneEuroAlpha(parameters.depthFilterMinCutOff, deltaSeconds) *
        (filteredPose.position.z - depthFilteredZ)
    }

    let depthClamped = false
    if (
      parameters.depthRangeTargetUnits !== null &&
      targetUnitScale !== null
    ) {
      const minimum =
        parameters.depthRangeTargetUnits.min * targetUnitScale
      const maximum =
        parameters.depthRangeTargetUnits.max * targetUnitScale
      const clampedZ = Math.min(maximum, Math.max(minimum, depthFilteredZ))
      depthClamped = clampedZ !== depthFilteredZ
      depthFilteredZ = clampedZ
    }

    depthDampedPose.position.copy(filteredPose.position)
    depthDampedPose.position.z = depthFilteredZ
    depthDampedPose.quaternion.copy(filteredPose.quaternion)
    depthDampedPose.scale.setScalar(1)
    depthDampedPose.matrix.compose(
      depthDampedPose.position,
      depthDampedPose.quaternion,
      depthDampedPose.scale,
    )
    return depthClamped
  }

  const updateDeadbandPose = (
    parameters: MindARPoseParameters,
    snapped: boolean,
  ) => {
    if (!heldPoseInitialized || snapped) {
      heldPoseInitialized = true
      held = false
      holdRunLength = 0
      copyFilteredPose(heldPose, depthDampedPose)
      copyFilteredPose(emittedPose, depthDampedPose)
      return
    }

    const translationTargetUnits =
      depthDampedPose.position.distanceTo(heldPose.position) /
      (targetUnitScale ?? 1)
    const rotationDegrees =
      depthDampedPose.quaternion.angleTo(heldPose.quaternion) *
      RADIANS_TO_DEGREES
    const inTolerance =
      translationTargetUnits <= parameters.holdTranslationTargetUnits &&
      rotationDegrees <= parameters.holdRotationDegrees

    if (!inTolerance) {
      held = false
      holdRunLength = 0
      copyFilteredPose(heldPose, depthDampedPose)
      copyFilteredPose(emittedPose, depthDampedPose)
      return
    }

    holdRunLength += 1
    const engageUpdates = Math.max(
      1,
      Math.floor(parameters.holdEngageUpdates),
    )
    if (held || holdRunLength >= engageUpdates) {
      held = true
      copyFilteredPose(emittedPose, heldPose)
      return
    }

    copyFilteredPose(emittedPose, depthDampedPose)
  }

  return {
    get initialized() {
      return initialized
    },
    get targetUnitScale() {
      return targetUnitScale
    },
    update({
      anchorVisible,
      matrix,
      sampledAt,
      parameters,
    }: MindARPoseRelayUpdate): MindARPoseUpdate {
      if (!anchorVisible) {
        const warming = !isWarmupSatisfied(parameters, sampledAt)
        return createIdleUpdate(
          'invisible',
          initialized ? emittedPose : null,
          targetUnitScale,
          staleRunLength,
          warming,
          held,
          holdRunLength,
          getRecommendedOpacity(parameters, sampledAt),
        )
      }

      if (!hasNewPoseMeasurement(previousMatrix, hasPreviousMatrix, matrix)) {
        staleRunLength += 1
        setStaleOpacityTarget(
          staleRunLength >
            Math.max(0, Math.floor(parameters.staleFadeUpdates))
            ? 0
            : 1,
          sampledAt,
          parameters.staleFadeMs,
        )
        const warming = !isWarmupSatisfied(parameters, sampledAt)
        return createIdleUpdate(
          'unchanged',
          initialized ? emittedPose : null,
          targetUnitScale,
          staleRunLength,
          warming,
          held,
          holdRunLength,
          getRecommendedOpacity(parameters, sampledAt),
        )
      }
      hasPreviousMatrix = true

      const rejectionReason = getPoseRejectionReason(validationState, matrix)
      if (rejectionReason !== null) {
        holdingRejectedPose = true
        return {
          status: 'rejected',
          accepted: false,
          rejected: true,
          rejectionReason,
          rawPose: null,
          filteredPose: initialized ? emittedPose : null,
          targetUnitScale,
          snapped: false,
          snapReason: null,
          translationJumpTargetUnits: null,
          rotationJumpDegrees: null,
          staleRunLength,
          warming: !isWarmupSatisfied(parameters, sampledAt),
          held,
          holdRunLength,
          depthClamped: false,
          recommendedOpacity: getRecommendedOpacity(
            parameters,
            sampledAt,
          ),
        }
      }

      matrix.decompose(
        rawPose.position,
        rawPose.quaternion,
        rawPose.scale,
      )
      rigidifyDecomposedPose(rawPose.quaternion, rawPose.scale)
      const stableUpdate = updateStablePose(parameters, sampledAt)
      const depthClamped = updateDepthDampedPose(
        parameters,
        sampledAt,
        stableUpdate.snapped,
      )
      updateDeadbandPose(parameters, stableUpdate.snapped)

      staleRunLength = 0
      setStaleOpacityTarget(1, sampledAt, parameters.staleFadeMs)
      if (sessionWarmupStartedAt === null) sessionWarmupStartedAt = sampledAt
      acceptedWarmupUpdates += 1
      const warming = !isWarmupSatisfied(parameters, sampledAt)
      if (
        warmupFadeStartedAt === null &&
        (acceptedWarmupUpdates >=
          Math.max(0, Math.floor(parameters.warmupUpdates)) ||
          hasWarmupTimedOut(parameters, sampledAt))
      ) {
        warmupFadeStartedAt = sampledAt
      }
      holdingRejectedPose = false
      rejectionHoldFrames = 0

      return {
        status: 'accepted',
        accepted: true,
        rejected: false,
        rejectionReason: null,
        rawPose,
        filteredPose: emittedPose,
        targetUnitScale,
        ...stableUpdate,
        staleRunLength,
        warming,
        held,
        holdRunLength,
        depthClamped,
        recommendedOpacity: getRecommendedOpacity(
          parameters,
          sampledAt,
          warming,
        ),
      }
    },
    advanceFrame(anchorVisible: boolean) {
      if (!anchorVisible) {
        return { poseVisible: false, rejectionHoldExpired: false }
      }
      if (!holdingRejectedPose) {
        return { poseVisible: initialized, rejectionHoldExpired: false }
      }

      rejectionHoldFrames += 1
      if (
        !initialized ||
        rejectionHoldFrames > MAX_REJECTED_POSE_HOLD_FRAMES
      ) {
        resetStablePose()
        return { poseVisible: false, rejectionHoldExpired: true }
      }

      return { poseVisible: true, rejectionHoldExpired: false }
    },
    reset() {
      resetStablePose()
      hasPreviousMatrix = false
    },
  }
}
