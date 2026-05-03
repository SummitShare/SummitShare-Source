import ReadingProgress from '@/components/blog/ReadingProgress';
import ShareButtons from '@/components/blog/ShareButtons';
import { formatBlogDate } from '@/lib/blogDates';
import {
   getAdjacentPosts,
   getAllSlugs,
   getPostBySlug,
   getPostStats,
   getRelatedPosts,
   type PostMeta,
} from '@/lib/blog';
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

type BlogPostPageProps = {
   params: Promise<{
      slug: string;
   }>;
};

const slugify = (text: string) =>
   text
      .toLowerCase()
      .trim()
      .replace(/<[^>]+>/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

const addHeadingAnchors = (html: string) =>
   html.replace(
      /<(h[2-4])>([\s\S]*?)<\/\1>/g,
      (match, tag: string, inner: string) => {
         const text = inner.replace(/<[^>]+>/g, '');
         const id = slugify(text);
         if (!id) return match;
         return `<${tag} id="${id}"><a class="anchor-link" href="#${id}" aria-label="Link to section">${inner}</a></${tag}>`;
      }
   );

export async function generateStaticParams() {
   const slugs = await getAllSlugs();

   return slugs.map((slug) => ({ slug }));
}

const BlogPost = async ({ params }: BlogPostPageProps) => {
   const { slug } = await params;
   const post = await getPostBySlug(slug);

   if (!post) {
      notFound();
   }

   const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(post.content);
   const contentHtml = addHeadingAnchors(processedContent.toString());

   const stats = getPostStats(post.content);
   const { previous, next } = await getAdjacentPosts(slug);
   const related = await getRelatedPosts(slug, post.tags);
   const publishedDate = formatBlogDate(post.published);

   return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[#f6f3f2]/50 py-10">
         <ReadingProgress />

         <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
            <div className="relative aspect-square w-[150%]">
               <Image
                  src="https://summitshare3.s3.eu-north-1.amazonaws.com/IMG_3157.PNG"
                  alt="Watermark"
                  fill
                  className="rounded-full object-contain"
               />
            </div>
         </div>

         <div className="relative mx-5 mt-24 mb-4 max-w-5xl md:mx-10 lg:mx-auto">
            <Link
               href="/blog"
               className="inline-flex items-center gap-2 text-sm font-semibold text-orange-800 underline decoration-orange-300 underline-offset-4 transition-colors hover:text-orange-900 hover:decoration-orange-500"
            >
               <ArrowLeftIcon className="h-4 w-4" />
               All posts
            </Link>
         </div>

         <article className="relative mx-5 mb-24 max-w-5xl overflow-hidden rounded-lg border border-orange-600/20 bg-white shadow-[6px_6px_0px_0px_rgba(234,88,12,0.16)] md:mx-10 lg:mx-auto">
            <header className="space-y-5 border-b border-orange-600/15 bg-orange-50/45 px-6 py-8 md:px-10 md:py-10">
               <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-neutral-600">
                  {publishedDate ? (
                     <time dateTime={post.published}>{publishedDate}</time>
                  ) : (
                     <span>Undated</span>
                  )}
                  <span aria-hidden className="text-orange-600/40">
                     •
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                     <ClockIcon className="h-4 w-4" />
                     {stats.readingTimeMinutes} min read
                  </span>
                  <span aria-hidden className="text-orange-600/40">
                     •
                  </span>
                  <span>{stats.wordCount.toLocaleString()} words</span>
                  {post.tags.length > 0 ? (
                     <>
                        <span aria-hidden className="text-orange-600/40">
                           •
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                           {post.tags.map((tag) => (
                              <span
                                 key={tag}
                                 className="rounded-full border border-orange-600/30 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-900"
                              >
                                 {tag}
                              </span>
                           ))}
                        </div>
                     </>
                  ) : null}
               </div>
               <h1 className="max-w-3xl text-4xl font-bold text-neutral-900 md:text-5xl">
                  {post.title}
               </h1>
               <p className="max-w-3xl text-lg leading-relaxed text-neutral-700 md:text-xl">
                  {post.description}
               </p>
               <div className="pt-2">
                  <ShareButtons title={post.title} slug={post.slug} />
               </div>
            </header>

            <div
               className="blog-content blog-content--article px-6 py-8 md:px-10 md:py-12"
               dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            <footer className="border-t border-orange-600/15 bg-orange-50/30 px-6 py-8 md:px-10 md:py-10">
               <ShareButtons title={post.title} slug={post.slug} />
            </footer>
         </article>

         {(previous || next) && (
            <nav
               aria-label="Post navigation"
               className="relative mx-5 mb-12 grid max-w-5xl gap-4 md:mx-10 md:grid-cols-2 lg:mx-auto"
            >
               {previous ? (
                  <PostNavCard direction="previous" post={previous} />
               ) : (
                  <div className="hidden md:block" />
               )}
               {next ? <PostNavCard direction="next" post={next} /> : null}
            </nav>
         )}

         {related.length > 0 && (
            <section className="relative mx-5 mb-24 max-w-5xl md:mx-10 lg:mx-auto">
               <h2 className="relative mb-8 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl after:mt-3 after:block after:h-1 after:w-16 after:bg-orange-500 after:content-['']">
                  Keep reading
               </h2>
               <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {related.map((post) => (
                     <li key={post.slug}>
                        <Link
                           href={`/blog/${post.slug}`}
                           className="group flex h-full flex-col justify-between rounded-lg border-2 border-orange-600/40 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(234,88,12,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-50 hover:shadow-[5px_5px_0px_0px_rgba(234,88,12,0.28)]"
                        >
                           <div className="space-y-3">
                              {post.tags[0] ? (
                                 <span className="inline-block rounded-full border border-orange-600/30 bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-900">
                                    {post.tags[0]}
                                 </span>
                              ) : null}
                              <h3 className="text-lg font-bold leading-snug text-neutral-900">
                                 {post.title}
                              </h3>
                              <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600">
                                 {post.description}
                              </p>
                           </div>
                           <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700 group-hover:text-orange-800">
                              Read more
                              <ArrowRightIcon className="h-4 w-4" />
                           </span>
                        </Link>
                     </li>
                  ))}
               </ul>
            </section>
         )}
      </div>
   );
};

const PostNavCard = ({
   direction,
   post,
}: {
   direction: 'previous' | 'next';
   post: PostMeta;
}) => {
   const isNext = direction === 'next';
   return (
      <Link
         href={`/blog/${post.slug}`}
         className={`group flex h-full flex-col gap-2 rounded-lg border-2 border-orange-600/40 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(234,88,12,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-50 hover:shadow-[5px_5px_0px_0px_rgba(234,88,12,0.28)] ${
            isNext ? 'md:text-right' : ''
         }`}
      >
         <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-orange-700 ${
               isNext ? 'md:justify-end' : ''
            }`}
         >
            {isNext ? (
               <>
                  Next post
                  <ArrowRightIcon className="h-3.5 w-3.5" />
               </>
            ) : (
               <>
                  <ArrowLeftIcon className="h-3.5 w-3.5" />
                  Previous post
               </>
            )}
         </span>
         <span className="text-base font-bold leading-snug text-neutral-900 group-hover:text-orange-900">
            {post.title}
         </span>
      </Link>
   );
};

export default BlogPost;
