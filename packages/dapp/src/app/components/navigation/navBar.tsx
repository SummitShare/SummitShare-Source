"use client";
import { useState } from "react";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { usePathname } from "next/navigation";
import { LinkProps } from "next/link";
import {
  BookOpenIcon,
  InformationCircleIcon,
  TrashIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { KeyIcon } from "@heroicons/react/24/outline";
import { Banner } from "../banners/donation";

interface NavLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string | undefined;
}

export const NavBar = () => {
  return (
    <div className="w-full fixed top-0 inset-x-0 z-50">
      <nav className="w-full p-3 flex justify-between bg-gray-50 dark:bg-slate-800 border-b">
        <Link
          href={"/"}
          className="text-gray-950 font-black text-2xl dark:text-gray-50"
        >
          Summit<span className="text-orange-500">Share</span>
        </Link>
        <div className="sm:block hidden ">
          <ul className=" w-fit flex gap-6 items-center ">
            <NavLink href={"/about"}>About</NavLink>
            <NavLink href={"/blogs"}>Blogs</NavLink>
            <NavLink href={"/help"}>Help</NavLink>
            <NavLink href={"/github"}>
              <GitHubLogoIcon className="w-6" />
              Github
            </NavLink>
          </ul>
        </div>

        <Bars2 />
      </nav>
      <Banner />
    </div>
  );
};

const NavLink: React.FC<NavLinkProps> = ({ children, className, ...props }) => {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={`flex gap-2 items-center ${
        pathname === props.href
          ? "text-orange-500 font-medium"
          : "text-gray-950 dark:text-gray-50"
      } ${className} `}
    >
      {children}
    </Link>
  );
};

function Bars2() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open ? (
        <Bars2Icon
          onClick={() => setOpen(true)}
          className="text-gray-950 w-6 dark:text-gray-50 md:hidden lg:hidden"
        />
      ) : (
        <div className="fixed inset-0 space-y-6 bg-gray-50 dark:bg-slate-800 z-50 p-3">
          <div className="flex justify-between">
            <Link
              href={"/"}
              className="text-gray-950 font-black text-2xl dark:text-gray-50"
            >
              Summit<span className="text-orange-500">Share</span>
            </Link>
            <XMarkIcon
              onClick={() => setOpen(false)}
              className="text-gray-950 w-6 dark:text-gray-50"
            />
          </div>
          <ul className="h-[70%] flex flex-col gap-4">
            <NavLink href={"/about"} className="text-2xl">
              <UserGroupIcon className="w-6" />
              About us
            </NavLink>
            <NavLink href={"/blogs"} className="text-2xl">
              <BookOpenIcon className="w-6" />
              Blogs
            </NavLink>
            <NavLink href={"/help"} className="text-2xl">
              <InformationCircleIcon className="w-6" />
              Help
            </NavLink>
            <NavLink href={"/https://github.com/SummitShare"} className="text-2xl">
              <GitHubLogoIcon className="w-6" />
              Github
            </NavLink>
            <NavLink href={"/profile"} className="text-2xl">
              <UserCircleIcon className="w-6" />
              Profile
            </NavLink>
            <NavLink href={"/password"} className="text-2xl">
              <KeyIcon className="w-6" />
              Password
            </NavLink>
            <NavLink href={"/deleteAccount"} className="text-2xl">
              <TrashIcon className="w-6" />
              Delate Account
            </NavLink>
          </ul>
        </div>
      )}
    </>
  );
}
