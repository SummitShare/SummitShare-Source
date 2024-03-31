/**
 * MenuButton Component
 *
 * This component is designed to toggle a mobile-friendly, full-screen menu overlay in a React application.
 * It starts with a clickable text that, when clicked, toggles the visibility of the menu. The menu itself
 * features a close button and utilizes the `HelpLink` component to render navigational links. This setup
 * provides an intuitive and seamless navigation experience on smaller screens.
 *
 * Features:
 * - Toggles a full-screen menu overlay on click, providing a clear and accessible way to navigate the app on mobile devices.
 * - Uses the `HelpLink` component for consistent link rendering within the menu.
 * - Incorporates Heroicons for visually intuitive interaction cues.
 *
 * The initial state of the menu is set to open (`true`), and clicking the menu button or the close icon toggles this state,
 * showing or hiding the menu accordingly. The implementation ensures that the menu and its contents are only rendered when
 * the menu is in its open state, optimizing performance and user experience.
 */

"use client";
import React, { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import HelpLink from "./helpLinks"; // Ensure correct import path

function MenuButton() {
  const [open, setOpen] = useState<boolean>(false); // Initially, menu is closed
  const handleClick = () => setOpen(!open); // Toggle menu open state

  return (
    <div>
      <p
        onClick={handleClick}
        className="flex flex-row gap-2 text-xl text-orange-500 font-medium lg:hidden"
      >
        Learn more <ArrowRightIcon className="w-5 text-orange-500" />
      </p>

      {!open ? (
        ""
      ) : (
        <div className="z-10 fixed flex items-center justify-center inset-0 w-full backdrop-blur-md bg-white">
          <XMarkIcon
            className="w-8 absolute top-5 right-5"
            onClick={handleClick}
          />

          <div className="space-y-4">
            <ul className="flex flex-col gap-6 text-sm text-slate-500 justify-center items-center">
              <HelpLink
                link="/help/connect-wallet"
                name="Connect your Wallet"
              />
              {/* Additional HelpLink components can be added here */}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuButton;
