import { fetchAllTeamNotes } from '@/lib/hackMD';
import { Note } from '@/types/frontend';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './button/Button';

const getExcerpt = (content: string, length: number = 100): string => {
   return content.length > length
      ? content.substring(0, length) + '...'
      : content;
};

const BlogList = async () => {
   try {
      const notes: Note[] = await fetchAllTeamNotes();

      return (
         <section className=" space-y-4 md:mx-[15%] mx-[5%] ">
            <div className="space-y-4">
               <h2
                  className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight relative 
                        after:content-[''] after:block after:w-24 after:h-1 
                        after:bg-orange-500 after:mt-4"
               >
                  Get updates
               </h2>
               <p className=" text-lg md:text-xl leading-relaxed text-neutral-700  max-w-2xl">
                  Read more about the project and the core teams updates - stay
                  informed about our latest exhibitions, community initiatives,
                  and technological innovations.
               </p>
            </div>

            {/* Blog List with spacing */}

            <div className="container">
               <ul className="w-full grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
                  {notes.map((note) => (
                     <li
                        key={note.shortId}
                        className={`
                  relative w-full p-8
                  border-2 border-orange-600/50 
                  bg-white hover:bg-neutral-50
                  transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                  shadow-[4px_4px_0px_0px_rgba(234,88,12,0.2)]
                  hover:shadow-[6px_6px_0px_0px_rgba(234,88,12,0.3)]
               `}
                     >
                        <div className="relative flex flex-col gap-6 z-10">
                           <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-neutral-800">
                                 {note.title}
                              </h3>
                              <p className="text-neutral-600 leading-relaxed">
                                 {getExcerpt(note.content)}
                              </p>
                           </div>
                           <Link href={`/blog/${note.shortId}`}>
                              <Button className="flex gap-2 border border-orange-600 bg-orange-600 text-white hover:bg-orange-600/95 focus:ring-orange-600">
                                 Read More
                                 <ArrowRightIcon className="w-4 h-4" />
                              </Button>
                           </Link>
                        </div>
                     </li>
                  ))}
               </ul>
            </div>
         </section>
      );
   } catch (error) {
      console.error('Error in Blog component:', error);
      return (
         <div className="w-full h-full text-center bg-red-100 text-red-500 py-2">
            Error loading blog posts... Please Refresh...
         </div>
      );
   }
};

export default BlogList;
