import Link from 'next/link';
import { AR_ARTIFACTS, AR_EXHIBITED_SLUGS } from '@/features/ar/artifacts';

/**
 * The entry for anyone who arrives without a vitrine.
 *
 * At each plinth the QR on the medallion goes straight to `/ar/[slug]`, so this
 * page is not on the visitor's path — it exists for someone who typed the URL
 * or followed a link, where the slug is the one thing we cannot know. It used
 * to hardcode the drum, which silently showed the wrong object to everyone
 * standing at the other vitrine.
 *
 * Set in the exhibition's type, matching /record and the AR start card.
 */

const DISPLAY_FONT =
   'var(--record-font-display), "Palatino Linotype", Palatino, Georgia, serif';
const QUESTION_FONT =
   'var(--record-font-question), "Palatino Linotype", Palatino, Georgia, serif';

export default function ARIndexPage() {
   return (
      <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#0f0c09] px-5 py-10 text-amber-50">
         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(245,158,11,0.2),transparent_38%),radial-gradient(circle_at_80%_85%,rgba(180,83,9,0.18),transparent_42%),linear-gradient(145deg,#17110b,#0f0c09_55%,#090706)]" />
         <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#14100c]/95 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8">
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

            <p className="mt-6 text-sm !text-amber-100/65">
               Choose the artifact in front of you, or scan the code on its stand.
            </p>

            <ul className="mt-5 space-y-2.5">
               {AR_EXHIBITED_SLUGS.map((slug) => (
                  <li key={slug}>
                     <Link
                        href={`/ar/${slug}`}
                        className="block w-full rounded-full bg-amber-300 px-6 py-3.5 text-sm font-semibold text-[#24160a] shadow-[0_12px_40px_-12px_rgba(252,211,77,0.75)] transition hover:bg-amber-200"
                     >
                        {AR_ARTIFACTS[slug].name}
                     </Link>
                  </li>
               ))}
            </ul>

            <p className="mt-4 text-xs !text-amber-100/50">
               Best supported on Android. iOS support is experimental.
            </p>
         </section>
      </main>
   );
}
