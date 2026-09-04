/**
 * Where a visitor lands when AR ends, by either viewer's route out: the
 * exhibition record. Leaving them on a dead start screen ends the encounter at
 * the object; this returns them to the wall texts that frame it.
 */
export const AR_EXIT_PATH = '/record';

/**
 * Two calibrations per artifact, deliberately not shared.
 *
 * `displayHeight` / `rotationY` are the **MindAR** values: the upright model
 * height in square-target units above the lower edge of the vertical medallion,
 * yawed around the marker image's up axis.
 *
 * `webxr` is the **WebXR** value: `heightMetres` is a real-world height in the
 * room frame, and `nudge` is a metric offset from the tapped placement point.
 * The two paths do not place the artifact against the same thing — MindAR pins
 * it to a printed medallion, WebXR to a hit-test surface — so one number cannot
 * serve both. They were shared once and the WebXR drum shipped at 156 mm.
 *
 * `webxr.heightSource` records where `heightMetres` came from. It is
 * documentation and a test hook — it does NOT decide which viewer runs.
 * Routing is a capability question, answered in `ARClient`.
 *
 * It used to gate routing, and that was a mistake worth remembering. The
 * reasoning was that an unmeasured height would render, say, an 11.8 cm mask,
 * so such artifacts should stay on MindAR. But a mechanical height is exactly
 * `displayHeight * 0.12`, which is the same physical size MindAR renders
 * against its 120 mm marker — so the gate was withholding WebXR to avoid a size
 * error that the fallback reproduced anyway. Meanwhile it silently pushed every
 * Android visitor onto the marker-relative path for any artifact nobody had
 * measured yet, which is the degraded experience, not the safe one. A data
 * problem was being solved with a routing switch. Fix heights as heights.
 *
 *   'measured'    — read off a device against the physical object.
 *   'exhibition'  — a display size chosen for the vitrine. `displayHeight` is
 *                   derived from `heightMetres`, so the two paths agree by
 *                   construction, and the test asserts they still do.
 *   'placeholder' — `displayHeight * 0.12`. Marker-relative, unrelated to the
 *                   object's real size. Replace before exhibiting.
 */
export type WebXRHeightSource = 'measured' | 'exhibition' | 'placeholder';

interface ARArtifactShape {
   slug: string;
   name: string;
   associatedHistory: string;
   modelUrl: string;
   targetUrl: string;
   displayHeight: number;
   rotationY: number;
   webxr: {
      heightSource: WebXRHeightSource;
      heightMetres: number;
      rotationY: number;
      nudge: { x: number; y: number; z: number; yaw: number };
   };
}

