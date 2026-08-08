'use client';

import { useEffect } from 'react';

const selectAll = <ElementType extends Element>(selector: string) =>
   Array.from(document.querySelectorAll<ElementType>(selector));

export default function GalleryObserver() {
   useEffect(() => {
      const track = document.querySelector('.record-gallery-track');
      const panels = selectAll<HTMLElement>('[data-record-panel]');
      const dots = selectAll<HTMLAnchorElement>('[data-gallery-dot]');
      const arrows = selectAll<HTMLAnchorElement>('[data-gallery-arrow]');
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
            dots.forEach((dot, dotIndex) => {
               dot.ariaCurrent = dotIndex === index ? 'step' : 'false';
            });
            arrows.forEach((arrow, arrowIndex) => {
               const panel = panels[index + arrowIndex * 2 - 1];
               arrow.hidden = !panel;
               if (panel) arrow.href = `#${panel.id}`;
            });
         },
         { root: track, threshold: [0.55, 0.75] }
      );
      panels.forEach((panel) => observer.observe(panel));
      return () => observer.disconnect();
   }, []);
   return null;
}
