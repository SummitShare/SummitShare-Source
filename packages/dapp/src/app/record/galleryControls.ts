export type GalleryControlState = Readonly<{
   activeIndex: number;
   /** `null` when there is nothing to step back to — the arrow is hidden. */
   previousIndex: number | null;
   /** `null` when there is nothing to step forward to — the arrow is hidden. */
   nextIndex: number | null;
}>;

/**
 * Resolves which panel is active and which neighbours the arrows should point
 * at. Kept pure and separate from the observer so both the server render and
 * the client update derive the arrows the same way, and so the edges — first
 * panel, last panel, single panel — are testable without a browser.
 */
export const galleryControlState = (
   activeIndex: number,
   panelCount: number
): GalleryControlState => {
   if (panelCount <= 0) {
      return { activeIndex: 0, previousIndex: null, nextIndex: null };
   }

   const clamped = Math.min(Math.max(activeIndex, 0), panelCount - 1);

   return {
      activeIndex: clamped,
      previousIndex: clamped > 0 ? clamped - 1 : null,
      nextIndex: clamped < panelCount - 1 ? clamped + 1 : null,
   };
};
