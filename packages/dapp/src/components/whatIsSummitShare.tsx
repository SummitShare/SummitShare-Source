import React from 'react';
import { Button } from './button/Button';
import Link from 'next/link';

function WhatIsSummitShare() {
   return (
      <section className="py-16 md:py-24 md:mx-[15%] mx-[5%]">
         <div className="max-w-4xl space-y-12">
            {/* Title and description */}
            <div className="space-y-6">
               <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight relative">
                  What is <span className="text-orange-600">SummitShare</span>
                  <span className="text-neutral-900">?</span>
                  <div className="h-1 w-24 bg-orange-500 mt-6" />
               </h2>

               <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
                  SummitShare stands as a pioneering digital platform dedicated to
                  the repatriation of African cultural artifacts. Bridging the
                  past and present, it serves as a beacon of hope and a testament
                  to the resilience of African heritage, utilizing technology to
                  reclaim, celebrate, and share the rich tapestry of Africas
                  history with the world.
               </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
               <Link href="/donate">
                  <Button variant="default" size={'medium'}>
                     Donate
                  </Button>
               </Link>

               <Link href="https://github.com/summitshare">
                  <Button variant="outline" size={'medium'}>
                     Star repo
                  </Button>
               </Link>
            </div>
         </div>
      </section>
   );
}

export default WhatIsSummitShare;
