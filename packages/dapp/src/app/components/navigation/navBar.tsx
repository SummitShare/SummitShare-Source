"use client";
import { useState } from "react";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { DashboardIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { usePathname, useRouter } from "next/navigation";
import { LinkProps } from "next/link";
import {
  BookOpenIcon,
  InformationCircleIcon,
  PowerIcon,
  TrashIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { KeyIcon } from "@heroicons/react/24/outline";
import { Banner } from "../banners/donation";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import WalletConnectNav from "@/functonality/walletconnect";
import { signOut, useSession } from "next-auth/react";

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
          <ThirdwebProvider>
            <WalletConnectNav />
          </ThirdwebProvider>
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
      className={`flex gap-2 items-center ${pathname === props.href
          ? "text-orange-500 font-medium"
          : "text-gray-950 dark:text-gray-50"
        } ${className} `}
    >
      {children}
    </Link>
  );
};

function Bars2() {
  const session = useSession();
  const router = useRouter()
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
            <NavLink href={"/blog"} className="text-2xl">
              <BookOpenIcon className="w-6" />
              Blogs
            </NavLink>
            <NavLink href={"/Help"} className="text-2xl">
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
            <NavLink href={"/destrbution"} className="text-2xl">
              <DashboardIcon className="w-6" />
              Dashboard
            </NavLink>
            <NavLink href={"/deleteAccount"} className="text-2xl">
              <TrashIcon className="w-6" />
              Delate Account
            </NavLink>
            <p>{JSON.stringify(session)}</p>
            {session.status === "authenticated" ?
              <li onClick={() => {
                signOut();
              }} className="text-2xl text-gray-950 w-full flex flex-row gap-2 items-center">
                <PowerIcon className="w-6 text-gray-950" />
                <Link href="#"> logout</Link>
              </li> : <li onClick={() => {
                router.push("/auth-sign-in");
              }} className="text-2xl text-gray-950 w-full flex flex-row gap-2 items-center">
                <PowerIcon className="w-6 text-gray-950" />
                <Link href="#"> signIn</Link>
              </li>}
          </ul>
          <ThirdwebProvider>
            <WalletConnectNav />
          </ThirdwebProvider>
        </div>
      )}
    </>
  );
}
