'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, RefCallback } from 'react';
import Image from 'next/image';
import { validatePageAccess } from '@/utils/methods/ticketPurchase/ticketService';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { women } from './[slug]/data';
import VideoCard from '@/app/components/videoCard';
import { Button } from '@/app/components/button/Button';
import CollaborateWithUs from '@/app/components/collaborateWithUs';

interface VideoRefs {
   [key: string]: HTMLVideoElement | null;
}

export default function Home(): JSX.Element {
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [loadingItem, setLoadingItem] = useState<string | null>(null);
   const videoRefs = useRef<VideoRefs>({});

   const { address } = useAccount();
   const router = useRouter();
   const session = useSession();

   const setVideoRef: RefCallback<HTMLVideoElement> = (element) => {
      if (element) {
         const name = element.getAttribute('data-name');
         if (name) {
            videoRefs.current[name] = element;
         }
      }
   };

   useEffect(() => {
      const validateAccess = async (): Promise<void> => {
         // setIsLoading(true);
         // if (!address) {
         //    router.push('/connect-wallet');
         //    return;
         // }

         try {
            const { hasAccess } = await validatePageAccess(
               address,
               router,
               session
            );
            if (!hasAccess) {
               // Handle no access case if needed
            }
         } catch (error) {
            console.error('Access validation error:', error);
         } finally {
            // setIsLoading(false);
         }
      };

      session.status === 'authenticated' ? validateAccess() : setIsLoading(false);
   }, [address, router, session]);

   const handleMouseEnter = (name: string): void => {
      const video = videoRefs.current[name];
      if (video) {
         video
            .play()
            .catch((err: Error) => console.log('Autoplay prevented:', err));
      }
   };

   const handleMouseLeave = (name: string): void => {
      const video = videoRefs.current[name];
      if (video) {
         video.pause();
         video.currentTime = 0;
      }
   };

   const handleCardClick = (name: string, link: string): void => {
      setLoadingItem(name);
      router.push(link);
   };

   if (isLoading) {
      return (
         <div className="h-screen w-full flex items-center justify-center">
            <p>Loading...</p>
         </div>
      );
   }

   return (
      <div className="min-h-screen">
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

            <div className="relative h-full z-[3] container px-4 md:px-[15%]">
               <div className="h-full flex items-end md:items-center pb-16 md:pb-0">
                  <div className="w-full md:max-w-2xl">
                     <div className="backdrop-blur-sm bg-white/75 p-8 md:p-10 rounded-xl shadow-2xl border border-white/20">
                        <div className="space-y-8">
                           <div className="space-y-6">
                              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight leading-tight">
                                 The Leading Ladies of Zambia
                              </h1>
                              <p className="text-neutral-700 md:text-xl leading-relaxed">
                                 Those who walked before us and those to come.
                                 Those who wore red clay masks and rested their
                                 heads on bended knees. Those who washed the cowry
                                 bead and swung the snuff cup. Those who weaved
                                 the baskets and wrapped the cloth. Those who
                                 fought for peace and danced to the drum.
                              </p>
                           </div>
                           <div className="flex gap-2">
                              <Link href="https://oncyber.io/spaces/89cp8FpYgF5hgrHk1i3N">
                                 <Button>Enter Exhibit</Button>
                              </Link>
                              <Link href="/distribution">
                                 <Button variant="white">Learn more</Button>
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section className="w-full px-6 md:px-[15%] py-24 max-w-[1920px] mx-auto">
            <div className="space-y-4 mb-10">
               <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight relative after:content-[''] after:block after:w-24 after:h-1 after:bg-orange-500 after:mt-4">
                  Artifacts
               </h2>
               <p className="text-lg md:text-xl leading-relaxed text-neutral-700 max-w-2xl">
                  Explore the lives of the leading ladies through their cherished
                  artifacts, digitally restored and viewable in stunning detail
                  from all angles.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 auto-rows-fr">
               {women.map((item, index) => (
                  <VideoCard
                     key={item.name}
                     item={item}
                     loadingItem={loadingItem}
                     onCardClick={handleCardClick}
                     setVideoRef={setVideoRef}
                     onMouseEnter={handleMouseEnter}
                     onMouseLeave={handleMouseLeave}
                     priority={index < 3} // Prioritize loading for first 3 cards
                  />
               ))}
            </div>
         </section>

         <CollaborateWithUs />
      </div>
   );
}
