'use client';
import DynamicCanvas from '@/components/3DCanvas/3dCanvas';
import { CanvasErrorBoundary } from '@/components/3DCanvas/CanvasErrorBoundary';
import { data } from './data';
import { Button } from '@/components/button/Button';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

interface PageProps {
   params: Promise<{ slug: string }>;
}

const display = Cormorant_Garamond({
   subsets: ['latin'],
   weight: ['400', '600', '700'],
   display: 'swap',
});
const body = Manrope({
   subsets: ['latin'],
   weight: ['400', '500', '600'],
   display: 'swap',
});

const flatten = (items: string[][]) => items.flat().filter(Boolean);

const Page = ({ params }: PageProps) => {
   const router = useRouter();
   const resolvedParams = React.use(params);
   const [currentIndex, setCurrentIndex] = useState<number>(-1);
   const [isImageLoading, setIsImageLoading] = useState(true);
   const [imageError, setImageError] = useState(false);

   useEffect(() => {
      const index = data.findIndex(
         (item) =>
            item.title.toLowerCase().replace(/ /g, '-') === resolvedParams.slug
      );

      if (index === -1) {
         router.push('/exhibit');
         return;
      }

      setCurrentIndex(index);
      setIsImageLoading(true);
      setImageError(false);
   }, [resolvedParams.slug, router]);

   if (currentIndex === -1) {
      return (
         <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="animate-pulse text-lg font-medium text-gray-700">
               Loading...
            </div>
         </div>
      );
   }

   const figure = data[currentIndex];
   if (!figure) {
      return (
         <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="text-lg font-medium text-gray-700">
               Figure not found
            </div>
         </div>
      );
   }

   const handleBack = () => {
      if (currentIndex > 0) {
         const prevSlug = data[currentIndex - 1].title
            .toLowerCase()
            .replace(/ /g, '-');
         router.push(`/exhibit/${prevSlug}`);
         window.scrollTo(0, 0);
      }
   };

   const handleNext = () => {
      if (currentIndex < data.length - 1) {
         const nextSlug = data[currentIndex + 1].title
            .toLowerCase()
            .replace(/ /g, '-');
         router.push(`/exhibit/${nextSlug}`);
         window.scrollTo(0, 0);
      }
   };

   const handleClose = () => {
      setCurrentIndex(-1);
      setIsImageLoading(true);
      router.replace('/exhibit');
   };

   const description = flatten(figure.Object_description);
   const details = flatten(figure.figure_details);
   const biography = flatten(figure.figure_biography);
   const references = flatten(figure.figure_references);

   return (
      <div
         className={`${body.className} min-h-screen bg-[#0b0907] text-amber-50`}
      >
         <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,206,140,0.16),transparent_55%),radial-gradient(700px_circle_at_80%_10%,rgba(255,120,40,0.12),transparent_50%)]" />
         <div className="relative px-4 sm:px-6 lg:px-[12%] py-8 sm:py-12 mt-16 sm:mt-24">
            <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
               <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-amber-200/70">
                     Artifact Profile
                  </p>
                  <h1
                     className={`${display.className} text-3xl sm:text-4xl md:text-5xl text-amber-50`}
                  >
                     {figure.title}
                  </h1>
                  <p className="text-amber-200/70 text-sm sm:text-base">
                     {figure.object_name}
                  </p>
               </div>
               <div className="flex flex-wrap gap-3">
                  <button
                     onClick={handleClose}
                     className="text-sm sm:text-base rounded-full border border-white/20 px-4 py-2 text-amber-100/80 hover:border-white/40 hover:text-amber-100"
                     aria-label="Close and return to exhibit"
                  >
                     Back to Exhibit
                  </button>
                  <a
                     href={figure.object_address}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-sm sm:text-base rounded-full border border-white/20 px-4 py-2 text-amber-100/80 hover:border-white/40 hover:text-amber-100"
                  >
                     Explorer
                  </a>
               </div>
            </header>

            <section className="mt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
               <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-[#14110c] p-4">
                     <CanvasErrorBoundary
                        fallbackSrc={figure.image}
                        fallbackAlt={figure.title}
                     >
                        <DynamicCanvas>{figure.object_URL}</DynamicCanvas>
                     </CanvasErrorBoundary>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                     <div className="rounded-2xl border border-white/10 bg-[#14110c] p-5">
                        <h2
                           className={`${display.className} text-xl text-amber-100`}
                        >
                           Artifact Notes
                        </h2>
                        <ul className="mt-4 space-y-3 text-sm text-amber-100">
                           {description.map((desc, index) => (
                              <li key={index} className="text-amber-100">
                                 {desc}
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div className="rounded-2xl border border-white/10 bg-[#14110c] p-5">
                        <h2
                           className={`${display.className} text-xl text-amber-100`}
                        >
                           Curator&apos;s Note
                        </h2>
                        <p className="mt-4 text-sm text-amber-100/90">
                           {figure.Figure_artifact_details}
                        </p>
                     </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#14110c] p-5">
                     <h2
                        className={`${display.className} text-xl text-amber-100`}
                     >
                        References
                     </h2>
                     <div className="mt-4 flex flex-wrap gap-2">
                        {references.map((ref, index) => (
                           <a
                              key={index}
                              href={ref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-amber-100/80 hover:border-white/40"
                           >
                              {ref}
                           </a>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-[#14110c] p-4">
                     <div className="relative w-full h-[360px] sm:h-[420px] md:h-[520px]">
                        {isImageLoading && (
                           <div className="absolute inset-0 bg-[#1a140f] animate-pulse rounded-xl" />
                        )}
                        <Image
                           src={imageError ? '/all-women.png' : figure.image}
                           alt={figure.title}
                           fill
                           sizes="(max-width: 768px) 100vw, 50vw"
                           className="object-cover rounded-xl"
                           priority={true}
                           quality={85}
                           onLoad={() => setIsImageLoading(false)}
                           onError={() => {
                              setImageError(true);
                              setIsImageLoading(false);
                           }}
                           placeholder="blur"
                           blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0FFRUVHSIeHhUVHiIYGBUVFRUYGBUWFhoaIRwUJCoeJCQqLCwsGiYzOi0uOiouLCz/2wBDAREVFRgYGBwgHBwsLCYqLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                     </div>
                     <div className="mt-4 flex flex-wrap gap-2">
                        {details.map((detail, index) => (
                           <span
                              key={index}
                              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-amber-100/80"
                           >
                              {detail}
                           </span>
                        ))}
                     </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#14110c] p-5">
                     <h2
                        className={`${display.className} text-xl text-amber-100`}
                     >
                        Biography
                     </h2>
                     <div className="mt-4 space-y-4 text-sm text-amber-100">
                        {biography.map((bio, index) => (
                           <p key={index} className="text-amber-100">
                              {bio}
                           </p>
                        ))}
                     </div>
                  </div>
               </div>
            </section>

            <div className="mt-10 flex flex-wrap gap-3">
               <Button
                  onClick={handleBack}
                  variant={'outline'}
                  className="border-white/20 text-amber-100 hover:bg-white/10"
               >
                  Previous
               </Button>
               <Button
                  onClick={handleNext}
                  className="bg-amber-300 text-neutral-900 border-amber-300 hover:bg-amber-200"
               >
                  Next
               </Button>
            </div>
         </div>
      </div>
   );
};

export default Page;
