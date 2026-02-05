import React from 'react';

function ProblemSection() {
   return (
      <section className="py-16 md:py-24 md:mx-[15%] mx-[5%]">
         <div className="grid md:grid-cols-2 gap-6 md:gap-16 ">
            {/* Title Column */}

            <div className="relative h-[250px] md:h-[400px] w-full">
               <h2 className="text-6xl font-bold ">
                  <span className="absolute top-0 left-0 md:w-[400px] w-[320px] h-[50px] bg-blue-300"></span>
                  <span className="absolute -top-4 left-0 text-neutral-900">
                     Challenges
                  </span>
                  <span className="absolute top-8 left-12 text-orange-500">
                     in
                  </span>
                  <span className="absolute top-16 left-8 text-neutral-900">
                     Cultural
                  </span>
                  <span className="absolute top-28 left-16 text-orange-500">
                     Heritage
                  </span>
                  <span className="absolute top-40 left-0 text-neutral-900">
                     Repatriation
                  </span>
               </h2>
            </div>

            {/* Content Column */}

            <div className="bg-neutral-900 p-8 md:p-10 relative shadow-xl w-full">
               {/* Decorative corners */}
               <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-orange-500"></div>
               <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-orange-500"></div>
               <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-orange-500"></div>
               <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-orange-500"></div>

               <div className="space-y-8">
                  <p className="text-lg md:text-xl leading-relaxed text-white/95">
                     Cultural artifacts face profound challenges that extend
                     beyond their physical displacement. Decontextualization,
                     complex legal frameworks, and slow repatriation processes
                     have systematically disconnected African communities from
                     their historical treasures.
                  </p>

                  <p className="text-lg md:text-xl leading-relaxed text-white/95">
                     The colonial legacy continues to obstruct meaningful cultural
                     restoration, leaving artifacts isolated from their original
                     contexts and communities.
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
}

export default ProblemSection;
