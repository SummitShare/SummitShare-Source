/**
 * `displayHeight` is the upright model height in square-target units above the
 * lower edge of the vertical medallion. `rotationY` yaws that standing model
 * around the marker image's up axis for per-artifact presentation calibration.
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
   },
   cowry: {
      slug: 'cowry',
      name: 'Cowry Beads',
      associatedHistory: 'Mwape',
      modelUrl: '/models/cowry.glb',
      targetUrl: '/ar/targets/cowry.mind',
      displayHeight: 0.62,
      rotationY: 0.08,
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
   },
   headrest: {
      slug: 'headrest',
      name: 'Headrest',
      associatedHistory: 'Julia Chikamoneka',
      modelUrl: '/models/headrest.glb',
      targetUrl: '/ar/targets/headrest.mind',
      displayHeight: 0.66,
      rotationY: 0.15,
   },
   mask: {
      slug: 'mask',
      name: 'Luvale Mask',
      associatedHistory: 'Loongo',
      modelUrl: '/models/mask.glb',
      targetUrl: '/ar/targets/mask.mind',
      displayHeight: 0.98,
      rotationY: -0.08,
   },
   snuff: {
      slug: 'snuff',
      name: 'Snuff Cup',
      associatedHistory: 'Lueji Wa Nkonde',
      modelUrl: '/models/snuff.glb',
      targetUrl: '/ar/targets/snuff.mind',
      displayHeight: 0.7,
      rotationY: 0.18,
   },
} as const;

export type ARArtifactSlug = keyof typeof AR_ARTIFACTS;
export type ARArtifact = (typeof AR_ARTIFACTS)[ARArtifactSlug];

export const AR_ARTIFACT_SLUGS = Object.keys(AR_ARTIFACTS) as ARArtifactSlug[];

export const isARArtifactSlug = (slug: string): slug is ARArtifactSlug =>
   Object.prototype.hasOwnProperty.call(AR_ARTIFACTS, slug);
