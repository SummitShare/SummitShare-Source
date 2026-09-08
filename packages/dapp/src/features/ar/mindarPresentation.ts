import { Matrix4, Quaternion, Vector3 } from 'three'
import type { MindARFilteredPose, MindARPoseSnapReason } from './mindarPose'

export interface MindARJumpGuardParameters {
  targetUnitScale: number
  translationThresholdTargetUnits: number
  rotationThresholdDegrees: number
  confirmationMs: number
  maxWaitMs: number
}

export type MindARPresentationDecision = 'following' | 'initial' | 'bypass' | 'pending' | 'cancelled' | 'confirmed' | 'timeout'

/** Experimental render-stage smoothing; timeConstantMs is additional response lag. */
export const createMindARPosePresentation = () => {
  const position = new Vector3()
  const quaternion = new Quaternion()
  const targetPosition = new Vector3()
  const targetQuaternion = new Quaternion()
  const unitScale = new Vector3(1, 1, 1)
  const matrix = new Matrix4()
  const candidatePosition = new Vector3()
  const candidateQuaternion = new Quaternion()
  const pendingPosition = new Vector3()
  const pendingQuaternion = new Quaternion()
  let initialized = false
  let previousAt = 0
  let pendingAt: number | null = null
  let coherentAt = 0

  const sample = (at: number, timeConstantMs: number): MindARFilteredPose | null => {
    if (!initialized) return null
    if (timeConstantMs <= 0 && pendingAt !== null) {
      targetPosition.copy(pendingPosition)
      targetQuaternion.copy(pendingQuaternion)
      pendingAt = null
    }
    const elapsed = Math.max(0, at - previousAt)
    previousAt = Math.max(previousAt, at)
    const alpha = timeConstantMs > 0 ? -Math.expm1(-elapsed / timeConstantMs) : 1
    position.lerp(targetPosition, alpha)
    quaternion.slerp(targetQuaternion, alpha).normalize()
    matrix.compose(position, quaternion, unitScale)
    return pose
  }
  const pose: MindARFilteredPose = { position, quaternion, scale: unitScale, matrix }

  return {
    // Results, like relay results, are owned by this instance and reused.
    sample,
    setTarget(next: MindARFilteredPose, at: number, timeConstantMs: number, snapReason: MindARPoseSnapReason | null = null,
      guard?: MindARJumpGuardParameters): MindARPresentationDecision {
      // Integrate the OLD target up to arrival, never apply new evidence backwards in time.
      sample(at, timeConstantMs)
      let decision: MindARPresentationDecision = 'following'
      if (guard && timeConstantMs > 0 && initialized && snapReason !== 'initial') {
        const translationLimit = guard.translationThresholdTargetUnits * guard.targetUnitScale
        const rotationLimit = guard.rotationThresholdDegrees * Math.PI / 180
        // Compare with the last trusted TARGET, not the lagging displayed pose.
        const far = targetPosition.distanceTo(next.position) > translationLimit ||
          targetQuaternion.angleTo(next.quaternion) > rotationLimit
        if (far) {
          pendingPosition.copy(next.position)
          pendingQuaternion.copy(next.quaternion)
          if (pendingAt === null) {
            pendingAt = coherentAt = at
            candidatePosition.copy(next.position)
            candidateQuaternion.copy(next.quaternion)
            return 'pending'
          }
          if (candidatePosition.distanceTo(next.position) > translationLimit / 2 ||
            candidateQuaternion.angleTo(next.quaternion) > rotationLimit / 2) {
            coherentAt = at
            candidatePosition.copy(next.position)
            candidateQuaternion.copy(next.quaternion)
          }
          if (at - coherentAt >= guard.confirmationMs) decision = 'confirmed'
          else if (at - pendingAt >= guard.maxWaitMs) decision = 'timeout'
          else return 'pending'
        } else if (pendingAt !== null) decision = 'cancelled'
      }
      pendingAt = null
      targetPosition.copy(next.position)
      targetQuaternion.copy(next.quaternion)
      // A relay jump is still uncertain tracking evidence. Snapping it here
      // bypassed this entire stage during the largest on-device disturbances.
      if (!initialized || snapReason === 'initial') {
        position.copy(targetPosition)
        quaternion.copy(targetQuaternion)
        matrix.compose(position, quaternion, unitScale)
        previousAt = at
        initialized = true
        decision = 'initial'
      }
      return timeConstantMs <= 0 ? 'bypass' : decision
    },
    reset() {
      initialized = false
      pendingAt = null
    },
  }
}
