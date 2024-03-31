/**
 * HelpLink Component
 *
 * This component is designed to render a navigational link within a list item (<li>). It utilizes Next.js's `Link` component
 * for routing and `usePathname` hook to determine the current path for styling purposes. The `HelpLink` component is ideal for
 * use in navigational menus, help sections, or any part of a website where a list of links is presented.
 *
 * Features:
 * - Utilizes Next.js's `Link` component for optimized client-side navigation.
 * - Dynamically applies styling based on the current pathname to visually indicate the active link.
 * - Accepts `link` and `name` props to configure the URL path and display text for the link.
 * - Simple and reusable for various parts of an application requiring link lists.
 *
 * Props:
 * - `link` (string): The URL path that the link should navigate to.
 * - `name` (string): The display text for the link.
 *
 * The component's implementation focuses on simplicity and reusability, ensuring that it can be easily integrated into
 * any list of links with minimal setup. The dynamic styling based on the current path enhances user navigation by clearly
 * indicating the active page or section.
 */

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function HelpLink({ link, name }: { link: string; name: string }) {
  const path = usePathname(); // Current path is obtained using the usePathname hook

  return (
    <li>
      <Link
        href={link}
        className={`text-2xl hover:text-orange-500 py-6 ${
          path === link ? "text-orange-500" : "text-gray-700"
        }`}
      >
        {name}
      </Link>
    </li>
  );
}

export default HelpLink;
