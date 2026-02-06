'use client';

interface InfoCardProps {
   title: string;
   body: string;
   bgColor: string;
}

const InfoCard = ({ title, body, bgColor }: InfoCardProps) => {
   return (
      <div
         className={`w-full ${bgColor} p-4 h-full group 
                    transform transition-all duration-500 ease-out
                    hover:translate-y-[-8px] hover:shadow-2xl
                    hover:shadow-orange-500/20 relative`}
      >
         {/* Corner Decorations */}
         <div
            className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-neutral-900
                    transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-x-1"
         />
         <div
            className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-neutral-900
                    transform transition-all duration-500 group-hover:scale-110 group-hover:translate-x-1"
         />
         <div
            className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-neutral-900
                    transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-x-1"
         />
         <div
            className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-neutral-900
                    transform transition-all duration-500 group-hover:scale-110 group-hover:translate-x-1"
         />

         <div
            className="border-2 border-white/80 flex flex-col gap-8
                    items-center justify-center py-12 px-8 w-full h-full
                    relative overflow-hidden group-hover:border-white
                    transition-all duration-500"
         >
            {/* Background Gradient */}
            <div
               className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent
                      transform transition-all duration-700 opacity-0 group-hover:opacity-100"
            />

            <h3
               className="text-white font-bold text-xl md:text-2xl text-center uppercase 
                     tracking-wider relative z-10 whitespace-pre-line"
            >
               {title}
               <div
                  className="h-1 w-12 bg-white/80 mx-auto mt-4
                       transform transition-all duration-500
                       group-hover:w-16 group-hover:bg-white"
               />
            </h3>

            <p
               className="text-white/90 text-center leading-relaxed text-base md:text-lg
                    max-w-sm mx-auto
                    transform transition-all duration-500
                    group-hover:text-white"
            >
               {body}
            </p>
         </div>
      </div>
   );
};

const InfoGrid = () => {
   const cards = [
      {
         title: 'Digital Accessibility',
         body: 'We transcend geographical barriers by creating immersive digital experiences.',
         bgColor: 'bg-orange-600',
      },
      {
         title: 'Restoring \n Context',
         body: 'Our exhibits restore the historical and cultural context of artifacts.',
         bgColor: 'bg-orange-500',
      },
      {
         title: 'Community Empowerment',
         body: 'We generate direct financial support for cultural preservation and heritage communities.',
         bgColor: 'bg-orange-400',
      },
   ];

   return (
      <section className="py-16 md:py-24 md:mx-[15%] mx-[5%]">
         <div className="space-y-8 mb-16">
            <div className="max-w-3xl space-y-6">
               <h2
                  className="text-4xl md:text-5xl font-bold text-neutral-900
                       tracking-tight relative
                       after:content-[''] after:block after:w-24 
                       after:h-1 after:bg-orange-500 after:mt-4"
               >
                  Bridging Cultural Gaps
               </h2>
               <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
                  SummitShare addresses the challenges of the repatriation effort
                  through three innovative approaches:
               </p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {cards.map((card, index) => (
               <div key={index} className="h-full">
                  <InfoCard
                     title={card.title}
                     body={card.body}
                     bgColor={card.bgColor}
                  />
               </div>
            ))}
         </div>
      </section>
   );
};

export default InfoGrid;
