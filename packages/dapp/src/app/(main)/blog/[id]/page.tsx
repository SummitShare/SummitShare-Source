import {
   fetchNoteContent,
   parseNoteContent,
} from '@/lib/hackMD';
import Image from 'next/image';

import { marked } from 'marked';
import DOMPurify from 'dompurify';

const Note = async ({ params }: { params: { id: string } }) => {
  const noteId = params.id;

  try {
    const note = await fetchNoteContent(noteId);
    const parsedNote = parseNoteContent(note.content);
    
    const renderer = {
      link(href: string, title: string | null, text: string) {
        return `<a href="${href}" class="text-blue-600 hover:underline"${title ? ` title="${title}"` : ''}>${text}</a>`;
      },
      listitem(text: string) {
        return `<li class="ml-4">${text}</li>`;
      },
      list(body: string, ordered: boolean) {
        const type = ordered ? 'ol' : 'ul';
        const className = ordered ? 'list-decimal' : 'list-disc';
        return `<${type} class="my-4 ml-4 ${className}">${body}</${type}>`;
      }
    };
    
    marked.use({ renderer });

    
    renderer.link = ({ href, title, text }) => {
      return `<a href="${href}" class="text-blue-600 hover:underline"${title ? ` title="${title}"` : ''}>${text}</a>`;
    };

    renderer.listitem = (text) => {
      return `<li class="ml-4">${text}</li>`;
    };

    renderer.list = (body, ordered, start) => {
      const type = ordered ? 'ol' : 'ul';
      const className = ordered ? 'list-decimal' : 'list-disc';
      return `<${type} class="my-4 ml-4 ${className}">${body}</${type}>`;
    };

    const content = await parsedNote.content;
    const contentString = await content;
    const contentHtml = DOMPurify.sanitize(
      marked(contentString, { renderer })
    );

    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="relative w-[150%] aspect-square">
            <Image
              src="/your-logo.png"
              alt="Watermark"
              fill
              className="object-contain rounded-full"
            />
          </div>
        </div>

        <div className="relative space-y-24 mx-6 my-28 lg:mx-[15%]">
          <h1>{parsedNote.data.title}</h1>
          <div
            className="space-y-6 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching note content:', error);
    return <div>Error loading note</div>;
  }
};

export default Note;