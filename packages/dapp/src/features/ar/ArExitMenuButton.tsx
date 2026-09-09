'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Two-press exit for the AR overlay.
 *
 * A single tap used to end the session outright, which is easy to do by
 * accident while holding a phone up to a vitrine — and the cost of that mistake
 * is the whole experience: camera torn down, tracker restarted, marker
 * re-acquired. So the first press only arms the control (three lines become a
 * cross) and the second press leaves. The shape change is the affordance; it
 * reads as "pressing again closes this" after one try.
 *
 * Arming lapses on its own, so a stray press cannot leave the control primed
 * for a later one that was meant for the artifact.
 *
 * The label stays "End AR" in both states. The icon is decorative, so the label
 * is the whole of what a screen reader gets, and this is the running view's only
 * way out — it has to say where the control goes, not what it looks like. Keeping
 * the text fixed also stops the button resizing between the two presses, so the
 * second one lands where the first did.
 */
const DISARM_AFTER_MS = 4000;

export default function ArExitMenuButton({ onExit }: { onExit: () => void }) {
   const [armed, setArmed] = useState(false);
   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

   const clearTimer = useCallback(() => {
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
   }, []);

   useEffect(() => clearTimer, [clearTimer]);

   const press = useCallback(() => {
      if (armed) {
         clearTimer();
         onExit();
         return;
      }
      setArmed(true);
      clearTimer();
      timer.current = setTimeout(() => setArmed(false), DISARM_AFTER_MS);
   }, [armed, clearTimer, onExit]);

   return (
      <button
         type="button"
         onClick={press}
         // Prefixed with the visible label, then what the NEXT press does.
         aria-label={
            armed
               ? 'End AR, press again to confirm'
               : 'End AR, press twice to confirm'
         }
         className={`ar-overlay-button${armed ? ' is-armed' : ''}`}
      >
         <span className="ar-menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
         </span>
         <span>End AR</span>
      </button>
   );
}
