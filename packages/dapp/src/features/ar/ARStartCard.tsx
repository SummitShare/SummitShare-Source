'use client';

import { ScanLine } from 'lucide-react';

type ARStartMarker = 'drum' | 'mask';

/**
 * The card both AR viewers show before the camera opens.
 *
 * WebXR and MindAR present the same thing here — the exhibition, and one
 * button — so it lives in one file. They diverge only once the camera is
 * running, where each viewer carries its own in-session prompt because the two
 * ask the visitor for different actions.
 *
 * Set in the exhibition's own type rather than the app's: Martel for the title
 * and Cormorant Garamond italic for the question, the same pairing /record
 * uses. The variables come from `app/ar/layout.tsx`; the fallback stacks match
 * `record.css` so a failed webfont degrades the same way in both places.
 */

const DISPLAY_FONT =
   'var(--record-font-display), "Palatino Linotype", Palatino, Georgia, serif';
const QUESTION_FONT =
   'var(--record-font-question), "Palatino Linotype", Palatino, Georgia, serif';

export default function ARStartCard({
   onStart,
   failure,
   checking = false,
   marker = 'mask',
}: Readonly<{
   onStart?: () => void;
   failure?: { title: string; detail: string } | null;
   checking?: boolean;
   marker?: ARStartMarker;
}>) {
   return (
      <section className="ar-start-card ar-start-card--center">
         <span
            className={`ar-start-medallion ar-start-medallion--${marker}`}
            aria-hidden="true"
         />
         {checking ? (
            <div className="ar-checking">
               <div className="ar-spinner" />
               <p>Checking augmented reality support…</p>
            </div>
         ) : (
            <>
               {failure && (
                  <div className="ar-alert">
                     <p className="ar-alert-title">{failure.title}</p>
                     <p className="ar-alert-detail">{failure.detail}</p>
                  </div>
               )}
               <h1 className="ar-title" style={{ fontFamily: DISPLAY_FONT }}>
                  What the Record Forgot
               </h1>
               <p className="ar-question" style={{ fontFamily: QUESTION_FONT }}>
                  What would you ask?
               </p>
               {onStart && (
                  <>
                     <button
                        type="button"
                        onClick={onStart}
                        className="ar-button-primary mt-7"
                     >
                        <ScanLine aria-hidden="true" />
                        <span>View artifact</span>
                     </button>
                     <p className="ar-support-note">
                        Best supported on Android. iOS support is experimental.
                     </p>
                  </>
               )}
            </>
         )}
      </section>
   );
}
