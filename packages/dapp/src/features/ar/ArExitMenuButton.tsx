'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AR_EXIT_PATH } from './artifacts';

/**
 * Two-press exit, on every AR surface.
 *
 * A single tap used to leave outright, which is easy to do by accident while
 * holding a phone up to a vitrine — and inside a running session the cost of
 * that mistake is the whole experience: camera torn down, tracker restarted,
 * marker re-acquired. So the first press only arms the control (three lines
 * become a cross) and the second press leaves. The shape change is the
 * affordance; it reads as "pressing again closes this" after one try.
 *
 * Arming lapses on its own, so a stray press cannot leave the control primed
 * for a later one that was meant for the artifact.
 *
 * `label` is what separates the surfaces. Only the running scanner passes one
 * ("End AR"), because only there does pressing twice tear something down; on
 * the entry page and the start screens the button is bare and just navigates
 * away, so the icon carries it alone.
 */
const DISARM_AFTER_MS = 4000;

/** Used for the accessible name when there is no visible label to quote. */
export const DEFAULT_EXIT_LABEL = 'Close AR';

/**
 * The icon is aria-hidden, so this name is the whole of what assistive tech
 * gets, and this button is often the only way out of the view. It has to say
 * where the control goes and that one press will not get there. Deriving it
 * from the visible label — rather than writing a second string beside it — is
 * what keeps the two from drifting apart, which is the failure that made
 * the name read "Menu" on the one screen it mattered most.
 */
export function exitButtonName(label: string, armed: boolean): string {
   return `${label}, press ${armed ? 'again' : 'twice'} to confirm`;
}

export default function ArExitMenuButton({
   onExit,
   label,
}: {
   onExit?: () => void;
   label?: string;
}) {
   const router = useRouter();
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
         // Without a session to tear down there is nothing to do but leave.
         if (onExit) onExit();
         else router.push(AR_EXIT_PATH);
         return;
      }
      setArmed(true);
      clearTimer();
      timer.current = setTimeout(() => setArmed(false), DISARM_AFTER_MS);
   }, [armed, clearTimer, onExit, router]);

   return (
      <button
         type="button"
         onClick={press}
         aria-label={exitButtonName(label ?? DEFAULT_EXIT_LABEL, armed)}
         className={`ar-overlay-button${
            label ? '' : ' ar-overlay-button--iconic'
         }${armed ? ' is-armed' : ''}`}
      >
         <span className="ar-menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
         </span>
         {label ? <span>{label}</span> : null}
      </button>
   );
}
