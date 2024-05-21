import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchAllTeamNotes, fetchNoteContent, parseNoteContent } from '../../../lib/hackMD';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { NoteProps } from '@/utils/dev/frontEndInterfaces';

const Note: React.FC<NoteProps> = ({ title, content }) => {
  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const notes = await fetchAllTeamNotes();
  const paths = notes.map((note: { shortId: string }) => ({
    params: { id: note.shortId },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const noteId = params?.id as string;
  const note = await fetchNoteContent(noteId);
  const parsedNote = parseNoteContent(note.content);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(parsedNote.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      title: parsedNote.data.title,
      content: contentHtml,
    },
  };
};

export default Note;
