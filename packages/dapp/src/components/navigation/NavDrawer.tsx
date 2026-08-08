'use client';

import { useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_MENU_PAGES, PROFILE_LINK } from './navLinks';

/**
 * The narrow-screen drawer. Client-side only because it holds open/closed
 * state — it imports no auth or wallet code. Anything session- or
 * wallet-dependent arrives as a slot, already decided by the server, so a
 * route that opts out of those never pulls them in through here.
 */
export default function NavDrawer({
   authSlot,
   walletSlot,
}: Readonly<{
   authSlot?: ReactNode;
   walletSlot?: ReactNode;
}>) {
   const [open, setOpen] = useState(false);

   return (
      <>
         <button
            type="button"
            aria-expanded={open}
            aria-label="Open menu"
            className="lg:hidden"
            onClick={() => setOpen(true)}
         >
            <Menu className="w-4" />
         </button>

         {open && (
            <div
               className="fixed inset-0 bg-black/40 z-40 lg:hidden"
               onClick={() => setOpen(false)}
            />
         )}

         <nav
            aria-label="Menu"
            className={`fixed inset-y-0 left-0 w-[70%] md:w-[40%] bg-white z-50 transform border-r border-neutral-900-5 lg:hidden ${
               open ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out`}
         >
            <div className="border-b border-neutral-900-5 py-[18px]">
               <div className="px-6 flex flex-row justify-between text-neutral-900">
                  <span className="nav-wordmark">
                     <span className="text-orange-500">Summit</span>Share
                  </span>
                  <button
                     type="button"
                     aria-label="Close menu"
                     onClick={() => setOpen(false)}
                  >
                     <X className="w-4 cursor-pointer" />
                  </button>
               </div>
            </div>

            <ul className="px-6 mt-6 max-h-[80%] flex flex-col gap-6 justify-between overflow-y-auto">
               <li className="space-y-4 py-2 border-b border-neutral-900-5">
                  <h4 className="font-normal text-neutral-400">Pages</h4>
                  <ul className="space-y-1">
                     {NAV_MENU_PAGES.map((item) => (
                        <li
                           key={item.link}
                           className="text-[1.25rem] text-neutral-700 font-normal"
                        >
                           <a href={item.link}>{item.name}</a>
                        </li>
                     ))}
                  </ul>
               </li>

               <li className="space-y-4 py-2">
                  <h4 className="font-normal text-neutral-400">Settings</h4>
                  <ul className="space-y-1">
                     <li className="text-[1.25rem] text-neutral-700 font-normal">
                        <a href={PROFILE_LINK}>Profile</a>
                     </li>
                     {authSlot}
                  </ul>
               </li>

               {walletSlot && <li>{walletSlot}</li>}
            </ul>
         </nav>
      </>
   );
}
