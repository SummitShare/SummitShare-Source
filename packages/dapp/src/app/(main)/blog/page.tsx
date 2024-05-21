import Link from 'next/link';
import { fetchAllTeamNotes } from '../../../lib/hackMD'; // Adjust the import path as needed
import { Note } from '@/utils/dev/frontEndInterfaces'; // Adjust the import path as needed

const Blog = async () => {
  const notes: Note[] = await fetchAllTeamNotes();

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.shortId}>
            <Link href={`/blog/${note.shortId}`}>
              <a>
                <h2>{note.title}</h2>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
