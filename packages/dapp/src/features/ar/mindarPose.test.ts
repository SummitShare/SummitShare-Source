import { Matrix4, Quaternion, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import {
   createMindARPoseRelay,
   type MindARPoseParameters,
   type MindARPoseUpdate,
} from './mindarPose';

const PARAMETERS: MindARPoseParameters = {
   poseFilterMinCutOff: 1.5,
   poseFilterBeta: 0,
   poseRotationFilterBeta: 0.05,
   poseTranslationJumpLimit: 10,
   poseRotationJumpLimitDegrees: 180,
   warmupUpdates: 0,
   warmupFadeMs: 0,
   warmupTimeoutMs: 0,
   staleFadeUpdates: 4,
   staleFadeMs: 150,
   holdTranslationTargetUnits: 0.0025,
   holdRotationDegrees: 0.45,
   holdEngageUpdates: 6,
   depthFilterMinCutOff: 0.5,
   depthRangeTargetUnits: null,
};

const poseMatrix = (
   x = 0,
   z = 0,
   yawDegrees = 0,
   scale = 1
) =>
   new Matrix4().compose(
      new Vector3(x, 0, z),
      new Quaternion().setFromAxisAngle(
         new Vector3(0, 1, 0),
         (yawDegrees * Math.PI) / 180
      ),
      new Vector3(scale, scale, scale)
   );

const updateRelay = (
   relay: ReturnType<typeof createMindARPoseRelay>,
   matrix: Matrix4,
   sampledAt: number,
   parameters: MindARPoseParameters = PARAMETERS
) =>
   relay.update({
      anchorVisible: true,
      matrix,
      sampledAt,
      parameters,
   });

const acceptedPose = (update: MindARPoseUpdate) => {
   expect(update.status).toBe('accepted');
   expect(update.filteredPose).not.toBeNull();
   if (update.filteredPose === null) throw new Error('Expected an accepted pose.');
   return update.filteredPose;
};

describe('createMindARPoseRelay stabilisation', () => {
   it('warms for exactly N accepted updates without counting unchanged updates', () => {
      const relay = createMindARPoseRelay();
      const parameters = {
         ...PARAMETERS,
         warmupUpdates: 3,
         warmupFadeMs: 200,
      };
      const firstMatrix = poseMatrix();

      const first = updateRelay(relay, firstMatrix, 0, parameters);
      const unchanged = updateRelay(relay, firstMatrix, 50, parameters);
      const second = updateRelay(relay, poseMatrix(0.001), 100, parameters);
      const third = updateRelay(relay, poseMatrix(0.002), 200, parameters);
      const fourth = updateRelay(relay, poseMatrix(0.003), 300, parameters);

      expect([first.warming, second.warming, third.warming, fourth.warming]).toEqual([
         true,
         true,
         true,
         false,
      ]);
      expect(unchanged.status).toBe('unchanged');
      expect(unchanged.warming).toBe(true);
      expect(third.recommendedOpacity).toBe(0);
      expect(fourth.recommendedOpacity).toBe(0.5);
   });

   it('counts unchanged runs and resets them on an accepted update', () => {
      const relay = createMindARPoseRelay();
      const matrix = poseMatrix();

      expect(updateRelay(relay, matrix, 0).staleRunLength).toBe(0);
      expect(updateRelay(relay, matrix, 10).staleRunLength).toBe(1);
      expect(updateRelay(relay, matrix, 20).staleRunLength).toBe(2);
      expect(updateRelay(relay, poseMatrix(0.001), 30).staleRunLength).toBe(0);
   });

   it('engages after the configured run and releases on the first outside pose', () => {
      const relay = createMindARPoseRelay();
      const parameters = {
         ...PARAMETERS,
         poseFilterMinCutOff: 1000,
         holdTranslationTargetUnits: 0.01,
         holdRotationDegrees: 1,
         holdEngageUpdates: 3,
      };

      updateRelay(relay, poseMatrix(), 0, parameters);
      expect(updateRelay(relay, poseMatrix(0.001), 100, parameters).held).toBe(false);
      expect(updateRelay(relay, poseMatrix(0.002), 200, parameters).held).toBe(false);
      const engaged = updateRelay(relay, poseMatrix(0.003), 300, parameters);
      expect(engaged.held).toBe(true);
      expect(engaged.holdRunLength).toBe(3);

      const released = updateRelay(relay, poseMatrix(0.03), 400, parameters);
      expect(released.held).toBe(false);
      expect(released.holdRunLength).toBe(0);
   });

   it('compares against the held pose so slow drift cannot accumulate', () => {
      const relay = createMindARPoseRelay();
      const parameters = {
         ...PARAMETERS,
         poseFilterMinCutOff: 1000,
         holdTranslationTargetUnits: 0.01,
         holdEngageUpdates: 3,
      };

      updateRelay(relay, poseMatrix(), 0, parameters);
      expect(updateRelay(relay, poseMatrix(0.006), 100, parameters).holdRunLength).toBe(1);
      expect(updateRelay(relay, poseMatrix(0.012), 200, parameters).holdRunLength).toBe(0);
      const thirdDrift = updateRelay(relay, poseMatrix(0.018), 300, parameters);
      expect(thirdDrift.held).toBe(false);
      expect(thirdDrift.holdRunLength).toBe(1);
   });

   it('emits a bit-identical matrix for every pose while held', () => {
      const relay = createMindARPoseRelay();
      const parameters = {
         ...PARAMETERS,
         poseFilterMinCutOff: 1000,
         holdTranslationTargetUnits: 0.01,
         holdEngageUpdates: 2,
      };

      updateRelay(relay, poseMatrix(), 0, parameters);
      updateRelay(relay, poseMatrix(0.001), 100, parameters);
      const engaged = updateRelay(relay, poseMatrix(0.002), 200, parameters);
      const heldElements = [...acceptedPose(engaged).matrix.elements];
      const stillHeld = updateRelay(relay, poseMatrix(0.003), 300, parameters);

      expect(stillHeld.held).toBe(true);
      expect([...acceptedPose(stillHeld).matrix.elements]).toEqual(heldElements);
   });

   it('does not advance the hold run on unchanged updates', () => {
      const relay = createMindARPoseRelay();
      const parameters = {
         ...PARAMETERS,
         poseFilterMinCutOff: 1000,
         holdTranslationTargetUnits: 0.01,
         holdEngageUpdates: 2,
      };
      const firstMatrix = poseMatrix();
      const secondMatrix = poseMatrix(0.001);

      updateRelay(relay, firstMatrix, 0, parameters);
      expect(updateRelay(relay, secondMatrix, 100, parameters).holdRunLength).toBe(1);
      expect(updateRelay(relay, secondMatrix, 200, parameters).holdRunLength).toBe(1);
      expect(updateRelay(relay, poseMatrix(0.002), 300, parameters).held).toBe(true);
   });

   it('releases immediately when rotation alone leaves tolerance', () => {
      const relay = createMindARPoseRelay();
      const parameters = {
         ...PARAMETERS,
         poseFilterMinCutOff: 1000,
         holdTranslationTargetUnits: 1,
         holdRotationDegrees: 0.5,
         holdEngageUpdates: 1,
      };

      updateRelay(relay, poseMatrix(), 0, parameters);
      expect(updateRelay(relay, poseMatrix(0, 0, 0.1), 100, parameters).held).toBe(true);
      expect(updateRelay(relay, poseMatrix(0, 0, 2), 200, parameters).held).toBe(false);
   });

   it('continues advancing the filter while the emitted pose is held', () => {
      const relay = createMindARPoseRelay();
      const holdingParameters = {
         ...PARAMETERS,
         poseFilterMinCutOff: 1,
         holdTranslationTargetUnits: 1,
         holdEngageUpdates: 1,
      };

      updateRelay(relay, poseMatrix(), 0, holdingParameters);
      updateRelay(relay, poseMatrix(0.05), 100, holdingParameters);
      updateRelay(relay, poseMatrix(0.1), 200, holdingParameters);
      updateRelay(relay, poseMatrix(0.15), 300, holdingParameters);
      updateRelay(relay, poseMatrix(0.2), 400, holdingParameters);

      const released = updateRelay(relay, poseMatrix(0.21), 500, {
         ...holdingParameters,
         holdTranslationTargetUnits: 0.01,
      });
      expect(released.held).toBe(false);
      expect(acceptedPose(released).position.x).toBeGreaterThan(0.15);
   });

   it('breaks an active hold immediately when the jump gate snaps', () => {
      const relay = createMindARPoseRelay();
      const parameters = {
         ...PARAMETERS,
         poseFilterMinCutOff: 1000,
         poseTranslationJumpLimit: 0.1,
         holdTranslationTargetUnits: 1,
         holdEngageUpdates: 1,
      };

      updateRelay(relay, poseMatrix(), 0, parameters);
      expect(updateRelay(relay, poseMatrix(0.01), 100, parameters).held).toBe(true);
      const snapped = updateRelay(relay, poseMatrix(1), 200, parameters);

      expect(snapped.snapReason).toBe('jump');
      expect(snapped.held).toBe(false);
      expect(snapped.holdRunLength).toBe(0);
   });

   it('clamps depth in target units and reports the clamp', () => {
      const relay = createMindARPoseRelay();
      const clamped = updateRelay(relay, poseMatrix(0, 5, 0, 2), 0, {
         ...PARAMETERS,
         depthRangeTargetUnits: { min: -1, max: 1 },
      });

      expect(clamped.depthClamped).toBe(true);
      expect(clamped.targetUnitScale).toBe(2);
      expect(acceptedPose(clamped).position.z).toBe(2);
   });

   it('damps depth independently below the main position cutoff', () => {
      const relay = createMindARPoseRelay();
      const parameters = {
         ...PARAMETERS,
         poseFilterMinCutOff: 10,
         depthFilterMinCutOff: 0.1,
         holdTranslationTargetUnits: 0,
      };

      updateRelay(relay, poseMatrix(), 0, parameters);
      const moved = acceptedPose(
         updateRelay(
            relay,
            new Matrix4().makeTranslation(1, 0, 1),
            100,
            parameters
         )
      );

      expect(moved.position.z).toBeGreaterThan(0);
      expect(moved.position.z).toBeLessThan(moved.position.x / 10);
   });

   it('reaches both opacity endpoints for warmup and stale fades', () => {
      const relay = createMindARPoseRelay();
      const parameters = {
         ...PARAMETERS,
         warmupUpdates: 1,
         warmupFadeMs: 100,
         staleFadeUpdates: 0,
         staleFadeMs: 100,
      };
      const firstMatrix = poseMatrix();
      const secondMatrix = poseMatrix(0.001);

      expect(updateRelay(relay, firstMatrix, 0, parameters).recommendedOpacity).toBe(0);
      expect(updateRelay(relay, secondMatrix, 100, parameters).recommendedOpacity).toBe(1);
      expect(updateRelay(relay, secondMatrix, 100, parameters).recommendedOpacity).toBe(1);
      expect(updateRelay(relay, secondMatrix, 200, parameters).recommendedOpacity).toBe(0);
      expect(updateRelay(relay, poseMatrix(0.002), 200, parameters).recommendedOpacity).toBe(0);
      expect(updateRelay(relay, poseMatrix(0.003), 300, parameters).recommendedOpacity).toBe(1);
   });

   it('clears all stabilisation counters on reset', () => {
      const relay = createMindARPoseRelay();
      const parameters = {
         ...PARAMETERS,
         warmupUpdates: 2,
         holdTranslationTargetUnits: 1,
         holdEngageUpdates: 1,
      };
      const firstMatrix = poseMatrix();

      updateRelay(relay, firstMatrix, 0, parameters);
      updateRelay(relay, poseMatrix(0.001), 100, parameters);
      updateRelay(relay, poseMatrix(0.001), 200, parameters);
      relay.reset();
      const afterReset = updateRelay(relay, firstMatrix, 300, parameters);

      expect(afterReset.staleRunLength).toBe(0);
      expect(afterReset.holdRunLength).toBe(0);
      expect(afterReset.held).toBe(false);
      expect(afterReset.warming).toBe(true);
      expect(afterReset.recommendedOpacity).toBe(0);
   });
});

describe('acquisition warmup fail-safe', () => {
   // Regression: the warmup resets on every target re-acquisition, so under
   // marginal tracking — target found and lost faster than the warmup can
   // complete — the artifact stayed hidden forever while the pose read
   // 'accepted'. The timeout clock has to outlive reset() or it restarts before
   // it can ever expire. Both properties are asserted here because fixing only
   // the first still left the artifact flickering between 0 and half opacity.
   const parameters: MindARPoseParameters = {
      ...PARAMETERS,
      warmupUpdates: 3,
      warmupFadeMs: 200,
      warmupTimeoutMs: 600,
   };

   it('reveals the artifact even when re-acquisition keeps resetting it', () => {
      const relay = createMindARPoseRelay();
      let sampledAt = 1000;
      let last: MindARPoseUpdate | null = null;

      for (let index = 0; index < 12; index += 1) {
         if (index > 0 && index % 2 === 0) relay.reset();
         last = updateRelay(relay, poseMatrix(index * 0.0001), sampledAt, parameters);
         sampledAt += 100;
      }

      expect(last?.warming).toBe(false);
      expect(last?.recommendedOpacity).toBe(1);
   });

   it('does not re-fade from zero on every re-acquisition once revealed', () => {
      const relay = createMindARPoseRelay();
      let sampledAt = 1000;
      for (let index = 0; index < 6; index += 1) {
         updateRelay(relay, poseMatrix(index * 0.0001), sampledAt, parameters);
         sampledAt += 100;
      }

      relay.reset();
      const afterReset = updateRelay(relay, poseMatrix(0.001), sampledAt, parameters);
      expect(afterReset.recommendedOpacity).toBe(1);
   });
});
