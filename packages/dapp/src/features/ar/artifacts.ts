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
 *   'exhibition'  — a display size the exhibition stands behind, with both
 *                   paths in agreement. Either the metres were chosen and the
 *                   units derived, or — as for drum and likishi — the size was
 *                   measured on a device against the 120 mm printed square and
 *                   the metres follow at 0.12 m per unit. Agreement is exact
 *                   either way, and the test asserts it still holds.
 *                   Not 'measured': that is reserved for a height read
 *                   independently on the WebXR path, against a hit-test surface
 *                   rather than a marker, which is a different measurement.
 *   'vitrine'     — a WebXR-only display size, deliberately LARGER than the
 *                   marker-relative size MindAR renders. The two paths do not
 *                   place against the same thing: MindAR is pinned to a 120 mm
 *                   medallion an arm's length away, while WebXR drops the
 *                   object into the room, where a true-to-life height reads as
 *                   small across a vitrine. This is the one source where the
 *                   paths may disagree, and the disagreement must be declared
 *                   here rather than discovered — the 156 mm drum shipped
 *                   because someone edited the metres and left the units
 *                   behind. A test asserts a 'vitrine' height is strictly
 *                   greater than `displayHeight * 0.12`, so an accidental edit
 *                   that merely equals it still fails.
 *   'placeholder' — `displayHeight * 0.12`. Marker-relative, unrelated to the
 *                   object's real size. Replace before exhibiting.
 */
export type WebXRHeightSource =
   | 'measured'
   | 'exhibition'
   | 'vitrine'
   | 'placeholder';

interface ARArtifactShape {
   slug: string;
   name: string;
   associatedHistory: string;
   modelUrl: string;
   targetUrl: string;
   displayHeight: number;
   rotationY: number;
   /**
    * Where the artifact sits above the medallion, in target units, MindAR only.
    * Was one shared -0.375 for every object; device measurement showed the two
    * exhibited pieces want different mounts, so it is per-artifact now.
    */
   mountY: number;
   /**
    * How far the visitor may swing the object with the drag gesture, in radians.
    * MindAR is marker-relative and cannot be walked around, so this range IS the
    * viewing experience. Clamped per object because the far side of a mask is
    * hollow and must not be reachable.
    */
   rotationClamp: { min: number; max: number };
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
      // Unexhibited: the previous shared mount, unmeasured.
      mountY: -0.375,
      rotationClamp: { min: -Math.PI, max: Math.PI },
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
      // Unexhibited: the previous shared mount, unmeasured.
      mountY: -0.375,
      rotationClamp: { min: -Math.PI, max: Math.PI },
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
      // Device-measured 2026-09-04 against a 120 mm printed square at the
      // optimal ~775 mm viewing distance: 204 mm tall, mount -79 mm. Supersedes
      // the 0.5 m exhibition guess, which measurement showed was far too big.
      displayHeight: 1.7,
      rotationY: 0.62,
      mountY: -0.6583,
      // A drum is closed all round, so the full useful arc is available.
      rotationClamp: { min: -Math.PI, max: Math.PI },
      // Height is the exhibition figure below. `rotationY` and `nudge` are still
      // the 2026-08-08 Samsung S20 measurements and are unaffected by it: both
      // are orientation and metric offset from the tapped point, neither scales
      // with the object.
      webxr: {
         // On-site WebXR calibration, 2026-09-08. 204 mm was device-measured
         // against the printed square and is right for MindAR, but reads small
         // once the drum is placed in a room. rotationY zeroed in the same pass,
         // superseding the 2026-08-08 S20 measurement of 0.8684.
         heightSource: 'vitrine',
         heightMetres: 0.8,
         rotationY: 0,
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
      // Unexhibited: the previous shared mount, unmeasured.
      mountY: -0.375,
      rotationClamp: { min: -Math.PI, max: Math.PI },
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
      // Device-measured 2026-09-04 against a 120 mm printed square at the
      // optimal ~775 mm viewing distance: 174 mm tall, mount -95 mm. Supersedes
      // the 0.5 m exhibition guess, which measurement showed was far too big.
      displayHeight: 1.45,
      rotationY: -0.08,
      mountY: -0.7917,
      // The far side of a Pwo mask is a hollow shell. This arc is the measured
      // limit before the inside comes into view; do not widen it.
      rotationClamp: { min: -1.7013, max: 0.8872 },
      webxr: {
         // On-site WebXR calibration, 2026-09-08; see the drum above.
         heightSource: 'vitrine',
         heightMetres: 0.75,
         rotationY: 0,
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
      // Unexhibited: the previous shared mount, unmeasured.
      mountY: -0.375,
      rotationClamp: { min: -Math.PI, max: Math.PI },
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
