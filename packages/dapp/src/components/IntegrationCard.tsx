'use client';

import Image from 'next/image';
import { Button } from './button/Button';
import { Lock } from 'lucide-react'; // For coming soon indicator
import LeadingLaides from './leadingLaides';

interface IntegrationCardProps {
   imageUrl: string;
   subTitle: string;
   title: string;
   body: string;
   buttonText: string;
   // onButtonClick: () => void;
   comingSoon?: boolean;
}

const IntegrationCard = ({
   imageUrl,
   subTitle,
   title,
   body,
   buttonText,
   comingSoon = false,
}: IntegrationCardProps) => {
   return (
      <div className="relative flex flex-col group transform transition-all duration-500">
         {/* Image and Labels Container */}
         <div className="relative">
            {/* Top Label */}
            <div
               className="absolute -top-3 -right-3 bg-orange-600 px-6 py-2 z-[3]
                       shadow-lg transform transition-all duration-300
                       group-hover:shadow-xl group-hover:-translate-y-1"
            >
               <p className="text-xs text-white font-bold tracking-widest uppercase">
                  {subTitle}
               </p>
            </div>

            {/* Main Image Container */}
            <div
               className="relative h-[400px] w-full 
                       shadow-lg group-hover:shadow-xl
                       transform transition-all duration-500"
            >
               <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className={`object-cover transition-all duration-700 bg-orange-200/80
                       group-hover:scale-105 
                       ${comingSoon ? 'grayscale hover:grayscale-0' : ''}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
               />
               {comingSoon && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                     <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full">
                        <Lock className="w-8 h-8 text-white" />
                     </div>
                  </div>
               )}

               {/* Title Box */}
               <div
                  className="absolute -bottom-4 -left-1 bg-white p-6 max-w-[85%] 
                         shadow-md transform transition-transform duration-300
                         group-hover:translate-y-[-4px] group-hover:shadow-md"
               >
                  <p className="text-lg font-bold text-neutral-900">{title}</p>
               </div>
            </div>
         </div>

         {/* Content */}
         {/* <div className="space-y-6 mt-12">
        <p className="text-base md:text-lg text-neutral-700 line-clamp-4 leading-relaxed">{body}</p>
        <Button 
          onClick={onButtonClick}
          className={`${comingSoon 
            ? 'bg-neutral-400 hover:bg-neutral-500 cursor-not-allowed border-neutral-400'
            : 'bg-orange-600 hover:bg-orange-700 hover:translate-y-[-2px] border-orange-600'}`}
          disabled={comingSoon}
        >
          {buttonText}
        </Button>
      </div> */}
      </div>
   );
};

const IntegrationGrid = () => {
   const cards = [
      {
         imageUrl: '/all-women.png',
         subTitle: 'GWEMBE VALLEY',
         title: 'THE LEADING LADIES EXHIBIT',
         body: "The 'Leading Ladies of Zambia' virtual exhibit showcases the extraordinary achievements of Women who have shaped history, culture, and progress. Through these curated artifacts, personal narratives, and immersive storytelling, we celebrate the unsung heroines who have driven social, political, and cultural transformations.",
         buttonText: 'PURCHASE TICKET',
         comingSoon: false,
      },
   ];

   return (
      <section className="py-16 md:py-24 md:mx-[15%] mx-[5%]">
         <div className="relative">
            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
               {/* Left side - Text content */}
               <div className="w-full md:w-1/2 space-y-8">
                  <div className="space-y-6">
                     <h2
                        className="text-3xl md:text-4xl font-bold text-white tracking-tight relative
                            after:content-[''] after:block after:w-24 after:h-1 
                            after:bg-orange-500 after:mt-4"
                     >
                        Virtual Exhibits and Immersive Experiences
                     </h2>
                     <div className="space-y-4">
                        <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                           Our interactive exhibits leverage 3D technologies and
                           virtual reality to create engaging cultural
                           experiences. Each exhibit transforms digital spaces
                           into rich, contextual narratives.
                        </p>
                        <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                           Our ticketing and revenue-sharing systems not only
                           provide access but also generate direct financial
                           support for cultural preservation and ensure
                           sustainable development of heritage communities.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Right side - Card */}
               <div className="w-full md:w-1/2">
                  {cards.map((card, index) => (
                     <IntegrationCard key={index} {...card} />
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
};

export default IntegrationGrid;