export const AR_ARTIFACTS = {
   calabash: {
      slug: 'calabash',
      name: 'Calabash',
      associatedHistory: 'Mukwae Nalolo',
      modelUrl: '/models/calabash.glb',
      targetUrl: '/ar/targets/calabash.mind',
      displayHeight: 0.95,
      rotationY: -0.2,
      // Uncalibrated: carried over from the MindAR value at 120 mm/unit.
      webxr: {
         heightSource: 'placeholder',
         heightMetres: 0.114,
         rotationY: -0.2,
         nudge: { x: 0, y: 0, z: 0, yaw: 0 },
      },
   },
   cowry: {
      slug: 'cowry',
      name: 'Cowry Beads',
      associatedHistory: 'Mwape',
      modelUrl: '/models/cowry.glb',
      targetUrl: '/ar/targets/cowry.mind',
      displayHeight: 0.62,
      rotationY: 0.08,
      // Uncalibrated: carried over from the MindAR value at 120 mm/unit.
      webxr: {
         heightSource: 'placeholder',
         heightMetres: 0.0744,
         rotationY: 0.08,
         nudge: { x: 0, y: 0, z: 0, yaw: 0 },
      },
   },
   drum: {
      slug: 'drum',
      name: 'Double Sided Drum',
      associatedHistory: 'Mwenya Mukulu',
      modelUrl: '/models/drum.glb',
      targetUrl: '/ar/targets/drum.mind',
      // Exhibition scale: 0.5 m / 0.12 m per target unit. Supersedes the
      // 2026-08-07 device calibration of 1.3 units (156 mm), which measured the
      // drum at roughly its real size and read as a toy across the vitrine.
      displayHeight: 4.1667,
      rotationY: 0.62,
      // Height is the exhibition figure below. `rotationY` and `nudge` are still
      // the 2026-08-08 Samsung S20 measurements and are unaffected by it: both
      // are orientation and metric offset from the tapped point, neither scales
      // with the object.
      webxr: {
         heightSource: 'exhibition',
         heightMetres: 0.5,
         rotationY: 0.8684,
         nudge: { x: 0.02, y: 0.02, z: -0.03, yaw: 0 },
      },
   },
   headrest: {
      slug: 'headrest',
      name: 'Headrest',
      associatedHistory: 'Julia Chikamoneka',
      modelUrl: '/models/headrest.glb',
      targetUrl: '/ar/targets/headrest.mind',
      displayHeight: 0.66,
      rotationY: 0.15,
      // Uncalibrated: carried over from the MindAR value at 120 mm/unit.
      webxr: {
         heightSource: 'placeholder',
         heightMetres: 0.0792,
         rotationY: 0.15,
         nudge: { x: 0, y: 0, z: 0, yaw: 0 },
      },
   },
   likishi: {
      slug: 'likishi',
      name: 'Likishi lya Mwana Pwewo',
      associatedHistory: 'Loongo',
      // A different object from the mask in /exhibit, not a better scan of it,
      // so it replaces that entry rather than sharing its assets. Note
      // `models/mask.glb` still exists for the gallery component, which
      // destructures Hair/Mask/Wire out of it.
      modelUrl: '/models/likishi.glb',
      targetUrl: '/ar/targets/likishi.mind',
      // Exhibition scale: 0.5 m / 0.12 m per target unit. Replaces the 0.98
      // units (11.8 cm) inherited from the previous mask, which was never this
      // object's size. Above life-size for a Pwo mask (25-40 cm) by choice.
      displayHeight: 4.1667,
      rotationY: -0.08,
      webxr: {
         heightSource: 'exhibition',
         heightMetres: 0.5,
         rotationY: -0.08,
         // No downward drop: a mask is worn, so reading as hoisted above the
         // plinth is right. Do not "fix" it to stand on the surface.
         nudge: { x: 0, y: 0, z: 0, yaw: 0 },
      },
   },
   snuff: {
      slug: 'snuff',
      name: 'Snuff Cup',
      associatedHistory: 'Lueji Wa Nkonde',
      modelUrl: '/models/snuff.glb',
      targetUrl: '/ar/targets/snuff.mind',
      displayHeight: 0.7,
      rotationY: 0.18,
      // Uncalibrated: carried over from the MindAR value at 120 mm/unit.
      webxr: {
         heightSource: 'placeholder',
         heightMetres: 0.084,
         rotationY: 0.18,
         nudge: { x: 0, y: 0, z: 0, yaw: 0 },
      },
   },
} as const satisfies Record<string, ARArtifactShape>;

export type ARArtifactSlug = keyof typeof AR_ARTIFACTS;
export type ARArtifact = (typeof AR_ARTIFACTS)[ARArtifactSlug];

export const AR_ARTIFACT_SLUGS = Object.keys(AR_ARTIFACTS) as ARArtifactSlug[];

/**
 * The artifacts physically in the show, in the order their vitrines are met.
 *
 * Every artifact keeps a route so a marker can be printed and tested, but only
 * these have a plinth and a printed medallion. `/ar` uses this to offer a
 * choice; the QR beside each vitrine skips it entirely by going straight to
 * `/ar/[slug]`. Keeping it explicit means "what is exhibited" is stated rather
 * than inferred from which markers happened to get printed.
 */
export const AR_EXHIBITED_SLUGS = [
   'drum',
   'likishi',
] as const satisfies readonly ARArtifactSlug[];

export const isARArtifactSlug = (slug: string): slug is ARArtifactSlug =>
   Object.prototype.hasOwnProperty.call(AR_ARTIFACTS, slug);
