/**
 * HelpNav Component
 *
 * This component creates a fixed navigation panel intended for the 'Help' section of a web application.
 * It's designed to be visible on screens wider than the 'sm' breakpoint and hidden on smaller screens, making it
 * an ideal component for side navigation on desktop layouts. The navigation panel features a list of help topics,
 * each represented as a clickable link that navigates to the corresponding help page.
 *
 * Features:
 * - Fixed positioning to maintain visibility as the user scrolls through the main content.
 * - Responsive visibility, ensuring the navigation only appears on screens suited for side navigation.
 * - A structured list of help topics for easy navigation through various help sections.
 *
 * The HelpNav component leverages Next.js's `Link` component for client-side routing, ensuring a smooth navigation
 * experience without full page reloads. This component enhances the usability of help documentation by providing quick
 * access to key topics from anywhere within the 'Help' section.
 */

import Link from "next/link";
import React from "react";

function HelpNav() {
  return (
    <div
      className="space-y-4 fixed bottom-0 top-[75px] left-0 w-[30%] sm:block hidden p-6 z-[5] 
    "
    >
      <h2 className="text-orange-500 w-full border-b border-gray-100 py-6">
        How can we help?
      </h2>
      <ul className="flex flex-col justify-between h-[60%]">
        <li className="text-xl text-gray-700 w-full flex flex-row gap-2 items-center">
          <Link href="/help/connect-wallet">
            <p className="hover:text-orange-500 transition-colors duration-200 ease-in-out">
              Connect your wallet
            </p>
          </Link>
        </li>
        {/* Additional list items can be added here for other help topics */}
      </ul>
    </div>
  );
}

export default HelpNav;
