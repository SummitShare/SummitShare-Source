import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { Button } from '@/components/button/Button';

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

function HeroSection() {
   return (
      <section
         className={`relative w-full min-h-[80vh] overflow-hidden pt-24 md:pt-28 ${body.className}`}
      >
         <Image
            src="https://pub-a2d19ba4b3934be7a05aa694f8e6618c.r2.dev/baskets%20potrait.png"
            alt="WHM Baskets"
            fill
            className="object-cover object-left-top block md:hidden"
            sizes="(max-width: 768px) 100vw, 0px"
            priority
            quality={75}
         />
         <Image
            src="https://pub-a2d19ba4b3934be7a05aa694f8e6618c.r2.dev/baskets%20main.png"
            alt="WHM Baskets"
            fill
            className="object-cover object-left-top hidden md:block"
            sizes="(max-width: 768px) 0px, 100vw"
            priority
            quality={75}
         />

         {/* Enhanced gradient overlay */}
         <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/45 to-black/80" />
         <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_15%,rgba(255,201,120,0.22),transparent_50%),radial-gradient(800px_circle_at_85%_25%,rgba(255,120,40,0.18),transparent_55%)]" />

         <div className="relative z-[3] px-4 md:px-[15%]">
            <div className="flex min-h-[80vh] items-end md:items-center pb-16 md:pb-12">
               <div className="w-full md:max-w-3xl">
                  <div className="space-y-8">
                     <div className="space-y-5">
                        <p className="text-[11px] uppercase tracking-[0.4em] text-orange-500">
                           Digital Exhibit
                        </p>
                        <h1
                           className={`${display.className} text-4xl md:text-6xl text-amber-50 leading-tight`}
                        >
                           The Leading Ladies of Zambia
                        </h1>
                        <p className="text-amber-100/85 md:text-xl leading-relaxed">
                           Those who walked before us and those to come. Those who
                           wore red clay masks and rested their heads on bended
                           knees. Those who washed the cowry bead and swung the
                           snuff cup. Those who weaved the baskets and wrapped the
                           cloth. Those who fought for peace and danced to the
                           drum.
                        </p>
                     </div>

                     <div className="flex flex-wrap gap-3">
                        <Link href="/exhibit">
                           <Button
                              className="bg-orange-500 text-neutral-900 border-orange-500 hover:bg-orange-600 hover:border-orange-600 focus:ring-orange-500"
                              size="medium"
                           >
                              View Exhibit
                           </Button>
                        </Link>
                        <Link href="/exhibit#artifact-grid">
                           <Button
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                              size="medium"
                           >
                              Browse Artifacts
                           </Button>
                        </Link>
                     </div>

                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
                        {[
                           { label: 'Artifacts', value: '6' },
                           { label: '3D Models', value: 'Immersive' },
                           { label: 'Stories', value: 'Curated' },
                        ].map((stat) => (
                           <div
                              key={stat.label}
                              className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/10"
                           >
                              <p className="text-lg font-semibold text-orange-200">
                                 {stat.value}
                              </p>
                              <p className="text-[10px] uppercase tracking-[0.3em] text-orange-200/70">
                                 {stat.label}
                              </p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
export default HeroSection;
