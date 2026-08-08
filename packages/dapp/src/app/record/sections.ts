export type RecordSection = {
   readonly n: string;
   readonly section: 'mask' | 'mbusa' | 'drum';
   readonly graphics: string;
   readonly icons: string;
   readonly name: string;
   readonly curatorial: string;
   readonly body: readonly string[];
   readonly question: string;
   readonly closing: readonly string[];
};

export const SECTIONS = [
   {
      n: '1',
      section: 'mask',
      graphics: 'graphics-1.svg',
      icons: 'icons-1.svg',
      name: 'LIKISHI LYA MWANA PWEWO AND TUSONA',
      curatorial: 'THE CODE',
      body: [
         'Likishi Lya Mwana Pwewo belongs to a living system of initiation, ancestral presence, performance and instruction among Luvale, Chokwe and related communities that border Zambia, Angola and the Democratic Republic of Congo.',
         'Tusona uses dots, continuous lines, symbols and stories to carry memory, cosmology and guidance. Its meaning does not exist in the visible mark alone. It lives through the storyteller, learner, ceremony and community able to interpret it.',
         'Colonial collections preserve the mask or symbol while separating it from this interpretive world. The record keeps the form, but weakens the language required to read it.',
         'This section presents Tusona as a knowledge technology in its own right: a living code made meaningful through relationship, interpretation and transmission.',
      ],
      question:
         'What knowledge remains visible when the people who know how to read it are removed?',
      closing: [
         'This vitrine is empty by design.',
         'Displaying the mask without the initiation, storyteller, movement and community that animate it would repeat the separation this exhibition examines.',
         'The object is therefore encountered through sound, living practice and a permitted digital surrogate. Its absence refuses to present a material fragment as though it were the complete record.',
      ],
   },
   {
      n: '2',
      section: 'mbusa',
      graphics: 'graphics-2.svg',
      icons: 'icons-2.svg',
      name: 'MBUSA',
      curatorial: 'THE CYCLE',
      body: [
         'Mbusa is an embodied Bemba teaching practice led by women knowledge keepers. Temporary clay forms support coming-of-age instruction during the highly secluded process of learning: earth becomes form, knowledge passes into the body and memory of the learner, and the form is then broken, dissolved or returned to the earth.',
         'The teaching is cyclical, relational and protected.',
         'Colonial collection interrupts this cycle by turning a temporary and restricted pedagogical form into a permanent public object. The museum may preserve the material while violating the conditions that gave it meaning. This completely disrupts the knowledge form.',
         'This section presents non-display as an act of care. The withheld centre recognises that some knowledge should remain under the authority of its custodians.',
      ],
      question: 'What should a museum refuse to show in order to practise care?',
      closing: [
         'This vitrine is empty as an act of care.',
         'Mbusa forms were not created for permanent public display. They belong to a protected teaching cycle of making, embodiment, transmission and return to earth.',
         'To reproduce the object here would repeat the violence of collection. Its deliberate absence honours the authority of women knowledge keepers and makes ethical non-display visible as a practice of rematriation and museum repair.',
      ],
   },
   {
      n: '3',
      section: 'drum',
      graphics: 'graphics-3.svg',
      icons: 'icons-3.svg',
      name: 'NGOMA PWITA',
      curatorial: 'THE MESSAGE',
      body: [
         'Ngoma Pwita is not only an instrument or drum. It is a communication technology.',
         'Rhythm, tone, interval and repetition become message through a shared language between player, listener, royal court and community. Meaning is carried through the relationship between those who call, those who answer and those who understand.',
         'When removed from this social setting, the drum may remain while its message is reduced to sound. The museum retains the instrument but loses the shared code that makes it intelligible.',
         'Here, rhythm, waveform, spoken language and community translation reconnect sound to meaning and restore the Mondo as a technology of communication.',
      ],
      question:
         'When does sound become a message, and who is able to understand it?',
      closing: [
         'This vitrine is empty by design so that the visitor encounters the message before the object.',
         'A drum separated from its player, listener, language and occasion becomes only material and sound. The absent instrument exposes that rupture. Kuvunga is the percussion technique of combining different drums that create a melody that represents or calls to the ancestral spirit — this is the only sound that will call the ancestor to come and appear or communicate through the dance and song. And Ngoma Pwita is the lead drum in the set.',
         'Its knowledge returns through rhythm and beating of the drum that performs as a “soul voice” to bring the dis-membered artefacts and petrified archives back to life just as the soul voice calls the Makishi Ancestral Spirit from the astral realm to the physical realm for the annual Likumbi Lya Mize ceremony that is a passage of knowledge and initiation one generation to the next.',
      ],
   },
] as const satisfies readonly RecordSection[];
