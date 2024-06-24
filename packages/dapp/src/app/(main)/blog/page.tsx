import { fetchAllTeamNotes } from '@/lib/hackMD';
import { Note } from '@/utils/dev/frontEndInterfaces';
import Link from 'next/link';

const getExcerpt = (content: string, length: number = 100): string => {
  return content.length > length ? content.substring(0, length) + '...' : content;
};

const Blog = async () => {
  try {
    const notes: Note[] = await fetchAllTeamNotes();

    return (
      <div className='mt-[94px] mx-6 space-y-[48px]'>
        <header className='space-y-2'>
        <h2>Get updates</h2>
        <p>Figma ipsum component variant main layer. Arrange draft plugin community.</p>
        </header>
       

        <ul className='space-y-4'>
          {notes.map((note) => (
            <li key={note.shortId} className={`w-full rounded-[8px] border border-primary-100/20 p-8 space-y-6`}>
              <div className='space-y-4'>
              <h3>{note.title}</h3>
                {note.tags.length > 0 && (
                  <div className={`w-full flex flex-wrap gap-1`}>
                    {note.tags.map((tag) => (
                      <span key={tag} className='w-fit rounded-2xl bg-primary-50 text-primary-900 px-4 py-1 text-p3-r'>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className={`text-p2-r`}>{getExcerpt(note.content)}</p>
              </div>
             
<div>
<Link className='w-ifit rounded-md bg-primary-600 text-white hover:bg-primary-600/95 px-8 py-2' href={`/blog/${note.shortId}`}>Read
</Link>
</div>
              
               
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
