import Link from 'next/link';
import { fetchAllTeamNotes } from '../../../lib/hackMD'; 
import { Note } from '@/utils/dev/frontEndInterfaces'; 
import styles from './Blog.module.css';

const getExcerpt = (content: string, length: number = 100): string => {
  return content.length > length ? content.substring(0, length) + '...' : content;
};

const Blog = async () => {
  try {
    const notes: Note[] = await fetchAllTeamNotes();

    return (
      <div className={styles.container}>
        <h1>Blog</h1>
        <ul>
          {notes.map((note) => (
            <li key={note.shortId} className={styles.card}>
              <Link href={`/blog/${note.shortId}`}>
                <h2 className={styles.title}>{note.title}</h2>
                {note.tags.length > 0 && (
                  <div className={styles.tags}>
                    {note.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className={styles.excerpt}>{getExcerpt(note.content)}</p>
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
