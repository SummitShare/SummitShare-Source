'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/button/Button';

function HeroSection() {
   return (
      <section className="relative w-full h-screen overflow-hidden">
         <Image
            src="https://s3.tebi.io/summitshare-images/WHM%20Baskets.jpg"
            alt="WHM Baskets"
            fill
            className="object-cover object-left-top"
            sizes="(max-width: 768px) 100vw, 100vw"
            priority
            quality={90}
         />

         {/* Enhanced gradient overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

         <div className="relative h-full z-[3] container px-4 md:px-[15%]">
            <div className="h-full flex items-end md:items-center pb-16 md:pb-0">
               <div className="w-full md:max-w-2xl">
                  {/* Content box */}
                  <div
                     className="backdrop-blur-sm bg-white/75 p-8 md:p-10 
                          rounded-xl shadow-2xl border border-white/20"
                  >
                     <div className="space-y-8">
                        {/* Text content */}
                        <div className="space-y-6">
                           <h1
                              className="text-3xl md:text-4xl font-bold text-neutral-900 
                               tracking-tight leading-tight"
                           >
                              The Leading Ladies of Zambia
                           </h1>

                           <p className="text-neutral-700 md:text-xl leading-relaxed">
                              Those who walked before us and those to come. Those
                              who wore red clay masks and rested their heads on
                              bended knees. Those who washed the cowry bead and
                              swung the snuff cup. Those who weaved the baskets
                              and wrapped the cloth. Those who fought for peace
                              and danced to the drum.
                           </p>
                        </div>

                        {/* Buttons - keeping original functionality */}
                        <div>
                           <Link href="/exhibit">
                              <Button
                                 className="transition-all duration-300 ease-in-out
                                   transform hover:-translate-y-0.5"
                              >
                                 View Exhibit
                              </Button>
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
export default HeroSection;
