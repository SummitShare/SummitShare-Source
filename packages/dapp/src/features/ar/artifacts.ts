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
 * `webxr.calibrated` gates the routing decision in `/ar/[slug]`: only an
 * artifact whose WebXR numbers were measured on a device takes the WebXR path.
 * The rest stay on MindAR, which is pinned to a printed marker and therefore
 * correct by construction. A mechanically-derived height is not a calibration —
 * it converts a marker-relative unit into metres and has no relationship to the
 * object's real size, so shipping it would render, say, an 11.8 cm mask. Flip
 * the flag per artifact as each one is measured; nothing else needs to change.
 */
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
         calibrated: false,
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
         calibrated: false,
         heightMetres: 0.074,
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
      // Device-calibrated 2026-08-07 (Samsung S20 + iPhone 11 Pro) against a
      // printed 90 mm medallion. 1.3 target units x 120 mm = 156 mm rendered.
      displayHeight: 1.3,
      rotationY: 0.62,
      // Device-calibrated 2026-08-08 on a Samsung S20.
      webxr: {
         calibrated: true,
         heightMetres: 0.24,
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
         calibrated: false,
         heightMetres: 0.079,
         rotationY: 0.15,
         nudge: { x: 0, y: 0, z: 0, yaw: 0 },
      },
   },
   mask: {
      slug: 'mask',
      name: 'Likishi lya Mwana Pwewo',
      associatedHistory: 'Loongo',
      // A different object from the mask in /exhibit, not a better scan of it:
      // its own file, so `models/mask.glb` stays with the gallery component
      // that destructures Hair/Mask/Wire out of it.
      modelUrl: '/models/likishi.glb',
      targetUrl: '/ar/targets/mask.mind',
      // Both heights are placeholders inherited from the previous mask and are
      // wrong for this object — the WebXR figure would render it at 11.8 cm.
      // Measure both on a device with devrig before exhibiting.
      displayHeight: 0.98,
      rotationY: -0.08,
      webxr: {
         calibrated: false,
         heightMetres: 0.118,
         rotationY: -0.08,
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
         calibrated: false,
         heightMetres: 0.084,
         rotationY: 0.18,
         nudge: { x: 0, y: 0, z: 0, yaw: 0 },
      },
   },
} as const;

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
export const AR_EXHIBITED_SLUGS = ['drum', 'mask'] as const satisfies readonly ARArtifactSlug[];

export const isARArtifactSlug = (slug: string): slug is ARArtifactSlug =>
   Object.prototype.hasOwnProperty.call(AR_ARTIFACTS, slug);
