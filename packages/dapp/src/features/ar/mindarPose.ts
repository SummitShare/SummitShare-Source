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

  const resetStablePose = () => {
    initialized = false
    poseSampledAt = null
    previousAcceptedScale = 1
    filteredPositionDerivative = 0
    filteredRotationDerivative = 0
    holdingRejectedPose = false
    rejectionHoldFrames = 0
  }

  const composeFilteredPose = () => {
    filteredPose.scale.setScalar(1)
    filteredPose.matrix.compose(
      filteredPose.position,
      filteredPose.quaternion,
      filteredPose.scale,
    )
  }

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
        return createIdleUpdate(
          'invisible',
          initialized ? filteredPose : null,
          targetUnitScale,
        )
      }

      if (!hasNewPoseMeasurement(previousMatrix, hasPreviousMatrix, matrix)) {
        return createIdleUpdate(
          'unchanged',
          initialized ? filteredPose : null,
          targetUnitScale,
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
          filteredPose: initialized ? filteredPose : null,
          targetUnitScale,
          snapped: false,
          snapReason: null,
          translationJumpTargetUnits: null,
          rotationJumpDegrees: null,
        }
      }

      matrix.decompose(
        rawPose.position,
        rawPose.quaternion,
        rawPose.scale,
      )
      rigidifyDecomposedPose(rawPose.quaternion, rawPose.scale)
      const stableUpdate = updateStablePose(parameters, sampledAt)
      holdingRejectedPose = false
      rejectionHoldFrames = 0

      return {
        status: 'accepted',
        accepted: true,
        rejected: false,
        rejectionReason: null,
        rawPose,
        filteredPose,
        targetUnitScale,
        ...stableUpdate,
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
