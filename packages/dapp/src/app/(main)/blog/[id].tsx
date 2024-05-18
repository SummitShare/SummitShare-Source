import { GetStaticPaths, GetStaticProps } from 'next'; // Importing GetStaticPaths and GetStaticProps for static site generation
import { fetchAllTeamNotes, fetchNoteContent, parseNoteContent } from '../../../lib/hackMD'; // Importing functions to fetch notes and parse content
import { unified } from 'unified'; // Importing unified to create a processor
import remarkParse from 'remark-parse'; // Importing remark-parse for Markdown parsing
import remarkHtml from 'remark-html'; // Importing remark-html to convert Markdown to HTML
import { NoteProps } from '@/utils/dev/frontEndInterfaces'; // Importing NoteProps interface

const Note: React.FC<NoteProps> = ({ title, content }) => {
  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} /> {/* Rendering the note content as HTML */}
    </div>
  );
};

// This function fetches all team notes to generate the paths for all individual note pages
export const getStaticPaths: GetStaticPaths = async () => {
  const notes = await fetchAllTeamNotes(); // Fetching all team notes
  const paths = notes.map((note: { shortId: any; }) => ({
    params: { id: note.shortId }, // Creating paths for each note based on its shortId
  }));

  return {
    paths, // Returning the paths to be statically generated
    fallback: false, // Setting fallback to false to render a 404 page for missing paths
  };
};

// This function fetches the content of a specific note at build time and passes it as props to the Note component
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const noteId = params?.id as string; // Getting the noteId from the URL parameters
  const note = await fetchNoteContent(noteId); // Fetching the content of the specific note
  const parsedNote = parseNoteContent(note.content); // Parsing the note content and front matter

  // Create a processor to convert Markdown to HTML
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(parsedNote.content);
  const contentHtml = processedContent.toString(); // Converting the processed content to a string

  return {
    props: {
      title: parsedNote.data.title, // Passing the note title as a prop
      content: contentHtml, // Passing the HTML content as a prop
    },
  };
};

export default Note;
