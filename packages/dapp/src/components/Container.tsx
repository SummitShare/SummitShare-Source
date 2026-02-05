import { ReactNode } from 'react';

function Container({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <div
         className={`w-full rounded-[0.5rem] py-3 px-3   border border-primary-100 ${className}`}
      >
         {children}
      </div>
   );
}

export default Container;
