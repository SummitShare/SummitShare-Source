import type { PostMeta } from '@/lib/blog';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
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
               className="group relative block overflow-hidden rounded-lg border-2 border-orange-600/40 shadow-[4px_4px_0px_0px_rgba(234,88,12,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(234,88,12,0.28)]"
            >
               {/* Full-bleed background image */}
               <Image
                  src="https://pub-a2d19ba4b3934be7a05aa694f8e6618c.r2.dev/blog_basket.png"
                  alt="Close-up of a handwoven basket"
                  fill
                  sizes="100vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
               />

               {/* Dark overlay so text is readable */}
               <div className="absolute inset-0 bg-black/55" />

               {/* Text content */}
               <div className="relative z-10 space-y-4 p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                     <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                        News
                     </span>
                     <span className="text-sm font-medium text-white/70">
                        Field report
                     </span>
                  </div>
                  <div className="space-y-2">
                     <h2 className="text-2xl font-bold text-white md:text-3xl">
                        Read our report
                     </h2>
                     <p className="max-w-md text-base leading-relaxed text-white/80 md:text-lg">
                        Repatriation in Practice: A Field Report on Community
                        Linked Digital Exhibits in Zambia is now available on
                        Figshare.
                     </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300 underline decoration-orange-400/50 underline-offset-4 transition-colors group-hover:text-orange-200">
                     Open the report
                     <ArrowRightIcon className="h-4 w-4" />
                  </span>
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
