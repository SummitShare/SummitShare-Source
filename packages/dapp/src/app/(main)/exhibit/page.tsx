'use client';

import Link from 'next/link';
import { useState, useRef, RefCallback, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { women } from './[slug]/data';
import VideoCard from '@/components/videoCard';
import { Button } from '@/components/button/Button';
import CollaborateWithUs from '@/components/collaborateWithUs';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

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

interface VideoRefs {
   [key: string]: HTMLVideoElement | null;
}

export default function Home(): JSX.Element {
   const [loadingItem, setLoadingItem] = useState<string | null>(null);
   const videoRefs = useRef<VideoRefs>({});

   const router = useRouter();

   const setVideoRef: RefCallback<HTMLVideoElement> = (element) => {
      if (element) {
         const name = element.getAttribute('data-name');
         if (name) {
            videoRefs.current[name] = element;
         }
      }
   };

   const handleMouseEnter = useCallback((name: string): void => {
      const video = videoRefs.current[name];
      if (video) {
         video
            .play()
            .catch((err: Error) => console.log('Autoplay prevented:', err));
      }
   }, []);

   const handleMouseLeave = useCallback((name: string): void => {
      const video = videoRefs.current[name];
      if (video) {
         video.pause();
         video.currentTime = 0;
      }
   }, []);

   const handleCardClick = useCallback(
      (name: string, link: string): void => {
         setLoadingItem(name);
         router.push(link);
      },
      [router]
   );

   const stats = [
      { label: 'Artifacts', value: `${women.length}` },
      { label: '3D Models', value: 'Immersive' },
      { label: 'Stories', value: 'Curated' },
      { label: 'Access', value: 'Free' },
   ];

   return (
      <div
         className={`${body.className} min-h-screen bg-[#0b0907] text-amber-50`}
      >
         <section className="relative overflow-hidden">
            <div className="absolute inset-0">
               <Image
                  src="https://pub-a2d19ba4b3934be7a05aa694f8e6618c.r2.dev/baskets%20potrait.png"
                  alt="WHM Baskets"
                  fill
                  className="object-cover opacity-25 block md:hidden"
                  sizes="(max-width: 768px) 100vw, 0px"
                  priority
                  quality={75}
               />
               <Image
                  src="https://pub-a2d19ba4b3934be7a05aa694f8e6618c.r2.dev/baskets%20main.png"
                  alt="WHM Baskets"
                  fill
                  className="object-cover opacity-25 hidden md:block"
                  sizes="(max-width: 768px) 0px, 100vw"
                  priority
                  quality={75}
               />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0907] via-[#120f0b]/80 to-[#0b0907]" />
            <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_12%_12%,rgba(255,210,140,0.18),transparent_55%),radial-gradient(800px_circle_at_85%_22%,rgba(255,120,40,0.16),transparent_60%)]" />

            <div className="relative px-6 md:px-[12%] pt-28 md:pt-32 pb-16">
               <div className="max-w-3xl space-y-6">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-amber-200/70">
                     Exhibit
                  </p>
                  <h1
                     className={`${display.className} text-4xl md:text-6xl text-amber-50 leading-tight`}
                  >
                     The Leading Ladies of Zambia
                  </h1>
                  <p className="text-amber-100/80 md:text-lg leading-relaxed">
                     A living archive of courage, craft, and cultural memory.
                     Explore the artifacts, stories, and 3D reconstructions that
                     celebrate the women who shaped Zambia&apos;s history.
                  </p>

                  <div className="flex flex-wrap gap-3">
                     <Link
                        href="https://awe.box/play/VPFGa26SS4liwVsOAg0a?draft=true"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <Button
                           className="bg-amber-300 text-neutral-900 border-amber-300 hover:bg-amber-200"
                           size="medium"
                        >
                           Enter Exhibit
                        </Button>
                     </Link>
                     <Link href="#artifact-grid">
                        <Button
                           variant="outline"
                           className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                           size="medium"
                        >
                           Browse Artifacts
                        </Button>
                     </Link>
                  </div>
                  <p className="text-xs italic text-amber-200/80">
                     * Current virtual exhibit is in beta — early access.
                  </p>
               </div>

               <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
                  {stats.map((stat) => (
                     <div
                        key={stat.label}
                        className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/10"
                     >
                        <p className="text-lg font-semibold text-amber-100">
                           {stat.value}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/70">
                           {stat.label}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <section id="artifact-grid" className="relative">
            <div className="relative mx-4 md:mx-[10%] -mt-10 rounded-[32px] bg-[#f8f2e6] text-neutral-900 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.5)]">
               <div className="px-6 md:px-10 py-12">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                     <div className="space-y-3">
                        <p className="text-[11px] uppercase tracking-[0.4em] text-neutral-500">
                           Collection
                        </p>
                        <h2
                           className={`${display.className} text-3xl md:text-4xl text-neutral-900`}
                        >
                           Artifacts
                        </h2>
                        <p className="text-neutral-600 max-w-xl">
                           Each object is restored, annotated, and paired with a
                           3D model for closer exploration. Hover to preview the
                           motion of each artifact.
                        </p>
                     </div>
                     <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-neutral-500">
                        <span className="rounded-full border border-neutral-200 bg-white px-3 py-2">
                           3D Models
                        </span>
                        <span className="rounded-full border border-neutral-200 bg-white px-3 py-2">
                           Storytelling
                        </span>
                        <span className="rounded-full border border-neutral-200 bg-white px-3 py-2">
                           On-chain provenance
                        </span>
                     </div>
                  </div>

                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                     {women.map((item, index) => (
                        <VideoCard
                           key={item.name}
                           item={item}
                           loadingItem={loadingItem}
                           onCardClick={handleCardClick}
                           setVideoRef={setVideoRef}
                           onMouseEnter={handleMouseEnter}
                           onMouseLeave={handleMouseLeave}
                           priority={index < 3}
                        />
                     ))}
                  </div>
               </div>
            </div>
         </section>

         <div className="mt-16">
            <CollaborateWithUs />
         </div>
      </div>
   );
}
