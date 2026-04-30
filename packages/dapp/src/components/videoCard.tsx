import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/button/Button';
import { WomanData } from '@/types/frontend';

interface VideoCardProps {
   item: WomanData;
   loadingItem: string | null;
   onCardClick: (name: string, link: string) => void;
   setVideoRef: (element: HTMLVideoElement | null) => void;
   onMouseEnter: (name: string) => void;
   onMouseLeave: (name: string) => void;
   priority?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
   item,
   loadingItem,
   onCardClick,
   setVideoRef,
   onMouseEnter,
   onMouseLeave,
   priority = false,
}) => {
   const [imgError, setImgError] = useState(false);
   const [isHovered, setIsHovered] = useState(false);
   const [videoReady, setVideoReady] = useState(false);

   const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
      onMouseEnter(item.name);
   }, [item.name, onMouseEnter]);

   const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      onMouseLeave(item.name);
   }, [item.name, onMouseLeave]);

   const showVideo = isHovered && videoReady;

   return (
      <div
         key={item.name}
         onClick={() => onCardClick(item.name, item.link)}
         className="group relative isolate flex h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#14110c] p-5 text-amber-50 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)] transition-all duration-300 ease-in-out will-change-transform hover:-translate-y-1 hover:shadow-[0_32px_80px_-50px_rgba(0,0,0,0.8)] cursor-pointer"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         {loadingItem === item.name ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#14110c] z-30">
               <p className="text-sm text-amber-100/70">Loading...</p>
            </div>
         ) : (
            <>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[4] rounded-2xl" />

               <Image
                  src={imgError ? '/all-women.png' : item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover z-[1] transition-opacity duration-500 ${
                     showVideo ? 'opacity-0' : 'opacity-100'
                  }`}
                  loading={priority ? 'eager' : 'lazy'}
                  priority={priority}
                  onError={() => setImgError(true)}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0FFRUVHSIeHhUVHiIYGBUVFRUYGBUWFhoaIRwUJCoeJCQqLCwsGiYzOi0uOiouLCz/2wBDAREVFRgYGBwgHBwsLCYqLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
               />

               <video
                  ref={setVideoRef}
                  data-name={item.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-[2] hidden md:block ${
                     showVideo ? 'opacity-100' : 'opacity-0'
                  }`}
                  src={item.video}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  onCanPlay={() => setVideoReady(true)}
               />

               <div className="z-[5] space-y-3 relative">
                  <div className="space-y-1">
                     <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">
                        {item.artifact}
                     </p>
                     <p className="text-xl font-semibold text-amber-100">
                        {item.name}
                     </p>
                  </div>
                  <div className="w-fit">
                     <Button
                        variant="white"
                        size="small"
                        className="border-white/20 bg-white/90 text-neutral-900 hover:bg-white"
                     >
                        View Artifact
                     </Button>
                  </div>
               </div>
            </>
         )}
      </div>
   );
};

export default VideoCard;
