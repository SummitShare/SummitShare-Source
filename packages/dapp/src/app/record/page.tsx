/* eslint-disable @next/next/no-img-element */
import { SECTIONS } from './sections';

const CURATORIAL_STATEMENT = [
   'What the Record Forgot / What Would You Ask? begins with absence. Three empty vitrines mark the place of cultural objects separated from the living systems that once gave them meaning.',
   'Colonial collecting preserved material while severing it from indigenous practice that involved symbology, ritual, language, song, pedagogy, permission, place and community authority. The Women’s History Museum of Zambia describes this condition as the Petrified Archive: material culture survives, but the relationships through which it was understood and transmitted are immobilised.',
] as const;

export default function RecordPage() {
   return (
      <main className="record-page">
         <header className="record-intro">
            <h1>What the Record Forgot / What Would You Ask?</h1>
            {CURATORIAL_STATEMENT.map((paragraph) => (
               <p key={paragraph}>{paragraph}</p>
            ))}
         </header>

         {SECTIONS.map((section) => {
            const headingId = `record-section-${section.section}`;

            return (
               <section
                  className="record-section"
                  data-section={section.section}
                  aria-labelledby={headingId}
                  key={section.section}
               >
                  <div className="record-graphic-band">
                     <img
                        src={`/record/${section.graphics}`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        width="1200"
                        height="540"
                     />
                  </div>

                  <div className="record-section-content">
                     <div className="record-section-heading">
                        <p className="record-section-number">{section.n}</p>
                        <h2 id={headingId}>{section.name}</h2>
                        <p className="record-curatorial">
                           {section.curatorial}
                        </p>
                     </div>

                     <div className="record-hairline" aria-hidden="true" />

                     <img
                        className="record-icons"
                        src={`/record/${section.icons}`}
                        alt=""
                        aria-hidden="true"
                        decoding="async"
                        width="80"
                        height="316"
                     />

                     <div className="record-copy">
                        {section.body.map((paragraph) => (
                           <p key={paragraph}>{paragraph}</p>
                        ))}
                     </div>

                     <p className="record-question">{section.question}</p>

                     <aside className="record-vitrine">
                        <p className="record-vitrine-label">Vitrine text</p>
                        <h3>{section.vitrineTitle}</h3>
                        {section.vitrine.map((paragraph) => (
                           <p key={paragraph}>{paragraph}</p>
                        ))}
                     </aside>
                  </div>
               </section>
            );
         })}

         <footer className="record-footer">
            <a href="/">SummitShare</a>
         </footer>
      </main>
   );
}
