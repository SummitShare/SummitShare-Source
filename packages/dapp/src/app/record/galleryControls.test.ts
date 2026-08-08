import { describe, expect, it } from 'vitest';
import { galleryControlState } from './galleryControls';

describe('galleryControlState', () => {
   it('hides the previous arrow on the first panel', () => {
      expect(galleryControlState(0, 3)).toEqual({
         activeIndex: 0,
         previousIndex: null,
         nextIndex: 1,
      });
   });

   it('offers both arrows in the middle', () => {
      expect(galleryControlState(1, 3)).toEqual({
         activeIndex: 1,
         previousIndex: 0,
         nextIndex: 2,
      });
   });

   it('hides the next arrow on the last panel', () => {
      expect(galleryControlState(2, 3)).toEqual({
         activeIndex: 2,
         previousIndex: 1,
         nextIndex: null,
      });
   });

   it('hides both arrows when there is only one panel', () => {
      expect(galleryControlState(0, 1)).toEqual({
         activeIndex: 0,
         previousIndex: null,
         nextIndex: null,
      });
   });

   it('never points an arrow past the ends', () => {
      // The observer resolves the index from a live DOM query; a stale or
      // detached node must not produce an out-of-range href.
      for (const index of [-5, -1, 3, 99]) {
         const state = galleryControlState(index, 3);
         expect(state.activeIndex).toBeGreaterThanOrEqual(0);
         expect(state.activeIndex).toBeLessThan(3);
         for (const neighbour of [state.previousIndex, state.nextIndex]) {
            if (neighbour === null) continue;
            expect(neighbour).toBeGreaterThanOrEqual(0);
            expect(neighbour).toBeLessThan(3);
         }
      }
   });

   it('degrades safely when there are no panels', () => {
      expect(galleryControlState(0, 0)).toEqual({
         activeIndex: 0,
         previousIndex: null,
         nextIndex: null,
      });
   });

   it('keeps neighbours adjacent to the active panel', () => {
      for (let index = 0; index < 3; index += 1) {
         const state = galleryControlState(index, 3);
         if (state.previousIndex !== null) {
            expect(state.previousIndex).toBe(state.activeIndex - 1);
         }
         if (state.nextIndex !== null) {
            expect(state.nextIndex).toBe(state.activeIndex + 1);
         }
      }
   });
});
