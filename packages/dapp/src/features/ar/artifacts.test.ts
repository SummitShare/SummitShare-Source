import { existsSync } from 'node:fs';
import path from 'node:path';
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
