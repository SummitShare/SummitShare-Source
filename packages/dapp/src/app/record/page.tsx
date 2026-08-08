/* eslint-disable @next/next/no-img-element */
import GalleryObserver from './GalleryObserver';
import { SECTIONS } from './sections';

const CURATORIAL_STATEMENT = [
   'What the Record Forgot / What Would You Ask? begins with absence. Three empty vitrines mark the place of cultural objects separated from the living systems that once gave them meaning.',
   'Colonial collecting preserved material while severing it from indigenous practice that involved symbology, ritual, language, song, pedagogy, permission, place and community authority. The Women’s History Museum of Zambia describes this condition as the Petrified Archive: material culture survives, but the relationships through which it was understood and transmitted are immobilised.',
] as const;

const GALLERY_LABELS = {
   mask: 'Mask and Tusona',
   mbusa: 'Mbusa',
   drum: 'Ngoma Pwita',
} as const;

const GALLERY_LINKS = SECTIONS.map(({ section }) => ({
   id: `record-panel-${section}`,
   label: GALLERY_LABELS[section],
}));

export default function RecordPage() {
   return (
      <main className="record-page">
         <header className="record-intro">
            <h1>What the Record Forgot / What Would You Ask?</h1>
            {CURATORIAL_STATEMENT.map((paragraph) => (
               <p key={paragraph}>{paragraph}</p>
            ))}
         </header>

         <div className="record-gallery">
            <div
               className="record-gallery-track"
               aria-label="Horizontal mural gallery"
               data-gallery-track
               role="region"
               tabIndex={0}
            >
               {SECTIONS.map((section) => {
                  const panelId = `record-panel-${section.section}`;
                  const headingId = `record-section-${section.section}`;

                  return (
                     <section
                        className="record-section"
                        data-section={section.section}
                        data-record-panel
                        id={panelId}
                        aria-labelledby={headingId}
                        key={section.section}
                        tabIndex={0}
                     >
                        <div className="record-graphic-band" aria-hidden="true">
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

                        <div className="record-section-scroll">
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
                              loading="lazy"
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

                           <aside
                              className="record-closing"
                              aria-label={`${section.name} closing passage`}
                           >
                              {section.closing.map((paragraph) => (
                                 <p key={paragraph}>{paragraph}</p>
                              ))}
                           </aside>
                        </div>
                        </div>
                     </section>
                  );
               })}
            </div>
            <GalleryObserver />
            <nav
               className="record-gallery-navigation"
               aria-label="Mural sections"
            >
               <a
                  className="record-gallery-arrow record-gallery-previous"
                  data-gallery-arrow
                  data-gallery-previous
                  href={`#${GALLERY_LINKS[0].id}`}
                  hidden
               >
                  <span aria-hidden="true">←</span>
                  <span className="record-visually-hidden">Previous section</span>
               </a>
               <ol>
                  {GALLERY_LINKS.map(({ id, label }, index) => (
                     <li key={id}>
                        <a
                           data-gallery-dot
                           href={`#${id}`}
                           aria-label={`Go to section ${index + 1}, ${label}`}
                        >
                           <span aria-hidden="true" />
                        </a>
                     </li>
                  ))}
               </ol>
               <a
                  className="record-gallery-arrow record-gallery-next"
                  data-gallery-arrow
                  data-gallery-next
                  href={`#${GALLERY_LINKS[1].id}`}
                  hidden
               >
                  <span aria-hidden="true">→</span>
                  <span className="record-visually-hidden">Next section</span>
               </a>
            </nav>
         </div>
      </main>
   );
}
