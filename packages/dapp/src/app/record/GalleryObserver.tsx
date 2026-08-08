'use client';

import { useEffect } from 'react';
import { galleryControlState } from './galleryControls';

/**
 * Progressive enhancement over a gallery that is already complete in HTML: the
 * page ships the first panel's dot and arrow state, and this keeps them in step
 * as the visitor scrolls. Queries are scoped to `rootId` rather than the whole
 * document so a second gallery on the page could never be driven by this one.
 */
export default function GalleryObserver({ rootId }: { rootId: string }) {
   useEffect(() => {
      const root = document.getElementById(rootId);
      if (!root) return;

      const track = root.querySelector<HTMLElement>('[data-gallery-track]');
      const panels = Array.from(
         root.querySelectorAll<HTMLElement>('[data-record-panel]')
      );
      const dots = Array.from(
         root.querySelectorAll<HTMLAnchorElement>('[data-gallery-dot]')
      );
      const previous = root.querySelector<HTMLAnchorElement>(
         '[data-gallery-previous]'
      );
      const next = root.querySelector<HTMLAnchorElement>('[data-gallery-next]');
      if (!track || panels.length === 0) return;

      const pointArrow = (
         arrow: HTMLAnchorElement | null,
         index: number | null
      ) => {
         if (!arrow) return;
         const panel = index === null ? null : panels[index];
         arrow.hidden = !panel;
         if (panel) arrow.href = `#${panel.id}`;
      };

      const apply = (activeIndex: number) => {
         const state = galleryControlState(activeIndex, panels.length);
         dots.forEach((dot, index) => {
            dot.ariaCurrent = index === state.activeIndex ? 'step' : 'false';
         });
         pointArrow(previous, state.previousIndex);
         pointArrow(next, state.nextIndex);
      };

      const observer = new IntersectionObserver(
         (entries) => {
            // A callback can carry several panels at once mid-swipe, and the
            // array is not ordered by visibility. Take the most-visible entry
            // rather than the first past the threshold, or the active dot can
            // land on the panel being scrolled away from.
            const current = entries
               .filter(({ intersectionRatio }) => intersectionRatio >= 0.55)
               .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!current) return;

            const index = panels.indexOf(current.target as HTMLElement);
            if (index >= 0) apply(index);
         },
         { root: track, threshold: [0.55, 0.75] }
      );

      panels.forEach((panel) => observer.observe(panel));
      return () => observer.disconnect();
   }, [rootId]);

   return null;
}
