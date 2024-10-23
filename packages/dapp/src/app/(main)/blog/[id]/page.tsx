import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import {
   fetchAllTeamNotes,
   fetchNoteContent,
   parseNoteContent,
} from '@/lib/hackMD';
import Buttons from '@/app/components/button/Butons';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Note = async ({ params }: { params: { id: string } }) => {
   const noteId = params.id;

   // Log the noteId to ensure it is correctly captured -- only for dev
   // //console.log('Fetching note with ID---:', noteId);

   try {
      const note = await fetchNoteContent(noteId);
      const parsedNote = parseNoteContent(note.content);

      const processedContent = await unified()
         .use(remarkParse)
         .use(remarkHtml, { sanitize: false })
         .process(parsedNote.content);
      const contentHtml = processedContent.toString();

      return (
         <div className="space-y-24 mx-6 my-28 lg:mx-[15%] ">
            <h1>{parsedNote.data.title}</h1>

            <div
               className="space-y-6"
               dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            <div className="w-full rounded-[8px] bg-primary-50 space-y-4 px-[45px] py-6">
               <div className="space-y-2">
                  <h3>Was this page informative?</h3>
                  <p>Those who walked before us and those to come.</p>
               </div>

               <div className="flex flex-row gap-4">
                  <div className="w-[73px]">
                     <Buttons type="primary" size="small">
                        Yes
                     </Buttons>
                  </div>
                  <div className="w-[73px]">
                     <Buttons type="secondary" size="small">
                        No
                     </Buttons>
                  </div>
               </div>
            </div>
            <div className="space-y-4 md:flex md:flex-row md:gap-4 md:space-y-0">
               <Buttons type="secondary" active={true}>
                  Back
               </Buttons>
               <Buttons type="primary" active={true}>
                  Next
               </Buttons>
            </div>
         </div>
      );
   } catch (error) {
      console.error('Error fetching note content:', error);
      return <div>Error loading note</div>;
   }
};

export default Note;
