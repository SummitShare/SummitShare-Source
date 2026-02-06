import React from 'react';

interface bannerProps {
   header: string;
   text: string;
   color: string;
}

function Banner({ header, text, color }: bannerProps) {
   return (
      <div
         className={`bg-gradient-to-br from-${color}-300 via-${color}-500 to-${color}-700 rounded-xl px-6  py-8  space-y-2`}
      >
         <h1 className="text-white/90"> {header}</h1>
         <p className="text-white/60">{text}</p>
      </div>
   );
}

export default Banner;
