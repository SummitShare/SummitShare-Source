import React from 'react';
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
   priority?: boolean; // priority prop for above-the-fold cards
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
   return (
      <div
         key={item.name}
         onClick={() => onCardClick(item.name, item.link)}
         className="group bg-neutral-100 relative flex flex-col gap-6 justify-end h-64 rounded-lg p-4 overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105"
         onMouseEnter={() => onMouseEnter(item.name)}
         onMouseLeave={() => onMouseLeave(item.name)}
      >
         {loadingItem === item.name ? (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 z-30">
               Loading...
            </div>
         ) : (
            <>
               <div className="absolute inset-0 bg-primary-900/35 z-[4] rounded-lg" />

               <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover z-[2] md:transition-opacity md:duration-300 md:group-hover:opacity-0"
                  loading={priority ? 'eager' : 'lazy'}
                  priority={priority}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0FFRUVHSIeHhUVHiIYGBUVFRUYGBUWFhoaIRwUJCoeJCQqLCwsGiYzOi0uOiouLCz/2wBDAREVFRgYGBwgHBwsLCYqLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
               />

               <video
                  ref={setVideoRef}
                  data-name={item.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1] hidden md:block"
                  src={item.video}
                  muted
                  playsInline
                  loop
                  preload="none"
               />

               <div className="z-[5] space-y-2 relative">
                  <div className="space-y-1">
                     <p className="text-white text-lg font-medium">
                        {item.artifact}
                     </p>
                     <p className="text-white/80 text-sm">{item.name}</p>
                  </div>
                  <div className="w-[66px]">
                     <Button variant="white" size="small">
                        View
                     </Button>
                  </div>
               </div>
            </>
         )}
      </div>
   );
};

export default VideoCard;
