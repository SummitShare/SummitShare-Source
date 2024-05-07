/**
 * Navbar Component
 *
 * This component is a comprehensive Navbar designed for a web application, featuring responsive design,
 * a search functionality, notifications, and a shopping cart. The Navbar adapts to different screen sizes,
 * providing an optimal user experience across devices. It utilizes icons for a visually appealing and
 * intuitive interface.
 *
 * Features:
 * - Responsive design with mobile menu toggle.
 * - Integrated search functionality with real-time results display.
 * - Links to key sections of the website, including partner links, blog, help, and GitHub.
 * - User-related actions such as notifications, profile, password management, and session information.
 * - Wallet connection functionality for Web3 applications.
 * - Visual cues for notifications and shopping cart items.
 *
 * The Navbar enhances user navigation and interaction, making it a central element of the user interface.
 * It is designed to be flexible and easily adaptable to various web application needs.
 *
 * Implementation Notes:
 * - The `useSearch` hook provides search functionality, displaying results as the user types.
 * - `WalletConnectNav` is assumed to be a custom component for handling wallet connections in Web3 applications.
 * - Third-party icons from @heroicons/react and @radix-ui/react-icons enhance the visual representation of actions and links.
 * - The Navbar contains placeholders for links; ensure to replace these with actual paths.
 */

"use client";

