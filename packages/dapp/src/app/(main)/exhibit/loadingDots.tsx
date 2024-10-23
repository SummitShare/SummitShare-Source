import { useState, useEffect } from 'react';

const LoadingDots = () => {
   const [dots, setDots] = useState('.');

   useEffect(() => {
      const interval = setInterval(() => {
         setDots((current) => {
            if (current === '...') return '.';
            return current + '.';
         });
      }, 500);

      return () => clearInterval(interval);
   }, []);

   return (
      <div className="h-screen w-full flex items-center justify-center">
         <span className="text-6xl text-brown-500 font-bold tracking-widest">
            {dots}
         </span>
      </div>
   );
};

export default LoadingDots;
