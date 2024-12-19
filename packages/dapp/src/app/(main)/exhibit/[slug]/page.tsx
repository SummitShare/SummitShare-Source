'use client';
import DynamicCanvas from '@/app/components/3DCanvas/3dCanvas';
import { data } from './data';
import { Button } from '@/app/components/button/Button';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PageProps {
   params: { slug: string };
}

const Page = ({ params }: PageProps) => {
   const router = useRouter();
   const [currentIndex, setCurrentIndex] = useState<number>(-1);
   const [isImageLoading, setIsImageLoading] = useState(true);

   useEffect(() => {
      const index = data.findIndex(
         (item) => item.title.toLowerCase().replace(/ /g, '-') === params.slug
      );

      if (index === -1) {
         router.push('/exhibit');
         return;
      }

      setCurrentIndex(index);
      setIsImageLoading(true);
   }, [params.slug, router]);

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
      router.push('/exhibit');
   };

   return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-[15%] py-6 sm:py-12 mt-16 sm:mt-24">
         {/* Header Section */}
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 pr-4">
               {figure.title}
            </h1>
            <button
               onClick={handleClose}
               className="text-neutral-900 hover:text-orange-600 hover:underline text-sm sm:text-base whitespace-nowrap"
               aria-label="Close and return to exhibit"
            >
               Close
            </button>
         </div>

         {/* 3D Model Section */}
         <article className="space-y-6 sm:space-y-8">
            <div className="relative">
               <DynamicCanvas>{figure.object_URL}</DynamicCanvas>

               <div className="absolute -top-4 left-4">
                  <a
                     href={figure.object_address}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-block bg-white text-gray-700 px-3 py-1 rounded-full text-xs border border-gray-200 shadow-md hover:bg-gray-50 transition-colors"
                  >
                     Explorer
                  </a>
               </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
               <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  About the {figure.object_name}
               </h2>
               <div className="h-1 w-16 sm:w-24 bg-orange-500 mb-6" />
               <ul className="space-y-4">
                  {figure.Object_description.map((desc, index) => (
                     <li
                        key={index}
                        className="text-sm sm:text-base text-gray-700"
                     >
                        {desc}
                     </li>
                  ))}
               </ul>
            </div>
         </article>

         {/* Biography Section */}
         <section className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Biography</h2>
            <div className="h-1 w-16 sm:w-24 bg-orange-500 mb-6" />

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Biography Text Section - Left on desktop, bottom on mobile */}
               <div className="order-2 md:order-1 space-y-6">
                  <ul className="space-y-2">
                     {figure.figure_details.map((desc, index) => (
                        <li
                           key={index}
                           className="text-sm sm:text-base text-primary-100"
                        >
                           {desc}
                        </li>
                     ))}
                  </ul>
                  <div className="space-y-4">
                     {figure.figure_biography.map((bio, index) => (
                        <p
                           key={index}
                           className="text-sm sm:text-base text-gray-700"
                        >
                           {bio}
                        </p>
                     ))}
                  </div>
               </div>

               {/* Image Section - Right on desktop, top on mobile */}
               <div className="order-1 md:order-2">
                  <div className="relative w-full">
                     <div className="relative w-full h-[365px] md:h-[600px]">
                        {isImageLoading && (
                           <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
                        )}
                        <Image
                           src={figure.image}
                           alt={figure.title}
                           fill
                           sizes="(max-width: 768px) 100vw, 50vw"
                           className="object-contain md:object-cover rounded-lg"
                           priority={true}
                           quality={85}
                           onLoad={() => setIsImageLoading(false)}
                           placeholder="blur"
                           blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0FFRUVHSIeHhUVHiIYGBUVFRUYGBUWFhoaIRwUJCoeJCQqLCwsGiYzOi0uOiouLCz/2wBDAREVFRgYGBwgHBwsLCYqLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* References Section */}
         <section className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">References</h2>
            <ul className="space-y-3">
               {figure.figure_references.map((refArray, index) => (
                  <li key={index} className="flex flex-wrap gap-2">
                     {refArray.map((ref, subIndex) => (
                        <a
                           key={subIndex}
                           href={ref}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-block bg-white text-gray-800 border border-gray-300 rounded-full px-3 py-1 text-xs sm:text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors"
                        >
                           {ref}
                        </a>
                     ))}
                  </li>
               ))}
            </ul>
         </section>

         {/* Navigation Buttons */}
         <div className="flex gap-3 mt-8 sm:mt-12">
            <Button
               onClick={handleBack}
               variant={'outline'}
               className="flex-1 sm:flex-none"
            >
               Previous
            </Button>
            <Button onClick={handleNext} className="flex-1 sm:flex-none">
               Next
            </Button>
         </div>
      </div>
   );
};

export default Page;
