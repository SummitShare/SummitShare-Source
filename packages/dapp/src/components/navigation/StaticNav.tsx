import PrimaryNav, { Wordmark } from './PrimaryNav';
import { NAV_LINKS, PROFILE_LINK, SIGN_IN_LINK } from './navLinks';

/**
 * The header for routes outside the `(main)` root layout — `/record` today.
 *
 * Renders the same shell as `AppNav` and is indistinguishable from it, but
 * imports no client component at all, so the route carries no next-auth, no
 * wagmi and no connectkit. Two consequences follow from that, both deliberate:
 *
 * - Plain anchors, not `next/link`. Crossing a root layout is a full document
 *   navigation, so `Link` could not client-navigate anyway, and its router
 *   prefetch would pull the destination's whole bundle onto this page.
 * - No session, so the sign-in control is a link rather than a session-aware
 *   button. A signed-in visitor sees "Sign In" here; reading the real state
 *   would mean shipping next-auth to a page with no user state on it.
 */
export default function StaticNav() {
   return (
      <PrimaryNav
         wordmark={
            <a href="/">
               <Wordmark />
            </a>
         }
         links={
            <ul className="flex flex-row gap-6 text-p1-m text-neutral-100">
               {NAV_LINKS.map((item) => (
                  <li
                     key={item.link}
                     className="hover:text-neutral-700 hover:underline underline-offset-[0.625rem] cursor-pointer"
                  >
                     <a href={item.link}>{item.name}</a>
                  </li>
               ))}
            </ul>
         }
         actions={
            <li className="flex-shrink-0">
               <a href={SIGN_IN_LINK} className="nav-signin">
                  Sign In
               </a>
            </li>
         }
         menu={<StaticNavMenu />}
      />
   );
}

/**
 * A `details` disclosure standing in for `AppNav`'s drawer. It is the only way
 * to get an openable menu with no JavaScript; the trade is that it closes from
 * its own toggle rather than by tapping outside.
 */
function StaticNavMenu() {
   return (
      <details className="nav-menu">
         <summary aria-label="Menu">
            <svg
               aria-hidden="true"
               fill="none"
               height="18"
               stroke="currentColor"
               strokeLinecap="round"
               strokeWidth="2"
               viewBox="0 0 24 24"
               width="18"
            >
               <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
         </summary>
         <ul>
            {NAV_LINKS.map((item) => (
               <li key={item.link}>
                  <a href={item.link}>{item.name}</a>
               </li>
            ))}
            <li>
               <a href={PROFILE_LINK}>Profile</a>
            </li>
            <li>
               <a href={SIGN_IN_LINK}>Sign In</a>
            </li>
         </ul>
      </details>
   );
}
