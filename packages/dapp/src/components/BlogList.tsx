import type { PostMeta } from '@/lib/blog';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './button/Button';

interface BlogListProps {
   posts: PostMeta[];
   showNewsBanner?: boolean;
}

const formatDate = (date: string) => {
   return new Intl.DateTimeFormat('en', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
   }).format(new Date(date));
};

const BlogList = ({ posts, showNewsBanner = false }: BlogListProps) => {
   return (
      <section className="mx-[5%] space-y-8 md:mx-[15%]">
         {showNewsBanner ? (
            <a
               href="https://figshare.com/articles/preprint/_b_Repatriation_in_Practice_b_A_Field_Report_on_Community_Linked_Digital_Exhibits_in_Zambia/28855799/1"
               target="_blank"
               rel="noreferrer"
               className="group grid overflow-hidden rounded-lg border-2 border-orange-600/40 bg-white shadow-[4px_4px_0px_0px_rgba(234,88,12,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-orange-50/50 hover:shadow-[6px_6px_0px_0px_rgba(234,88,12,0.28)] lg:grid-cols-[1fr_18rem]"
            >
               <div className="space-y-4 p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                     <span className="rounded-full border border-orange-600/30 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-900">
                        News
                     </span>
                     <span className="text-sm font-medium text-neutral-600">
                        Field report
                     </span>
                  </div>
                  <div className="space-y-2">
                     <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
                        Read our report
                     </h2>
                     <p className="max-w-3xl text-base leading-relaxed text-neutral-700 md:text-lg">
                        Repatriation in Practice: A Field Report on Community
                        Linked Digital Exhibits in Zambia is now available on
                        Figshare.
                     </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 underline decoration-orange-300 underline-offset-4 transition-colors group-hover:text-orange-800">
                     Open the report
                     <ArrowRightIcon className="h-4 w-4" />
                  </span>
               </div>

               <div className="flex items-center justify-center bg-[#f6f3f2] p-6">
                  <svg
                     viewBox="0 0 260 180"
                     className="h-44 w-full max-w-[18rem]"
                     role="img"
                     aria-label="Illustration of a field report"
                  >
                     <rect
                        x="46"
                        y="20"
                        width="118"
                        height="140"
                        rx="8"
                        fill="#fff"
                        stroke="#794228"
                        strokeWidth="4"
                     />
                     <path
                        d="M164 20v34h34"
                        fill="#ffedd5"
                        stroke="#794228"
                        strokeLinejoin="round"
                        strokeWidth="4"
                     />
                     <path
                        d="M72 64h66M72 84h88M72 104h64"
                        stroke="#2563eb"
                        strokeLinecap="round"
                        strokeWidth="6"
                     />
                     <path
                        d="M72 128c19-24 37-22 54-7 15 13 30 14 50-6"
                        fill="none"
                        stroke="#ea580c"
                        strokeLinecap="round"
                        strokeWidth="6"
                     />
                     <path
                        d="M190 75c14 0 26 12 26 26s-12 26-26 26-26-12-26-26 12-26 26-26Z"
                        fill="#d7f5e2"
                        stroke="#207f42"
                        strokeWidth="4"
                     />
                     <path
                        d="M178 101h24M190 89v24"
                        stroke="#207f42"
                        strokeLinecap="round"
                        strokeWidth="5"
                     />
                     <path
                        d="M38 156h180"
                        stroke="#1a0d08"
                        strokeLinecap="round"
                        strokeOpacity=".16"
                        strokeWidth="6"
                     />
                  </svg>
               </div>
            </a>
         ) : null}

         <div className="space-y-4">
            <h2
               className="relative text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl
                        after:content-[''] after:block after:w-24 after:h-1 
                        after:bg-orange-500 after:mt-4"
            >
               Get updates
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-neutral-700 md:text-xl">
               Read more about the project and the core teams updates - stay
               informed about our latest exhibitions, community initiatives, and
               technological innovations.
            </p>
         </div>

         <ul className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {posts.map((post) => (
               <li
                  key={post.slug}
                  className="relative flex min-h-[21rem] w-full flex-col justify-between rounded-lg border-2 border-orange-600/50 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(234,88,12,0.2)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-neutral-50 hover:shadow-[6px_6px_0px_0px_rgba(234,88,12,0.3)] md:p-8"
               >
                  <div className="space-y-5">
                     <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-neutral-800">
                           {post.title}
                        </h3>
                        <p className="leading-relaxed text-neutral-600">
                           {post.description}
                        </p>
                     </div>

                     <div className="flex flex-wrap items-center gap-2">
                        <time
                           dateTime={post.published}
                           className="mr-1 text-sm font-medium text-neutral-600"
                        >
                           {formatDate(post.published)}
                        </time>
                        {post.tags.map((tag) => (
                           <span
                              key={tag}
                              className="rounded-full border border-orange-600/30 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-900"
                           >
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="mt-8 w-fit">
                     <Button className="flex gap-2 border border-orange-600 bg-orange-600 text-white hover:bg-orange-600/95 focus:ring-orange-600">
                        Read more
                        <ArrowRightIcon className="h-4 w-4" />
                     </Button>
                  </Link>
               </li>
            ))}
         </ul>

         {posts.length === 0 ? (
            <div className="rounded-lg border border-orange-600/30 bg-orange-50 px-5 py-4 text-orange-900">
               No blog posts are available yet.
            </div>
         ) : null}
      </section>
   );
};

export default BlogList;
