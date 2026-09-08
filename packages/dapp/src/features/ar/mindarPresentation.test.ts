import { Matrix4, Quaternion, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { createMindARPosePresentation } from './mindarPresentation';

const guard = {
   targetUnitScale: 1024,
   translationThresholdTargetUnits: 0.5,
   rotationThresholdDegrees: 45,
   confirmationMs: 120,
   maxWaitMs: 250,
};
const pose = (x: number, degrees = 0) => {
   const position = new Vector3(x, 0, -3072);
   const quaternion = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      (degrees * Math.PI) / 180
   );
   const scale = new Vector3(1, 1, 1);
   return {
      position,
      quaternion,
      scale,
      matrix: new Matrix4().compose(position, quaternion, scale),
   };
};

describe('phone-validated MindAR presentation', () => {
   it('cancels transient jumps and eases confirmed targets without teleporting', () => {
      const p = createMindARPosePresentation();
      p.setTarget(pose(0), 0, 100, 'initial', guard);
      expect(p.setTarget(pose(2048, 80), 100, 100, 'jump', guard)).toBe(
         'pending'
      );
      expect(p.sample(140, 100)?.position.x).toBe(0);
      expect(p.setTarget(pose(0), 160, 100, 'jump', guard)).toBe('cancelled');
      expect(p.setTarget(pose(2048, 80), 300, 100, 'jump', guard)).toBe(
         'pending'
      );
      expect(p.setTarget(pose(2048, 80), 419, 100, null, guard)).toBe('pending');
      expect(p.setTarget(pose(2048, 80), 420, 100, null, guard)).toBe(
         'confirmed'
      );
      expect(p.sample(420, 100)?.position.x).toBe(0);
      expect(p.sample(1420, 100)?.position.x).toBeCloseTo(2048, 0);
   });

   it('bounds incoherent candidates without promoting stale evidence on render ticks', () => {
      const p = createMindARPosePresentation();
      p.setTarget(pose(0), 0, 100, 'initial', guard);
      p.setTarget(pose(2048, 80), 100, 100, 'jump', guard);
      expect(p.sample(1000, 100)?.position.x).toBe(0);
      expect(p.setTarget(pose(4096, -80), 1000, 100, null, guard)).toBe(
         'timeout'
      );
      expect(p.sample(1000, 100)?.position.x).toBe(0);
      expect(p.sample(1100, 100)!.position.x).toBeGreaterThan(0);
   });

   it('owns pending data and supports immediate bypass and loss/reset', () => {
      const p = createMindARPosePresentation();
      p.setTarget(pose(0), 0, 100, 'initial', guard);
      const input = pose(2048, 80);
      p.setTarget(input, 100, 100, 'jump', guard);
      input.position.x = 99999;
      input.quaternion.identity();
      expect(p.sample(150, 0)?.position.x).toBe(2048);
      expect(
         p.sample(150, 0)!.quaternion.angleTo(pose(0, 80).quaternion)
      ).toBeLessThan(1e-6);
      p.setTarget(pose(-2048, -80), 200, 100, 'jump', guard);
      p.reset();
      expect(p.sample(250, 100)).toBeNull();
      expect(p.setTarget(pose(-4096), 300, 100, 'initial', guard)).toBe(
         'initial'
      );
      expect(p.sample(300, 100)?.position.x).toBe(-4096);
   });

   it('uses target units and quaternion orientation, not quaternion sign', () => {
      for (const scale of [8, 1024, 4096]) {
         const p = createMindARPosePresentation(),
            settings = { ...guard, targetUnitScale: scale };
         p.setTarget(pose(0), 0, 100, 'initial', settings);
         expect(p.setTarget(pose(scale), 100, 100, null, settings)).toBe(
            'pending'
         );
         expect(p.setTarget(pose(scale), 220, 100, null, settings)).toBe(
            'confirmed'
         );
      }
      const p = createMindARPosePresentation();
      p.setTarget(pose(0), 0, 100, 'initial', guard);
      expect(p.setTarget(pose(0, 80), 100, 100, null, guard)).toBe('pending');
      const antipodal = pose(0, 80);
      antipodal.quaternion.set(
         ...(antipodal.quaternion.toArray().map((v) => -v) as [
            number,
            number,
            number,
            number,
         ])
      );
      expect(p.setTarget(antipodal, 220, 100, null, guard)).toBe('confirmed');
   });

   it('keeps ordinary motion identical to continuous response at different cadences', () => {
      for (const hz of [8, 28, 60]) {
         const reference = createMindARPosePresentation(),
            guarded = createMindARPosePresentation();
         for (let i = 0; i < hz * 2; i++) {
            const at = (i * 1000) / hz,
               input = pose(at / 10, at / 100);
            reference.setTarget(input, at, 100);
            expect(guarded.setTarget(input, at, 100, null, guard)).not.toBe(
               'pending'
            );
            const a = reference.sample(at, 100)!,
               b = guarded.sample(at, 100)!;
            expect(a.position.distanceTo(b.position)).toBeLessThan(1e-9);
            expect(a.quaternion.angleTo(b.quaternion)).toBeLessThan(1e-6);
         }
      }
   });
});
