'use client';

import { signOut, useSession } from 'next-auth/react';
import { SIGN_IN_LINK } from './navLinks';

/** The drawer's Log In / Log Out entry. Session-dependent, so it is its own island. */
export default function NavMenuAuthItem() {
   const session = useSession();
   const authenticated = session.status === 'authenticated';

   return (
      <li className="text-[1.25rem] text-neutral-700 font-normal">
         <a
            href={SIGN_IN_LINK}
            onClick={authenticated ? async () => await signOut() : undefined}
         >
            {authenticated ? 'Log Out' : 'Log In'}
         </a>
      </li>
   );
}
