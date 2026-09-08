import { describe, expect, it } from 'vitest';
import {
   cropMuralSvg,
   cropViewBox,
   parseViewBox,
   portraitVariant,
   PORTRAIT_CROP_ASPECT,
   PORTRAIT_SOURCE_MAX_VIEWPORT_ASPECT,
   panelAspect,
} from './recordCrops.mjs';

const MURAL = { minX: 0, minY: 0, width: 1200, height: 540 };

/**
 * An independent model of `object-fit: cover` + `object-position: 50% 50%`:
 * which slice of the source ends up on screen, in source units. Written from
 * the CSS definition rather than from the implementation above, so the
 * equivalence test below is a real cross-check and not a restatement.
 */
const coverWindow = (source, panelAspect) => {
   const sourceAspect = source.width / source.height;
   const visibleWidth =
      sourceAspect > panelAspect ? source.height * panelAspect : source.width;
   const visibleHeight =
      sourceAspect > panelAspect ? source.height : source.width / panelAspect;
   return {
      minX: source.minX + (source.width - visibleWidth) / 2,
      minY: source.minY + (source.height - visibleHeight) / 2,
      width: visibleWidth,
      height: visibleHeight,
   };
};

const close = (a, b) => {
   expect(a.minX).toBeCloseTo(b.minX, 6);
   expect(a.minY).toBeCloseTo(b.minY, 6);
   expect(a.width).toBeCloseTo(b.width, 6);
   expect(a.height).toBeCloseTo(b.height, 6);
};

describe('parseViewBox', () => {
   it('reads the shipped mural header', () => {
      expect(parseViewBox('<svg viewBox="0 0 1200 540">')).toEqual(MURAL);
   });

   it('refuses to guess when the viewBox is missing or unusable', () => {
      expect(() => parseViewBox('<svg>')).toThrow(/no viewBox/);
      expect(() => parseViewBox('<svg viewBox="0 0 1200">')).toThrow(
         /unparseable/
      );
      expect(() => parseViewBox('<svg viewBox="0 0 0 540">')).toThrow(
         /degenerate/
      );
   });
});

describe('cropViewBox', () => {
   it('takes the centred square of the shipped mural', () => {
      expect(cropViewBox(MURAL)).toEqual({
         minX: 330,
         minY: 0,
         width: 540,
         height: 540,
      });
   });

   it('leaves a source already narrower than the crop alone', () => {
      const tall = { minX: 0, minY: 0, width: 300, height: 540 };
      expect(cropViewBox(tall)).toEqual(tall);
   });
});

/**
 * The property the whole change rests on: for every portrait panel, cropping
 * the viewBox must not change which artwork is visible. If this fails, the
 * crop is showing something the current build does not.
 */
describe('the crop is invisible to the viewer', () => {
   const PANEL_ASPECTS = [0.36, 0.42, 0.46, 0.5, 0.54, 0.62, 0.7, 0.8, 0.9, 0.99];

   it.each(PANEL_ASPECTS)('shows the same slice at panel aspect %s', (aspect) => {
      close(coverWindow(cropViewBox(MURAL), aspect), coverWindow(MURAL, aspect));
   });

   it('is exactly the boundary that holds: a landscape panel would differ', () => {
      const wide = 1.6;
      expect(coverWindow(cropViewBox(MURAL), wide).width).not.toBeCloseTo(
         coverWindow(MURAL, wide).width,
         6
      );
   });

   it('holds right up to the square crop and no further', () => {
      close(
         coverWindow(cropViewBox(MURAL), PORTRAIT_CROP_ASPECT),
         coverWindow(MURAL, PORTRAIT_CROP_ASPECT)
      );
   });
});

describe('cropMuralSvg', () => {
   it('rewrites only the viewBox and keeps every path', () => {
      const svg =
         '<svg viewBox="0 0 1200 540"><defs><path d="M0 0h9"/></defs><use href="#a"/></svg>';
      const cropped = cropMuralSvg(svg);
      expect(cropped).toContain('viewBox="330 0 540 540"');
      expect(cropped).toContain('<path d="M0 0h9"/>');
      expect(cropped).toContain('<use href="#a"/>');
      expect(cropped.length).toBeCloseTo(svg.length, -1);
   });

   it('is idempotent, so regenerating never compounds the crop', () => {
      const once = cropMuralSvg('<svg viewBox="0 0 1200 540"/>');
      expect(cropMuralSvg(once)).toBe(once);
   });
});

describe('portraitVariant', () => {
   it('maps each mural to its portrait sibling', () => {
      expect(portraitVariant('graphics-1.svg')).toBe('graphics-1-portrait.svg');
   });

   it('leaves a name it does not recognise alone', () => {
      expect(portraitVariant('graphics-1.png')).toBe('graphics-1.png');
   });
});

/**
 * The media query is only correct if every viewport it matches produces a panel
 * narrower than the square crop. Comment-level reasoning is what put a wrong
 * `cy` formula in the intrinsics probe, so this is asserted instead.
 */
describe('the portrait breakpoint is provably safe', () => {
   const VIEWPORTS = [
      [320, 568],
      [360, 640],
      [375, 667],
      [390, 844],
      [393, 873],
      [412, 915],
      [414, 896],
      [428, 926],
      [430, 932],
      [480, 640],
      [600, 800],
      [768, 1024],
      [810, 1080],
      [834, 1112],
      [900, 1200],
   ];

   it.each(VIEWPORTS)('%ix%i keeps the panel narrower than the crop', (w, h) => {
      const viewportAspect = w / h;
      if (viewportAspect > PORTRAIT_SOURCE_MAX_VIEWPORT_ASPECT) return; // served the full mural
      expect(panelAspect(w, h)).toBeLessThanOrEqual(PORTRAIT_CROP_ASPECT);
   });

   it('holds at the exact breakpoint for any plausible height', () => {
      for (let h = 480; h <= 1600; h += 1) {
         const w = h * PORTRAIT_SOURCE_MAX_VIEWPORT_ASPECT;
         expect(panelAspect(w, h)).toBeLessThanOrEqual(PORTRAIT_CROP_ASPECT);
      }
   });

   it('the panel is always wider-aspect than the viewport, so orientation alone would not do', () => {
      expect(panelAspect(390, 844)).toBeGreaterThan(390 / 844);
   });
});
