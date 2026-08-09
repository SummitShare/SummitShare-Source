'use client';

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
}: Readonly<{
   onStart?: () => void;
   failure?: { title: string; detail: string } | null;
   checking?: boolean;
}>) {
   return (
      <section className="pointer-events-auto relative w-full max-w-md rounded-3xl border border-white/10 bg-[#14100c]/95 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8">
         {checking ? (
            <>
               <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
               <p className="mt-4 text-sm font-medium !text-amber-50">
                  Checking augmented reality support…
               </p>
            </>
         ) : (
            <>
               {failure && (
                  <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                     <p className="text-sm font-semibold !text-amber-50">
                        {failure.title}
                     </p>
                     <p className="mt-1 text-xs leading-5 !text-amber-100/65">
                        {failure.detail}
                     </p>
                  </div>
               )}
               <h1
                  className="text-3xl leading-tight !text-amber-50"
                  style={{ fontFamily: DISPLAY_FONT }}
               >
                  What the Record Forgot
               </h1>
               <p
                  className="mt-2 text-xl italic !text-amber-200/85"
                  style={{ fontFamily: QUESTION_FONT }}
               >
                  What would you ask?
               </p>
               {onStart && (
                  <>
                     <button
                        type="button"
                        onClick={onStart}
                        className="mt-8 w-full rounded-full bg-amber-300 px-6 py-3.5 text-sm font-semibold text-[#24160a] shadow-[0_12px_40px_-12px_rgba(252,211,77,0.75)] transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:ring-offset-2 focus:ring-offset-[#14100c]"
                     >
                        View artifact
                     </button>
                     <p className="mt-3 text-xs !text-amber-100/50">
                        Best supported on Android. iOS support is experimental.
                     </p>
                  </>
               )}
            </>
         )}
      </section>
   );
}
