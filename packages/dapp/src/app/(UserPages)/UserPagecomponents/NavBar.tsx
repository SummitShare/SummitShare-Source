"use client";
import React, { useState } from "react";
import {
  Bars2Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import NotificationCard from "./NotificationCard";
import Link from "next/link";
import Button from "@/components/reusebaeComponents/button";
import { useRouter } from "next/navigation";
import { SearchResults, useSearch } from "@/lib/useSearch";
export const dynamic = "force-dynamic";





function NavBar() {
  const router = useRouter();

  const handleClickSignUp = () => {
    router.push("/auth/signUp");
  };
  const handleClickSignIn = () => {
    router.push("/auth/signIn");
  };
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const { data, handleSearchChange, setSearchTerm, searchResultsRef } = useSearch();

  return (
    <div>
      <div className="py-4 px-8 flex flex-row justify-between items-center fixed top-0 inset-x-0 w-full backdrop-blur-md bg-white/80 border-b z-50 ">
        <div className="flex items-center w-full lg:w-fit">
          <div className="flex flex-row gap-4 items-center text-lg">
            <Link href={"/"} className="font-bold tracking-tighter text-base">
              Summit<span className=" text-orange-500  ">Share</span>
            </Link>
            <div className="relative w-fit sm:block hidden group">
              <input
                type="text"
                id="search"
                placeholder="Search Exhibits"
                onChange={handleSearchChange}
                onBlur={() => setSearchTerm('')}
                className="px-4 rounded-xl w-[400px] h-[40px] bg-slate-100 text-sm border border-slate-100 focus:border-slate-200 focus:outline-none"
              />
              <div
                className="bg-slate-200 p-[6px] text-slate-500 flex items-center justify-center w-6 h-6 rounded-md text-xs p-1 absolute right-3 top-2 cursor-pointer hover:bg-slate-300"
                onClick={handleSearchChange}
              >
                <MagnifyingGlassIcon />
              </div>
              {data && <SearchResults data={data} searchResultsRef={searchResultsRef} />}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center text-lg">

        </div>
        <div className="px-8 flex flex-row gap-8 items-center text-sm w-full justify-end">
          <div className="font-medium flex flex-row gap-4 ">
            <Link className="text-slate-950 transition-all cursor-pointer md:block  sm:hidden" href="#">
              Partners
            </Link>
            <Link className="text-slate-950 transition-all cursor-pointer  md:block sm:hidden" href="#">
              Help
            </Link>
            <Link className="text-slate-950 transition-all cursor-pointer hidden lg:block md:hidden" href="#">
              Blog
            </Link>
            <Link className="text-slate-950 transition-all cursor-pointer hidden lg:block md:hidden" href="#">
              GitHub
            </Link>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              click={handleClickSignUp}
              text="Sign Up"
              type="button"
              backGroundColor="bg-orange-500"
              textColor="text-white"
              hover="hover:shadow-lg transition-all"
            />
            <Button
              click={handleClickSignIn}
              text="Sign In"
              type="button"
              backGroundColor="bg-slate-100"
              borderColor="amber-950"
              textColor="text-slate-950"
              hover="transition-all hover:shadow-lg"
            />
          </div>
        </div>
      </div>
      <div className="">{isNotificationsOpen ? <NotificationCard /> : ""}</div>
    </div>
  );
}

export default NavBar;
