/**
 * Crops the mural viewBox to the window `object-fit: cover` already shows.
 *
 * The murals are authored 1200x540 (2.22:1) and the gallery panel is portrait,
 * so `cover` upscales them ~5.35x to fill it and then throws ~76% away. The
 * browser pays to rasterize the whole upscaled surface: measured 10.4 Mpx and
 * ~610 ms per panel at 4x CPU throttle, which is the dominant cost of a swipe.
 *
 * Cropping the viewBox lets the renderer cull the geometry that was never going
 * to be visible. Measured 4.7 Mpx and ~314 ms — 1.95x cheaper — while the bytes
 * are unchanged (+6 gzipped: every path is still in the file, just clipped).
 *
 * Why a SQUARE window rather than the panel's own ~0.54 aspect: the crop must
 * stay WIDER than any panel it is served to. `cover` on a source wider than its
 * box crops width and keeps full height, which is what ships today. A 0.54 crop
 * would start cropping HEIGHT on wider portrait panels and show artwork the
 * current build never shows. A square window is wider than any portrait panel,
 * so `cover` still crops width and the visible artwork is identical.
 *
 * A tighter crop is available if this is ever not enough — 0.54 measured 3.39x —
 * but it needs the media query to track the panel aspect, not the viewport's.
 */
export const PORTRAIT_CROP_ASPECT = 1;

/** Parses `viewBox="minX minY width height"`. Throws rather than guess. */
export const parseViewBox = (svg) => {
   const raw = svg.match(/viewBox="([^"]+)"/)?.[1];
   if (!raw) throw new Error('mural has no viewBox');
   const parts = raw
      .trim()
      .split(/[\s,]+/)
      .map(Number);
   if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
      throw new Error(`unparseable viewBox: ${raw}`);
   }
   const [minX, minY, width, height] = parts;
   if (width <= 0 || height <= 0) throw new Error(`degenerate viewBox: ${raw}`);
   return { minX, minY, width, height };
};

/**
 * The centred window of `aspect`, matching `object-position: 50% 50%`. Never
 * widens past the source, so a mural already narrower than `aspect` is returned
 * unchanged rather than gaining blank margin.
 */
export const cropViewBox = (
   { minX, minY, width, height },
   aspect = PORTRAIT_CROP_ASPECT
) => {
   const cropWidth = Math.min(width, height * aspect);
   return {
      minX: minX + (width - cropWidth) / 2,
      minY,
      width: cropWidth,
      height,
   };
};

export const formatViewBox = ({ minX, minY, width, height }) =>
   [minX, minY, width, height].map((n) => +n.toFixed(4)).join(' ');

/** Rewrites only the viewBox. Every path stays, so nothing is re-authored. */
export const cropMuralSvg = (svg, aspect = PORTRAIT_CROP_ASPECT) =>
   svg.replace(
      /viewBox="[^"]+"/,
      `viewBox="${formatViewBox(cropViewBox(parseViewBox(svg), aspect))}"`
   );

/** `graphics-1.svg` -> `graphics-1-portrait.svg`. One source of truth. */
export const portraitVariant = (filename) =>
   filename.replace(/\.svg$/, '-portrait.svg');

/**
 * Panel geometry, mirrored from record.css so the media query can be proved
 * rather than eyeballed:
 *   .record-gallery  height: calc(100dvh - 58px); min-height: 600px;
 *                    grid-template-rows: minmax(0, 1fr) 64px;
 * The track is the 1fr row, so the panel is as tall as the gallery less the
 * 64px control row. The panel — not the viewport — is what `cover` fits, and
 * the panel is always TALLER-relative than the viewport, which is why the
 * breakpoint cannot simply be `(orientation: portrait)`.
 */
export const RECORD_NAV_HEIGHT = 58;
export const RECORD_GALLERY_MIN_HEIGHT = 600;
export const RECORD_CONTROLS_HEIGHT = 64;

/** The aspect `object-fit: cover` actually sees, for a given viewport. */
export const panelAspect = (viewportWidth, viewportHeight) => {
   const gallery = Math.max(
      viewportHeight - RECORD_NAV_HEIGHT,
      RECORD_GALLERY_MIN_HEIGHT
   );
   return viewportWidth / (gallery - RECORD_CONTROLS_HEIGHT);
};

/** The `(max-aspect-ratio: N)` the portrait source is served under. */
export const PORTRAIT_SOURCE_MAX_VIEWPORT_ASPECT = 3 / 4;
