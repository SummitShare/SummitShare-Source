import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { fetchNoteContent, parseNoteContent } from '@/lib/hackMD';

const Partners = async () => {
  const noteId = 'thV0GdbvRba4LW4FF8S6iw';

  try {
    const note = await fetchNoteContent(noteId);
    const parsedNote = parseNoteContent(note.content);

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkHtml, { sanitize: false})
      .process(parsedNote.content);
    const contentHtml = processedContent.toString();

    //console.log(contentHtml);

    return (
      <div>
        <h1>{parsedNote.data.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching note content:', error);
    return <div>Error loading note</div>;
  }
};

export default Partners;
