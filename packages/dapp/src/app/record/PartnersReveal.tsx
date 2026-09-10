'use client';

import { useEffect } from 'react';

/**
 * Fades the partner row in as it enters the viewport and back out as it leaves,
 * in both scroll directions.
 *
 * Progressive enhancement, deliberately: the row is fully visible in the served
 * HTML and this only takes over once it has run. Adding the hidden state from
 * script rather than from the stylesheet is what keeps the credit readable when
 * script does not run — a partner acknowledgement that only appears for some
 * visitors is worse than one that never animates.
 */
export default function PartnersReveal({ targetId }: { targetId: string }) {
   useEffect(() => {
      const target = document.getElementById(targetId);
      if (!target) return;

      // Honour the setting at its current value; a visitor who prefers reduced
      // motion just keeps the static row.
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motion.matches) return;

      target.dataset.reveal = 'armed';

      const observer = new IntersectionObserver(
         ([entry]) => {
            target.dataset.reveal = entry.isIntersecting ? 'in' : 'armed';
         },
         // A band of the row rather than a hair of it, so a logo half off the
         // bottom edge does not count as arrived.
         { threshold: 0.4 }
      );
      observer.observe(target);

      return () => {
         observer.disconnect();
         delete target.dataset.reveal;
      };
   }, [targetId]);

   return null;
}
