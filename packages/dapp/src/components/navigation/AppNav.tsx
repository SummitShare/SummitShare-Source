import Link from 'next/link';
import NavAuthControls from './NavAuthControls';
import NavDrawer from './NavDrawer';
import NavLinks from './NavLinks';
import NavMenuAuthItem from './NavMenuAuthItem';
import PrimaryNav, { Wordmark } from './PrimaryNav';
import WalletNavButton from './WalletNavButton';

/**
 * The header for routes under the `(main)` / `(settings)` root layouts, where a
 * `SessionProvider` and `Web3Provider` are in scope.
 *
 * This module is the only place the session and wallet islands are imported, so
 * they belong to these routes' bundles alone. Static routes use `StaticNav`,
 * which renders the same shell without them.
 */
export default function AppNav() {
   return (
      <PrimaryNav
         wordmark={
            <Link href="/">
               <Wordmark />
            </Link>
         }
         links={<NavLinks />}
         actions={
            <>
               <li className="flex-shrink-0">
                  <WalletNavButton />
               </li>
               <NavAuthControls />
            </>
         }
         menu={
            <NavDrawer
               authSlot={<NavMenuAuthItem />}
               walletSlot={<WalletNavButton mobile />}
            />
         }
      />
   );
}
