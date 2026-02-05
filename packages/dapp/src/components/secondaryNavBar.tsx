import { usePathname } from 'next/navigation';
import * as React from 'react';

function SecondaryNavBar() {
   const pathname = usePathname();

   return (
      <>
         <nav className="w-full border-b border-secondary-100 mt-32">
            <ul className="space-y-6 mx-6 lg:mx-[20%]">
               <li>
                  <h2>Settings</h2>
               </li>
               <li>
                  <ul className="flex gap-6 w-full pb-1">
                     <li>
                        <p className="underline underline-offset-[10px]">
                           Profile
                        </p>
                     </li>
                  </ul>
               </li>
            </ul>
         </nav>
      </>
   );
}

export default SecondaryNavBar;
