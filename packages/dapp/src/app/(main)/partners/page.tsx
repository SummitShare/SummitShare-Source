import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Partner {
   name: string;
   logo: string;
   website: string;
}

const partners: Partner[] = [
   {
      name: "Women's History Museum of Zambia",
      logo: 'https://pub-a2d19ba4b3934be7a05aa694f8e6618c.r2.dev/whmz.jpg',
      website: 'https://www.whmzambia.org/',
   },
   {
      name: 'Ethereum Foundation',
      logo: 'https://pub-a2d19ba4b3934be7a05aa694f8e6618c.r2.dev/ef.png',
      website: 'https://ethereum.foundation/',
   },
   {
      name: 'Octant',
      logo: 'https://pub-a2d19ba4b3934be7a05aa694f8e6618c.r2.dev/octant.png',
      website: 'https://octant.app/',
   },
];

const Partners: React.FC = () => {
   return (
      <div className="flex flex-col items-center md:mx-[15%] mx-[5%]">
         <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
               Our Partners and Supporters
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
         </div>

         {/* Staggered Grid */}
         <div className="grid gap-6 grid-cols-3">
            {/* Row 1 */}
            {partners.slice(0, 3).map((partner, index) => (
               <div key={index} className="flex justify-center">
                  <Link
                     href={partner.website}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                        <Image
                           src={partner.logo}
                           alt={partner.name}
                           width={120}
                           height={120}
                           className="object-contain"
                        />
                     </div>
                  </Link>
               </div>
            ))}

            {/* Row 2 */}
            <div className="col-span-3 flex justify-center gap-12">
               {partners.slice(3, 5).map((partner, index) => (
                  <div key={index} className="flex justify-center">
                     <Link
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                           <Image
                              src={partner.logo}
                              alt={partner.name}
                              width={96}
                              height={96}
                              className="object-contain"
                           />
                        </div>
                     </Link>
                  </div>
               ))}
            </div>

            {/* Row 3 */}
            {partners.slice(5, 8).map((partner, index) => (
               <div key={index} className="flex justify-center">
                  <Link
                     href={partner.website}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                        <Image
                           src={partner.logo}
                           alt={partner.name}
                           width={120}
                           height={120}
                           className="object-contain"
                        />
                     </div>
                  </Link>
               </div>
            ))}
         </div>
         <div className="  text-center space-y-8">
            <p className=" text-lg md:text-xl leading-relaxed text-neutral-700  max-w-2xl">
               A big Thank you to our dedicated partners who have helped bring our
               vision to life.
            </p>

            <Link
               href="https://summitshare.co/blog/BkntmFS8R"
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-6 py-3 
             bg-orange-500 text-white rounded-full 
             shadow-lg hover:shadow-xl
             transform transition-all duration-300 
             hover:-translate-y-1 hover:bg-orange-600"
            >
               Read more about our partners
               <ArrowRight className="w-4 h-4" />
            </Link>
         </div>
      </div>
   );
};

export default Partners;