// Importing necessary icons from @heroicons/react and React hooks
import {
  Bars2Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserGroupIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  KeyIcon,
  GlobeAltIcon,
  UserCircleIcon,
  BellIcon,
  ShoppingCartIcon,
  QrCodeIcon,
  PowerIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";

// Import Link from Next.js for client-side navigation, and ButtonOrange component for UI consistency
import Link from "next/link";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { SearchResults, useSearch } from "@/lib/useSearch";
import WalletConnectNav from "@/functonality/walletconnect";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { notificationProps } from "@/utils/dev/frontEndInterfaces";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Create an array of objects conforming to the Props interface
const notifications: notificationProps[] = [
  {
    title: "Event Invitation",
    message:
      "You have been added to the 'Annual Developer Conference'. Please approve your participation.",
    dateTime: "2024-03-26 10:00 AM",
  },
  {
    title: "Event Reminder",
    message:
      "Reminder: You are attending the 'Web3 Innovators Meetup' tomorrow. Click to see more details.",
    dateTime: "2024-03-27 08:00 AM",
  },
  {
    title: "Art Exhibition Opening",
    message:
      "Explore the latest in contemporary art at the 'Visionaries 2024' exhibition opening this Friday.",
    dateTime: "2024-03-28 06:00 PM",
  },
  {
    title: "Art Workshop Enrollment",
    message:
      "Unlock your creativity: Enroll in our 'Digital Art Mastery' workshop now. Limited spots available!",
    dateTime: "2024-03-29 01:00 PM",
  },
  {
    title: "Event Confirmation",
    message:
      "Your attendance for the 'Global Tech Symposium' has been confirmed. See you there!",
    dateTime: "2024-03-30 09:00 AM",
  },
];

const tickets = [
  {
    title: "Lusaka Art Gallery",
    details: "Expressing the word with color",
    dateTime: "2024-03-26 10:00 AM",
  },
  {
    title: "Women’s History Museum",
    details: "Those who walked before us and those to come.",
    dateTime: "2024-03-27 08:00 AM",
  },
  {
    title: "Alliance Francaise Lusaka",
    details: "Those who walked before us and those to come.",
    dateTime: "2024-03-28 06:00 PM",
  },
];

// Navbar component definition
const Navbar = () => {
const router = useRouter()
  const session =  useSession();
  // State to control the visibility of the mobile menu
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<boolean>(false);
  const [notes, setNotes] = useState<boolean>(false);
  const [cart, setCart] = useState<boolean>(false);
  // Function to toggle the mobile menu visibility
  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = () => {
    setSearch(!search);
  };
  const handleNote = () => {
    setNotes(!notes);
  };
  const handleCart = () => {
    setCart(!cart);
  };
  const { data, handleSearchChange, setSearchTerm, searchResultsRef } =
    useSearch();
  // Component return statement containing JSX for the navbar
  return (
    <nav>
      {/* Navbar container with fixed positioning and responsive height */}
      <div className="fixed z-10 inset-x-0 top-0 flex flex-row justify-between items-center px-6 md:h-fit md:py-2 h-[80px] bg-gray-50/65  backdrop-blur-lg  ">
        {/* Website logo and name */}
        <Link
          href={"/"}
          className="text-2xl font-bold text-gray-950 cursor-pointer"
        >
          Summit<span className="text-orange-500">Share</span>
        </Link>

        {/* Search input field, visible only on screens larger than 'sm' */}

    

        {/* Horizontal list of navigation links, hidden on smaller screens */}
        <div className="hidden sm:block lg:flex w-full mx-6 justify-end">
          <ul className="flex-row gap-6 flex ">
            {/* Navigation items with hover effect to change text color */}
            {/* Replace '#' with actual paths */}

            <li className=" text-gray-700 w-full flex flex-row gap-2 hover:text-orange-500">
              <Link href="#"> Partners</Link>
            </li>
            <li className=" text-gray-700 w-full flex flex-row gap-2 hover:text-orange-500">
              <Link href="#"> Blog</Link>
            </li>
            <li className=" text-gray-700 w-full flex flex-row gap-2 hover:text-orange-500">
              <Link href="/help/connect-wallet"> Help</Link>
            </li>
            <li className=" text-gray-700 w-full flex flex-row gap-2 hover:text-orange-500 items-center">
              <GitHubLogoIcon className="w-6" />
              <Link href="https://github.com/SummitShare/SummitShare">
                Github
              </Link>
            </li>
          </ul>
        </div>

        {/* User icon and connect button, hidden on smaller screens */}
        <div className="hidden sm:block">
          <div className="flex gap-6">
        
            <ThirdwebProvider>
              <WalletConnectNav />
            </ThirdwebProvider>
            <UserCircleIcon className=" w-6 cursor-pointer hover:text-orange-500" />

            {cart ? (
              <div className="fixed top-[85px] right-0 ring-1 ring-gray-300 rounded-l h-[276px] bg-white w-[30%] overflow-y-scroll hidden sm:block">
                {tickets.map((cart, index) => (
                  <div className="flex flex-row w-full items-center justify-between border-b border-gray-100 px-6 py-3 hover:bg-gray-100/50 cursor-pointer ">
                    <div className=" space-y-2 ">
                      <h3 className="text-sm font-medium text-gray-950">
                        {cart.title}
                      </h3>
                      <p className="text-xs text-gray-700">{cart.details}</p>
                      <p className="text-[10px] text-gray-700">
                        {cart.dateTime}
                      </p>
                    </div>
                    <QrCodeIcon className="w-6" />
                  </div>
                ))}
              </div>
            ) : null}
            <ShoppingCartIcon
              onClick={handleCart}
              className="w-6 cursor-pointer hover:text-orange-500"
            />
            
          </div>
        </div>

        {/* Mobile menu icons (search and menu toggle), visible only on small screens */}
        <div className="flex flex-row items-center justify-end gap-6 md:hidden lg:hidden">
         

          <Bars2Icon
            className="w-8 text-gray-950 cursor-pointer"
            onClick={handleMenu}
          />
        </div>
      </div>
      {/* Mobile menu, displayed when 'isOpen' is true */}
      {isOpen ? (
        <div className=" z-10 fixed inset-0 flex flex-col justify-between  bg-white py-6 px-6 overflow-auto ">
          <div className="w-full flex justify-between">
            <Link href={"/"} className="text-2xl font-bold text-gray-950">
              Summit<span className="text-orange-500">Share</span>
            </Link>
            {/* Close icon for the mobile menu */}
            <XMarkIcon className="w-8 cursor-pointer" onClick={handleMenu} />
          </div>
          {/* Mobile navigation items, similar to the desktop version */}
          {/* Ensure to replace '#' with actual navigation paths */}
          <ul className="h-[70%] flex flex-col justify-between">
            {/* <li className="text-2xl text-gray-700 w-full flex flex-row gap-2 py-6">
              <GlobeEuropeAfricaIcon className="w-8 text-gray-950" />
              <Link href="#"> exhibits</Link>
            </li> */}

            <li className="text-xl text-gray-700 w-full flex flex-row gap-2 items-center">
              <ShoppingCartIcon className="w-6  text-gray-950" />
              <Link href="/tickets"> tickets</Link>
            </li>
       
            <li className="text-xl text-gray-700 w-full flex flex-row gap-2 items-center">
              <UserGroupIcon className="w-6 text-gray-950" />
              <Link href="#"> partners</Link>
            </li>
            <li className="text-xl text-gray-700 w-full flex flex-row gap-2  items-center">
              <BookOpenIcon className="w-6 text-gray-950" />
              <Link href="#"> Blog</Link>
            </li>
            <li className="text-xl text-gray-700 w-full flex flex-row gap-2 items-center">
              <QuestionMarkCircleIcon className="w-7 text-gray-950" />
              <Link href="help/connect-wallet"> help</Link>
            </li>
            <li className="text-xl text-gray-700 w-full flex flex-row gap-2  items-center">
              <GitHubLogoIcon className="w-6 text-gray-950" />
              <Link href="https://github.com/SummitShare/SummitShare">
                gitHub
              </Link>
            </li>
            <li className="text-xl text-gray-700 w-full flex flex-row gap-2  items-center">
              <PlusCircleIcon className="w-6 text-gray-950" />
              <Link href="/request">
                create request
              </Link>
            </li>
            <li className="text-xl text-gray-700 w-full flex flex-row gap-2 items-center">
              <UserIcon className="w-6 text-gray-950" />
              <Link href="#"> profile</Link>
            </li>
            <li className="text-xl text-gray-700 w-full flex flex-row gap-2 items-center">
              <KeyIcon className="w-6 text-gray-950" />
              <Link href="#"> password</Link>
            </li>
            <li className="text-xl text-gray-700 w-full flex flex-row gap-2 items-center">
              <GlobeAltIcon className="w-6 text-gray-950" />
              <Link href="#"> sessions</Link>
            </li>
            <p>{JSON.stringify(session)}</p>
            {session.status === "authenticated"? 
            <li onClick={()=>{
              signOut();
          }} className="text-xl text-gray-700 w-full flex flex-row gap-2 items-center">
              <PowerIcon className="w-6 text-gray-950" />
              <Link href="#"> logout</Link>
            </li>: <li onClick={()=>{
              router.push("/auth-sign-up");
          }} className="text-xl text-gray-700 w-full flex flex-row gap-2 items-center">
              <PowerIcon className="w-6 text-gray-950" />
              <Link href="#"> signIn</Link>
            </li>}
          </ul>
          <ThirdwebProvider>
            <WalletConnectNav />
          </ThirdwebProvider>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
