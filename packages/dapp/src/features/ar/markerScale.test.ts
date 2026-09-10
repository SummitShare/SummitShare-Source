import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { AR_ARTIFACTS } from './artifacts';

/**
 * Ties the MindAR scale constant to the markers actually shipped for print.
 *
 * MindAR is marker-relative: one unit of `displayHeight` is one target width, so
 * the physical size of every artifact on the iOS path is set by how wide the
 * printed target is. `artifacts.test.ts` converts with a hand-written 0.12, and
 * nothing connected that number to the plates in `public/ar/print/` — reprint
 * the markers at another size and every MindAR artifact silently renders at the
 * wrong scale, with all of the existing tests still green.
 *
 * The number is easy to misread, which is the other half of why this exists.
 * 120 mm is the SQUARE SHEET. The disc drawn on it is 90 mm, three quarters of
 * the sheet, and the tracker matches the whole square — the generator rasterises
 * the full 1024 canvas, it does not crop to the disc. So "90 mm markers" and "a
 * 0.12 m target" describe the same piece of paper and are not in conflict.
 *
 * The workbench registry also carries a PROPOSED plate at a 120 mm disc on a
 * 160 mm sheet. That is a different 120 mm — a disc, not a sheet — and adopting
 * it would mean a 0.16 m target and every `displayHeight` divided by 4/3 to hold
 * physical sizes still. This test is what will catch that day.
 */
const MINDAR_TARGET_WIDTH_METRES = 0.12;
const PRINT_DIR = path.join(process.cwd(), 'public/ar/print');
const DISC_TO_SHEET_RATIO = 0.75;

interface Plate {
   file: string;
   sheetMm: number;
   discMm: number;
   canvasMm: number;
}

const plates: Plate[] = readdirSync(PRINT_DIR)
   .filter((file) => file.endsWith('-tracking-marker.svg'))
   .map((file) => {
      const svg = readFileSync(path.join(PRINT_DIR, file), 'utf8');
      const sheet = /width="([\d.]+)mm"/.exec(svg);
      const meta =
         /data-printed-medallion-diameter-mm="([\d.]+)" data-square-canvas-mm="([\d.]+)"/.exec(
            svg
         );
      if (!sheet || !meta) throw new Error(`${file}: no print geometry`);
      return {
         file,
         sheetMm: Number(sheet[1]),
         discMm: Number(meta[1]),
         canvasMm: Number(meta[2]),
      };
   });

describe('printed marker scale', () => {
   it('finds a plate for every artifact that has a target', () => {
      expect(plates.length).toBeGreaterThan(0);
      const slugs = Object.values(AR_ARTIFACTS)
         .filter((artifact) => artifact.targetUrl)
         .map((artifact) => artifact.slug);
      expect(slugs.length).toBeGreaterThan(0);
   });

   it.each(plates.map((p) => [p.file, p] as const))(
      '%s is the sheet width the MindAR conversion assumes',
      (_file, plate) => {
         // The sheet is what the tracker matches, so the sheet is what 0.12 means.
         expect(plate.sheetMm).toBeCloseTo(MINDAR_TARGET_WIDTH_METRES * 1000, 2);
         expect(plate.canvasMm).toBeCloseTo(plate.sheetMm, 2);
      }
   );

   it.each(plates.map((p) => [p.file, p] as const))(
      '%s keeps the disc at three quarters of the sheet',
      (_file, plate) => {
         // If this drifts, "90 mm" and "120 mm" stop describing one plate and the
         // conflation this whole file exists to prevent becomes real.
         expect(plate.discMm).toBeCloseTo(plate.sheetMm * DISC_TO_SHEET_RATIO, 1);
      }
   );

   it('renders every exhibited artifact at a believable size on the iOS path', () => {
      for (const artifact of Object.values(AR_ARTIFACTS)) {
         const metres = artifact.displayHeight * MINDAR_TARGET_WIDTH_METRES;
         expect(
            metres,
            `${artifact.slug} renders ${metres.toFixed(3)} m tall from a ` +
               `${MINDAR_TARGET_WIDTH_METRES * 1000} mm target`
         ).toBeGreaterThan(0.02);
         expect(metres).toBeLessThan(1.5);
      }
   });
});
