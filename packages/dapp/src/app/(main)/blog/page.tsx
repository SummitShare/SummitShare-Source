import Link from 'next/link';
import { fetchAllTeamNotes } from '../../../lib/hackMD'; // Adjust the import path as needed
import { Note } from '@/utils/dev/frontEndInterfaces'; // Adjust the import path as needed

const Blog = async () => {
try {
    const notes: Note[] = await fetchAllTeamNotes();
  
    return (
      <div>
        <h1>Blog</h1>
        <ul>
          {notes.map((note) => (
            <li key={note.shortId}>
              <Link href={`/blog/${note.shortId}`}>
                  <h2>{note.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
} catch (error) {
  console.error('Error in Blog component:', error);
  return <div>Error loading blog posts</div>;
}
};

export default Blog;
