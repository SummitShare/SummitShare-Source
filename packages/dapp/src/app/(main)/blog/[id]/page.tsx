import { fetchNoteContent, parseNoteContent, renderMarkdownToHtml } from '@/lib/hackMD';
import Image from 'next/image';

interface NotePageProps {
   params: {
      id: string;
   };
}

const Note = async ({ params }: NotePageProps): Promise<React.JSX.Element> => {
   const noteId = params.id;

   try {
      const note = await fetchNoteContent(noteId);
      const parsedNote = parseNoteContent(note.content ?? '');
      const contentHtml = await renderMarkdownToHtml(parsedNote.content);
      const noteTitle =
         typeof parsedNote.data?.title === 'string' && parsedNote.data.title.trim()
            ? parsedNote.data.title
            : note.title ?? 'Blog Post';

      return (
         <div className="relative min-h-screen w-full overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
               <div className="relative w-[150%] aspect-square">
                  <Image
                     src="https://summitshare3.s3.eu-north-1.amazonaws.com/IMG_3157.PNG"
                     alt="Watermark"
                     fill
                     className="object-contain rounded-full"
                  />
               </div>
            </div>

            <div className="relative space-y-24 mx-6 my-28 lg:mx-[15%]">
               <h1>{noteTitle}</h1>
               <div
                  className="space-y-6 prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
               />
            </div>
         </div>
      );
   } catch (_error: unknown) {
      return (
         <div className="w-full h-full text-center bg-red-100 text-red-500 py-2">
            Error loading note... Please Refresh...
         </div>
      );
   }
};

export default Note;
