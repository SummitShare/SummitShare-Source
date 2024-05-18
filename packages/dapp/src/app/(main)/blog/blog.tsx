import { GetStaticProps } from 'next'; // Importing GetStaticProps for static site generation
import Link from 'next/link'; // Importing Link component for client-side navigation
import { fetchAllTeamNotes } from '../../../lib/hackMD'; // Importing the function to fetch all team notes
import { BlogProps } from '@/utils/dev/frontEndInterfaces'; // Types for props


const Blog: React.FC<BlogProps> = ({ notes }) => {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
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

// This function fetches all team notes at build time and passes them as props to the Blog component
export const getStaticProps: GetStaticProps = async () => {
  const notes = await fetchAllTeamNotes(); // Fetching all team notes
  return {
    props: {
      notes, // Passing the notes to the Blog component as props
    },
  };
};

export default Blog;
