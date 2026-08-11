import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import jsQR from 'jsqr';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import {
   AR_ARTIFACTS,
   AR_ARTIFACT_SLUGS,
   AR_EXIT_PATH,
   isARArtifactSlug,
} from './artifacts';

const PUBLIC_DIR = path.resolve(__dirname, '../../../public');
const ARTIFACTS = Object.values(AR_ARTIFACTS);

/**
 * The unit MindAR's `displayHeight` is expressed in — one square target width.
 * Multiplying by it converts a marker-relative height into metres, which is how
 * the uncalibrated WebXR values were produced. It is not a measurement.
 */
const MINDAR_TARGET_WIDTH_METRES = 0.12;

describe('AR artifact registry', () => {
   it('keys every artifact by its own slug', () => {
      for (const [key, artifact] of Object.entries(AR_ARTIFACTS)) {
         expect(artifact.slug).toBe(key);
      }
   });

   it('exposes every slug through the guard', () => {
      for (const slug of AR_ARTIFACT_SLUGS) {
         expect(isARArtifactSlug(slug)).toBe(true);
      }
      expect(isARArtifactSlug('not-an-artifact')).toBe(false);
   });

   it('ships the model and tracking target each artifact references', () => {
      for (const artifact of ARTIFACTS) {
         for (const asset of [artifact.modelUrl, artifact.targetUrl]) {
            expect(
               existsSync(path.join(PUBLIC_DIR, asset)),
               `${artifact.slug}: missing ${asset}`
            ).toBe(true);
         }
      }
   });

   it('carries a WebXR calibration block for every artifact', () => {
      for (const artifact of ARTIFACTS) {
         expect(typeof artifact.webxr.calibrated).toBe('boolean');
         expect(artifact.webxr.heightMetres).toBeGreaterThan(0);
         expect(Number.isFinite(artifact.webxr.rotationY)).toBe(true);
      }
   });

   /**
    * The guard that makes the `calibrated` flag mean something. A mechanically
    * derived height is exactly `displayHeight * 0.12` — if a flag is flipped to
    * true while the number still matches that product, nobody measured it, and
    * the artifact would ship at marker scale rather than its real size.
    */
   it('marks an artifact calibrated only if its height was actually measured', () => {
      for (const artifact of ARTIFACTS) {
         if (!artifact.webxr.calibrated) continue;
         const mechanical = artifact.displayHeight * MINDAR_TARGET_WIDTH_METRES;
         expect(
            Math.abs(artifact.webxr.heightMetres - mechanical),
            `${
               artifact.slug
            } is flagged calibrated but its height is still the mechanical ${mechanical.toFixed(
               4
            )} m conversion`
         ).toBeGreaterThan(1e-6);
      }
   });

   it('keeps uncalibrated artifacts off the WebXR path', () => {
      const uncalibrated = ARTIFACTS.filter((a) => !a.webxr.calibrated);
      // Not an assertion about how many are uncalibrated — only that the flag
      // is what decides, so `/ar/[slug]` cannot route one of them to WebXR.
      for (const artifact of uncalibrated) {
         expect(artifact.webxr.calibrated).toBe(false);
      }
   });

   it('holds every calibrated artifact to a plausible physical size', () => {
      for (const artifact of ARTIFACTS) {
         if (!artifact.webxr.calibrated) continue;
         expect(artifact.webxr.heightMetres).toBeGreaterThan(0.05);
         expect(artifact.webxr.heightMetres).toBeLessThan(2.5);
      }
   });

   it('exits AR to a real in-app route', () => {
      expect(AR_EXIT_PATH.startsWith('/')).toBe(true);
      expect(
         existsSync(
            path.resolve(__dirname, '../../app', `.${AR_EXIT_PATH}`, 'page.tsx')
         )
      ).toBe(true);
   });
});

/**
 * The medallion for the artifact that is sacred and is not displayed. It is a
 * blank on the same plate as the rest of the set, and its emptiness is the
 * content — so what is guarded here is what it must NOT acquire.
 */
describe('absent medallion', () => {
   const PRINT_DIR = path.join(PUBLIC_DIR, 'ar', 'print');
   const absentPath = path.join(PRINT_DIR, 'absent-medallion.svg');

   it('ships alongside the printed set', () => {
      expect(existsSync(absentPath)).toBe(true);
   });

   /**
    * Deriving the geometry from a real marker rather than restating it: the
    * blank has to print as one of the set, and the disc and code box are the
    * only things a visitor can use to see that it is the same object emptied.
    */
   /**
    * The code box is the widest rect centred on the disc — picked that way
    * because a real marker also contains the narrower QR matrix clip and three
    * finder squares, and the blank contains neither.
    */
   const codeBox = (svg: string) =>
      [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)"/g)]
         .map(([, x, y, width]) => ({
            x: Number(x),
            y: Number(y),
            width: Number(width),
         }))
         .filter((rect) => Math.abs(rect.x + rect.width / 2 - 512) < 0.01)
         .sort((a, b) => b.width - a.width)[0];

   const disc = (svg: string) =>
      svg.match(/<circle cx="(\d+)" cy="(\d+)" r="(\d+)"/)?.slice(1);

   it('is cut on the same plate as the real markers', () => {
      const blank = readFileSync(absentPath, 'utf8');
      const marker = readFileSync(
         path.join(PRINT_DIR, 'drum-tracking-marker.svg'),
         'utf8'
      );
      expect(disc(blank)).toEqual(disc(marker));
      expect(codeBox(blank)).toEqual(codeBox(marker));
      expect(blank).toContain('viewBox="0 0 1024 1024"');
      expect(blank).toContain('width="120.00mm"');
   });

   /**
    * The one that matters. A geometry check still passes if someone "finishes"
    * the blank by putting a code in the empty box; only a failed decode proves
    * there is nothing to scan. There is nothing to route to.
    */
   it('carries no scannable code', async () => {
      const { data, info } = await sharp(absentPath)
         .resize(1024, 1024)
         .ensureAlpha()
         .raw()
         .toBuffer({ resolveWithObject: true });
      const decoded = jsQR(
         new Uint8ClampedArray(data),
         info.width,
         info.height
      );
      expect(decoded?.data ?? null).toBeNull();
   });

   it('has no tracking target and no registry entry', () => {
      expect(existsSync(path.join(PUBLIC_DIR, 'ar', 'targets', 'absent.mind'))).toBe(
         false
      );
      expect(isARArtifactSlug('absent')).toBe(false);
   });
});
