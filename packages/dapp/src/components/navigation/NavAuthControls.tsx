'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserCircle } from 'lucide-react';
import { Button } from '../button/Button';
import { PROFILE_LINK, SIGN_IN_LINK } from './navLinks';

/**
 * The only part of the header that needs the session, and therefore the only
 * part that requires a `SessionProvider` ancestor. `PrimaryNav` renders it
 * behind its `auth` prop, so a route that opts out never emits this client
 * reference and never loads next-auth.
 */
export default function NavAuthControls() {
   const router = useRouter();
   const session = useSession();

   if (session.status === 'authenticated') {
      return (
         <li className="group bg-gradient-to-br from-neutral-50 to-neutral-100 w-10 h-10 rounded-full flex items-center justify-center transition-all">
            <Link href={PROFILE_LINK}>
               <UserCircle className="w-8 h-8 text-neutral-600 group-hover:text-neutral-900/80 transition-all" />
            </Link>
         </li>
      );
   }

   return (
      <li className="flex-shrink-0">
         <Button
            variant={'outline'}
            onClick={() => router.push(SIGN_IN_LINK)}
            className="whitespace-nowrap"
         >
            Sign In
         </Button>
      </li>
   );
}
