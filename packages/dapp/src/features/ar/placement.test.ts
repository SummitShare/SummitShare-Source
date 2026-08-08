import { describe, expect, it, vi } from 'vitest';
import { commitPlacement, type LocalFloorPose } from './placement';

const pose: LocalFloorPose = { matrix: new Float32Array(16) };

const anchorStub = () => {
   const del = vi.fn();
   return {
      del,
      anchor: {
         anchorSpace: { id: 'anchor-space' } as unknown as XRSpace,
         delete: del,
      } as unknown as XRAnchor,
   };
};

describe('commitPlacement', () => {
   it('anchors when anchor creation succeeds', async () => {
      const { anchor } = anchorStub();
      const placement = await commitPlacement({
         pose,
         source: 'hit-test',
         createAnchor: async () => anchor,
         fallback: 'fixed',
      });

      expect(placement.kind).toBe('anchored');
      if (placement.kind !== 'anchored') return;
      expect(placement.space).toBe(anchor.anchorSpace);
      expect(placement.initialPose).toBe(pose);
   });

   /**
    * The reason `commitPlacement` exists as its own unit. A hit-test result's
    * originating XRFrame goes inactive the moment the callback returns, so
    * `createAnchor` has to be invoked before the first await — if a refactor
    * moves it after one, anchoring fails on device and nowhere else.
    */
   it('invokes createAnchor synchronously, before any await', () => {
      const createAnchor = vi.fn(async () => anchorStub().anchor);
      void commitPlacement({
         pose,
         source: 'hit-test',
         createAnchor,
         fallback: 'fixed',
      });

      expect(createAnchor).toHaveBeenCalledTimes(1);
   });

   it('falls back to a fixed placement when anchoring is unavailable', async () => {
      const placement = await commitPlacement({
         pose,
         source: 'hit-test',
         createAnchor: null,
         fallback: 'fixed',
      });

      expect(placement.kind).toBe('fixed');
      if (placement.kind !== 'fixed') return;
      expect(placement.pose).toBe(pose);
      expect(placement.reason).toMatch(/unavailable/);
   });

   it('rejects instead of falling back when the policy says so', async () => {
      await expect(
         commitPlacement({
            pose,
            source: 'hit-test',
            createAnchor: null,
            fallback: 'reject',
         })
      ).rejects.toThrow(/unavailable/);
   });

   it('falls back when createAnchor throws synchronously', async () => {
      const placement = await commitPlacement({
         pose,
         source: 'marker',
         createAnchor: () => {
            throw new Error('frame inactive');
         },
         fallback: 'fixed',
      });

      expect(placement.kind).toBe('fixed');
      if (placement.kind !== 'fixed') return;
      expect(placement.reason).toMatch(/synchronously.*frame inactive/);
   });

   it('falls back when the anchor promise rejects', async () => {
      const placement = await commitPlacement({
         pose,
         source: 'hit-test',
         createAnchor: async () => {
            throw new Error('anchor limit reached');
         },
         fallback: 'fixed',
      });

      expect(placement.kind).toBe('fixed');
      if (placement.kind !== 'fixed') return;
      expect(placement.reason).toMatch(/anchor limit reached/);
   });

   it('falls back when the anchor resolves to nothing', async () => {
      const placement = await commitPlacement({
         pose,
         source: 'hit-test',
         createAnchor: async () => undefined,
         fallback: 'fixed',
      });

      expect(placement.kind).toBe('fixed');
   });

   it('propagates a rejection under the reject policy', async () => {
      await expect(
         commitPlacement({
            pose,
            source: 'hit-test',
            createAnchor: async () => {
               throw new Error('anchor limit reached');
            },
            fallback: 'reject',
         })
      ).rejects.toThrow('anchor limit reached');
   });

   it('deletes the anchor once, however many times release is called', async () => {
      const { anchor, del } = anchorStub();
      const placement = await commitPlacement({
         pose,
         source: 'hit-test',
         createAnchor: async () => anchor,
         fallback: 'fixed',
      });

      placement.release();
      placement.release();
      placement.release();

      expect(del).toHaveBeenCalledTimes(1);
   });
});
