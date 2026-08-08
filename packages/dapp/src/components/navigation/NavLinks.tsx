'use client';

import { usePathname } from 'next/navigation';
import { NAV_LINKS } from './navLinks';

/**
 * The desktop link row, split out purely because the active-page underline
 * needs `usePathname`. It imports nothing but the router, so the client cost
 * is a few hundred bytes — the session and wallet controls are separate
 * islands the server can decline to render at all.
 */
export default function NavLinks() {
   const pathname = usePathname();

   return (
      <ul className="flex flex-row gap-6 text-p1-m text-neutral-100">
         {NAV_LINKS.map((item) => (
            <li
               key={item.link}
               className={`hover:text-neutral-700 hover:underline underline-offset-[0.625rem] cursor-pointer ${
                  pathname === item.link &&
                  'text-neutral-900 font-bold underline underline-offset-[0.625rem]'
               }`}
            >
               <a href={item.link}>{item.name}</a>
            </li>
         ))}
      </ul>
   );
}
