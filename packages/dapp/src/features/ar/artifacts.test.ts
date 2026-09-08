import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import jsQR from 'jsqr';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import {
   AR_ARTIFACTS,
   AR_ARTIFACT_SLUGS,
   AR_EXHIBITED_SLUGS,
   AR_EXIT_PATH,
   isARArtifactSlug,
} from './artifacts';
import type { WebXRHeightSource } from './artifacts';

const PUBLIC_DIR = path.resolve(__dirname, '../../../public');
const ARTIFACTS = Object.values(AR_ARTIFACTS);

/**
 * The unit MindAR's `displayHeight` is expressed in — one square target width.
 * It is the bridge between the two coordinate systems: multiplying by it turns a
 * marker-relative height into the metres WebXR renders in.
 *
 * Which direction it was applied is the whole point of `heightSource`. For a
 * 'placeholder' the metres were derived from the units and mean nothing. For an
 * 'exhibition' entry the units were derived from a chosen height in metres, and
 * the agreement is the thing worth guarding — that is what stops the two paths
 * drifting into rendering the same object at two different physical sizes.
 */
const MINDAR_TARGET_WIDTH_METRES = 0.12;

/** Both paths must agree on physical size to within a millimetre. */
const AGREEMENT_TOLERANCE_METRES = 1e-3;

const mechanicalHeight = (artifact: (typeof ARTIFACTS)[number]) =>
   artifact.displayHeight * MINDAR_TARGET_WIDTH_METRES;

/**
 * Widened on purpose. `AR_ARTIFACTS` is `as const`, so the inferred type is only
 * the sources currently in use — which makes a guard for any *unused* source
 * unreachable code that TypeScript rejects outright. The guards have to keep
 * compiling before an artifact of that kind exists; being there first is the
 * entire point of them.
 */
const sourceOf = (artifact: (typeof ARTIFACTS)[number]): WebXRHeightSource =>
   artifact.webxr.heightSource;

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

   it('carries a WebXR block with a declared provenance for every artifact', () => {
      for (const artifact of ARTIFACTS) {
         expect(['measured', 'exhibition', 'vitrine', 'placeholder']).toContain(
            artifact.webxr.heightSource
         );
         expect(artifact.webxr.heightMetres).toBeGreaterThan(0);
         expect(Number.isFinite(artifact.webxr.rotationY)).toBe(true);
      }
   });

   /**
    * A measured height has no reason to land on `displayHeight * 0.12`. If it
    * does, nobody measured anything — someone relabelled the mechanical
    * conversion, and the artifact ships at marker scale rather than its real
    * size. 'exhibition' is deliberately exempt: there the units are derived
    * *from* the metres, so agreement is correct by construction and is asserted
    * in the other direction below.
    */
   it('does not let a mechanical conversion be relabelled as measured', () => {
      for (const artifact of ARTIFACTS) {
         if (sourceOf(artifact) !== 'measured') continue;
         const mechanical = mechanicalHeight(artifact);
         expect(
            Math.abs(artifact.webxr.heightMetres - mechanical),
            `${artifact.slug} claims 'measured' but its height is still the ` +
               `mechanical ${mechanical.toFixed(4)} m conversion`
         ).toBeGreaterThan(1e-6);
      }
   });

   /**
    * The 156 mm drum, pinned. That shipped because one field fed both paths and
    * the two read it in different units. They are separate fields now, which
    * removes the coupling but not the risk: nothing stops someone editing the
    * metres for the vitrine and leaving the MindAR units behind, so the same
    * object would render at two sizes depending on the visitor's phone.
    */
   it('keeps both paths at one physical size for exhibition artifacts', () => {
      for (const artifact of ARTIFACTS) {
         if (sourceOf(artifact) !== 'exhibition') continue;
         expect(
            Math.abs(artifact.webxr.heightMetres - mechanicalHeight(artifact)),
            `${artifact.slug}: WebXR renders it at ${artifact.webxr.heightMetres} m ` +
               `but MindAR at ${mechanicalHeight(artifact).toFixed(4)} m ` +
               `(displayHeight ${artifact.displayHeight}). Derive the units from ` +
               `the metres: displayHeight = heightMetres / ${MINDAR_TARGET_WIDTH_METRES}.`
         ).toBeLessThan(AGREEMENT_TOLERANCE_METRES);
      }
   });

   /**
    * The counterpart to the guard above, for the one source allowed to diverge.
    * A 'vitrine' height is a deliberate enlargement for room-scale legibility,
    * so it must be STRICTLY greater than the marker-relative size. That is what
    * separates a declared choice from the 156 mm drum: an accidental edit that
    * leaves the two equal, or shrinks WebXR below MindAR, still fails here.
    */
   it('keeps a vitrine height a declared enlargement, not an accident', () => {
      for (const artifact of ARTIFACTS) {
         if (sourceOf(artifact) !== 'vitrine') continue;
         const mechanical = mechanicalHeight(artifact);
         expect(
            artifact.webxr.heightMetres,
            `${artifact.slug} is labelled 'vitrine' but renders at ` +
               `${artifact.webxr.heightMetres} m, which is not larger than the ` +
               `${mechanical.toFixed(4)} m MindAR renders. Either enlarge it or ` +
               `relabel it 'exhibition' and put both paths back in step.`
         ).toBeGreaterThan(mechanical + AGREEMENT_TOLERANCE_METRES);
      }
   });

   /**
    * A placeholder must actually be one. The label is what tells the next person
    * the number is marker-relative and unmeasured; a real height hiding behind it
    * would be lost work, and an arbitrary number would be a lie.
    */
   it('keeps placeholders honestly mechanical', () => {
      for (const artifact of ARTIFACTS) {
         if (sourceOf(artifact) !== 'placeholder') continue;
         expect(
            Math.abs(artifact.webxr.heightMetres - mechanicalHeight(artifact)),
            `${artifact.slug} is labelled a placeholder but its height is not ` +
               `the mechanical conversion — relabel it 'measured' or 'exhibition'`
         ).toBeLessThan(1e-9);
      }
   });

   /**
    * Every artifact now reaches WebXR on a device that supports it, so a bad
    * height is rendered rather than routed around. This is the only thing left
    * standing between a typo and a 50 m mask in the room.
    */
   it('holds every artifact to a plausible physical size', () => {
      for (const artifact of ARTIFACTS) {
         expect(
            artifact.webxr.heightMetres,
            `${artifact.slug} renders at ${artifact.webxr.heightMetres} m`
         ).toBeGreaterThan(0.05);
         expect(artifact.webxr.heightMetres).toBeLessThan(2.5);
      }
   });

   /**
    * The exhibited objects are the ones a visitor actually meets, and a
    * placeholder height on one of them is the failure that reaches the public.
    */
   it('leaves no exhibited artifact on a placeholder height', () => {
      for (const slug of AR_EXHIBITED_SLUGS) {
         expect(
            AR_ARTIFACTS[slug].webxr.heightSource,
            `${slug} is on a plinth but its height was never chosen`
         ).not.toBe('placeholder');
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
