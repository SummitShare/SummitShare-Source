'use client';
import {
   Bars3Icon,
   ChevronDownIcon,
   XMarkIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

function SecondaryNav() {
   const [openMenu, setOpenMenu] = useState<boolean>(false);
   const [openSecondaryMenu, setOpenSecondaryMenu] = useState<boolean>(false);

   const menuItems: {
      title: string;
      items: { name: string; link: string }[];
   }[] = [
      {
         title: 'Pages',
         items: [
            { name: 'What Is SummitShare?', link: '/blog' },
            { name: 'Need Something?', link: '/help' },
            // { name: 'The Leading Ladies', link: '/exhibit' },
         ],
      },
   ];

   const items: { name: string; link: string }[] = [
      // { name: 'Exhibit', link: '/exhibit' },
      { name: 'Blog', link: '/blog' },
      { name: 'Help', link: '/help' },
      { name: 'Profile', link: '/profile' },
      { name: 'Insights', link: '/distribution' },
   ];
   const pathname = usePathname();

   return (
      <nav className="  w-full p-6 flex flex-row justify-between items-center border-b border-primary-900-5">
         <div
            onClick={() => setOpenMenu(!openMenu)}
            className="p-1 border border-primary-900 rounded-sm"
         >
            <Bars3Icon className="w-4" />
         </div>
         <nav
            className={`fixed inset-y-0 left-0 w-fit  bg-white z-50 transform ${
               openMenu ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out`}
         >
            <div className="border-b border-primary-900-5 py-4 lg:py-[17.5px]">
               <div className="px-6 flex flex-row justify-between text-primary-900">
                  <h2 className="text-primary-400">Blog</h2>
                  <XMarkIcon
                     onClick={() => setOpenMenu(!openMenu)}
                     className="w-4 cursor-pointer"
                  />
               </div>
            </div>
            <ul className="px-6 py-4 space-y-4">
               {menuItems.map((menu, index) => (
                  <li
                     key={index}
                     className={`space-y-4 py-4 ${
                        index !== menuItems.length - 1
                           ? 'border-b border-primary-900-5'
                           : ''
                     }`}
                  >
                     <h4 className="font-normal text-primary-100">
                        {menu.title}
                     </h4>
                     <ul className="space-y-1">
                        {menu.items.map((subItem, subIndex) => (
                           <li
                              key={subIndex}
                              className={`text-xl md:text-base text-primary-700 font-normal ${
                                 pathname === subItem.link && 'text-primary-400'
                              }`}
                           >
                              <a href={subItem.link}>{subItem.name}</a>
                           </li>
                        ))}
                     </ul>
                  </li>
               ))}
            </ul>
         </nav>
      </nav>
   );
}

export default SecondaryNav;
