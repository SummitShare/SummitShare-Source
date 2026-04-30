'use client';

import { useEffect, useState } from 'react';

const ReadingProgress = () => {
   const [progress, setProgress] = useState(0);

   useEffect(() => {
      const update = () => {
         const scrollTop = window.scrollY || document.documentElement.scrollTop;
         const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
         setProgress(height > 0 ? (scrollTop / height) * 100 : 0);
      };

      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);

      return () => {
         window.removeEventListener('scroll', update);
         window.removeEventListener('resize', update);
      };
   }, []);

   return (
      <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
         <div
            className="h-full bg-orange-600 transition-[width] duration-75 ease-out"
            style={{ width: `${progress}%` }}
         />
      </div>
   );
};

export default ReadingProgress;
