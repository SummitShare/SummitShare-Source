import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import {
   fetchAllTeamNotes,
   fetchNoteContent,
   parseNoteContent,
} from '@/lib/hackMD';
import { Button } from '@/app/components/button/Button';
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
          
         </div>
      );
   } catch (error) {
      console.error('Error fetching note content:', error);
      return <div>Error loading note</div>;
   }
};

export default Note;
