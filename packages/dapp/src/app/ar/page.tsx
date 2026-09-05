import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
      <main className="ar-shell ar-entry-shell">
         <div className="ar-entry-frame">
            <section className="ar-entry-panel">
               <h1 className="ar-title" style={{ fontFamily: DISPLAY_FONT }}>
                  What the Record Forgot
               </h1>
               <p className="ar-question" style={{ fontFamily: QUESTION_FONT }}>
                  What would you ask?
               </p>

               <p className="ar-body-copy">
                  Choose the artifact in front of you, or scan the code on its
                  stand.
               </p>

               <ul className="ar-entry-actions">
                  {AR_EXHIBITED_SLUGS.map((slug) => (
                     <li key={slug}>
                        <Link href={`/ar/${slug}`} className="ar-artifact-option">
                           <span>{AR_ARTIFACTS[slug].name}</span>
                           <ArrowRight aria-hidden="true" />
                        </Link>
                     </li>
                  ))}
               </ul>

               <p className="ar-support-note">
                  Best supported on Android. iOS support is experimental.
               </p>
            </section>

            <div className="ar-entry-art" aria-hidden="true">
               <span className="ar-medallion ar-medallion--mask" />
               <span className="ar-medallion ar-medallion--drum" />
               <span className="ar-medallion ar-medallion--calabash" />
            </div>
         </div>
      </main>
   );
}
