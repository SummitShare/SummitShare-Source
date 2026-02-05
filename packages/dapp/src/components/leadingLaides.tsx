'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/button/Button';

function LeadingLaides() {
   return (
      <section
         className="bg-gradient-to-r from-orange-400 to-orange-600 p-4
                      rounded-md border-b md:border-b-0 shadow-lg
                      md:flex md:flex-row md:gap-6 items-center md:mx-[15%] "
      >
         <div
            className="w-full md:w-1/2 h-[360px] rounded-xl overflow-hidden 
                    bg-[url('/all-women.png')] bg-cover bg-center bg-primary-50/25
                     transform transition-transform duration-500"
         ></div>

         <div className="space-y-8 md:w-1/2 flex flex-col justify-between pt-6 md:pt-0">
            <div className="space-y-6">
               <h1
                  className="text-3xl md:text-4xl font-bold text-white tracking-tight
                       leading-tight"
               >
                  The Leading Ladies of Zambia
               </h1>

               <div className="space-y-4">
                  <p className="text-lg text-white/90 leading-relaxed">
                     The Leading Ladies of Zambia virtual exhibit showcases the
                     extraordinary achievements of Women who have shaped history,
                     culture, and progress. Through these curated artifacts,
                     personal narratives, and immersive storytelling, we celebrate
                     the unsung heroines who have driven social, political, and
                     cultural transformations.
                  </p>
               </div>
            </div>

            <div className="flex flex-wrap gap-4">
               <Link href="/exhibit">
                  <Button variant="white" className="text-base font-medium px-8 py-2.5">
                     View Exhibit
                  </Button>
               </Link>
            </div>
         </div>
      </section>
   );
}
export default LeadingLaides;
