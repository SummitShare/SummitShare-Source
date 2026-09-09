/* eslint-disable @next/next/no-img-element */
import GalleryObserver from './GalleryObserver';
import { galleryControlState } from './galleryControls';
import { SECTIONS } from './sections';

const CURATORIAL_STATEMENT = [
   'This exhibition begins with absence. Three empty vitrines mark the place of cultural objects separated from the living systems that once gave them meaning.',
   'Colonial collecting preserved material while severing it from indigenous practice that involved symbology, ritual, language, song, pedagogy, permission, place and community authority. What remains is a Petrified Archive: material culture survives, but the relationships through which it was understood and transmitted are immobilised.',
] as const;

const GALLERY_LABELS = {
   mask: 'Mask and Tusona',
   mbusa: 'Mbusa',
   drum: 'Ngoma Pwita',
} as const;

const GALLERY_ROOT_ID = 'record-gallery';

const GALLERY_LINKS = SECTIONS.map(({ section }) => ({
   id: `record-panel-${section}`,
   label: GALLERY_LABELS[section],
}));

// The gallery opens on the first panel, so the served HTML already carries the
// state the observer would otherwise have to apply on hydration — the active
// dot is correct and the arrows point somewhere before any JavaScript runs.
const INITIAL = galleryControlState(0, GALLERY_LINKS.length);

export default function RecordPage() {
   return (
      <main className="record-page">
         <header className="record-intro">
            <div className="record-intro-copy">
               <h1>What the Record Forgot / What Would You Ask?</h1>
               {CURATORIAL_STATEMENT.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
               ))}
            </div>

            {/* Decorative. These are the printed AR medallions, shown cropped,
                overlapped and dimmed so they read as archival material under a
                vitrine light rather than as something to scan — there is no AR
                entry point on this page. */}
            <div className="record-marker-field" aria-hidden="true">
               <span className="record-marker record-marker-mask" />
               <span className="record-marker record-marker-drum" />
               <span className="record-marker record-marker-calabash" />
               <span className="record-marker record-marker-cowry" />
            </div>
         </header>

         <div className="record-gallery" id={GALLERY_ROOT_ID}>
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
                     >
                        {/* The mural is authored 2.22:1 and the panel is portrait, so
                            `object-fit: cover` upscales it ~5.35x and then discards
                            ~76% — a 10.4 Mpx rasterize per panel, which is the
                            dominant cost of a swipe. The portrait source is the same
                            artwork with a square viewBox, so the renderer culls what
                            was never visible: 4.7 Mpx, measured 1.95x cheaper, same
                            bytes. Square rather than the panel's own ~0.54 aspect so
                            the crop stays wider than any panel it is served to and
                            `cover` still trims width only — see scripts/lib/recordCrops.mjs.
                            3/4 is the widest viewport where the panel is provably
                            narrower than the square crop, given the gallery's
                            `100dvh - 58px` height and 64px control row. */}
                        <div className="record-graphic-band" aria-hidden="true">
                           <picture>
                              <source
                                 media="(max-aspect-ratio: 3/4)"
                                 srcSet={`/record/${section.portraitGraphics}`}
                                 type="image/svg+xml"
                              />
                              <img
                                 src={`/record/${section.graphics}`}
                                 alt=""
                                 aria-hidden="true"
                                 loading="lazy"
                                 decoding="async"
                                 width="1200"
                                 height="540"
                              />
                           </picture>
                        </div>

                        {/* The panel itself is `overflow: hidden`; this is what
                            scrolls the long text, so this is what has to be
                            reachable by keyboard. */}
                        <div className="record-section-scroll" tabIndex={0}>
                           <div className="record-section-content">
                              <div className="record-section-heading">
                                 <p className="record-section-number">
                                    {section.n}
                                 </p>
                                 <h2 id={headingId}>{section.name}</h2>
                                 <p className="record-curatorial">
                                    {section.curatorial}
                                 </p>
                              </div>

                              <div
                                 className="record-hairline"
                                 aria-hidden="true"
                              />

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

                              <p className="record-question">
                                 {section.question}
                              </p>

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
            <GalleryObserver rootId={GALLERY_ROOT_ID} />
            <nav
               className="record-gallery-navigation"
               aria-label="Mural sections"
            >
               <a
                  className="record-gallery-arrow record-gallery-previous"
                  data-gallery-arrow
                  data-gallery-previous
                  href={`#${GALLERY_LINKS[INITIAL.previousIndex ?? 0].id}`}
                  hidden={INITIAL.previousIndex === null}
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
                           aria-current={
                              index === INITIAL.activeIndex ? 'step' : 'false'
                           }
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
                  href={`#${GALLERY_LINKS[INITIAL.nextIndex ?? 0].id}`}
                  hidden={INITIAL.nextIndex === null}
               >
                  <span aria-hidden="true">→</span>
                  <span className="record-visually-hidden">Next section</span>
               </a>
            </nav>
         </div>
      </main>
   );
}
