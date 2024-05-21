import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { fetchNoteContent, parseNoteContent } from '@/lib/hackMD';

const Note = async ({ params }: { params: { id: string } }) => {
  const noteId = params.id;
  const note = await fetchNoteContent(noteId);
  const parsedNote = parseNoteContent(note.content);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(parsedNote.content);
  const contentHtml = processedContent.toString();

  return (
    <div>
      <h1>{parsedNote.data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
};

export default Note;