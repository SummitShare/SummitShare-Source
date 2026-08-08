import type { ReactNode } from 'react';

export type PrimaryNavProps = {
   /** The wordmark, linked home. */
   wordmark: ReactNode;
   /** The desktop link row. */
   links: ReactNode;
   /** The desktop right-hand cluster — wallet, sign in, profile. */
   actions?: ReactNode;
   /** The narrow-screen menu. */
   menu?: ReactNode;
};

/**
 * The header shell: geometry, ground and spacing, and nothing else.
 *
 * It takes its contents as slots rather than importing them, because a static
 * import of a client component puts that component in the route's client
 * reference manifest and the browser fetches it whether or not it was
 * rendered. Measured on `/record`: gating with `{auth && <NavAuthControls />}`
 * still pulled next-auth and wagmi, and so did wrapping them in `next/dynamic`
 * from a server component. Slots are the only form that actually keeps them
 * out, because the module graph of a route that never fills a slot never
 * contains it.
 *
 * Fill it with `AppNav` (session and wallet aware) or `StaticNav` (no client
 * JavaScript at all). Both render this, so every route looks the same.
 */
export default function PrimaryNav({
   wordmark,
   links,
   actions,
   menu,
}: PrimaryNavProps) {
   return (
      <nav className="w-full">
         {/* One height on every route, set explicitly rather than derived from
             padding. `record.css` mirrors these numbers in
             `--record-nav-height` and subtracts them from the viewport to size
             its gallery, so a bar whose height shifted with its contents would
             drift away from that and leave a gap underneath. Change one, change
             the other. */}
         <ul className="fixed top-0 inset-x-0 px-6 h-[58px] lg:h-[68px] lg:px-[15%] flex flex-row justify-between items-center border-b border-neutral-900-5 text-neutral-900 z-10 bg-white">
            <li>{wordmark}</li>
            <li className="sm:block hidden md:hidden lg:block">{links}</li>
            {actions && (
               <li className="sm:block hidden md:hidden lg:block flex-shrink-0">
                  <ul className="flex flex-row gap-2 items-center">{actions}</ul>
               </li>
            )}
            {menu && <li className="lg:hidden">{menu}</li>}
         </ul>
      </nav>
   );
}

/**
 * The wordmark. A span, not an h1 — every page carries its own h1, and a second
 * one in the header would compete with it.
 */
export function Wordmark() {
   return (
      <span className="nav-wordmark">
         <span className="text-orange-500">Summit</span>Share
      </span>
   );
}
