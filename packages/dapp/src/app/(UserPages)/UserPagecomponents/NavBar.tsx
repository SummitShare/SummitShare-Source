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
import WalletConnectNav from "@/functonality/walletconnect";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import ProfileIconDropDown from "./profileIconDropDown";

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
      <div className="py-4 px-8 flex flex-row justify-between items-center fixed top-0 inset-x-0 w-full backdrop-blur-md bg-white/80 border-b z-50 grow shrink">
        <div className="flex items-center w-full lg:w-fit">
          <div className="flex flex-row gap-4 items-center text-lg">
            <Link href={"/"} className="text-[20px] font-bold roboto">
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
        <div className="px-8 flex flex-row gap-8 items-center w-full justify-end">
          <div className=" text-base flex flex-row gap-4 ">
            <Link className="transition-all cursor-pointer md:block sm:hidden font-open-sans text-base" href="#">
              Partners
            </Link>
            <Link className="transition-all cursor-pointer md:block sm:hidden font-open-sans text-base" href="#">
              Help
            </Link>
            <Link className="transition-all cursor-pointer hidden lg:block md:hidden font-open-sans text-base" href="#">
              Blog
            </Link>
            <div className="flex flex-flex-row items-center w-fit h-fit gap-2">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>
 <Link className="transition-all cursor-pointer hidden lg:block md:hidden font-open-sans text-base" href="#">
              GitHub
            </Link>
            </div>

           
          </div>
         
           
          <div className="flex flex-row gap-4">
            {/* <Button
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
            /> */}



     <ThirdwebProvider
    
    >
      <WalletConnectNav />
      {/* Other components of your app */}
    </ThirdwebProvider>


          </div>
            <ProfileIconDropDown/>
        </div>
      </div>
      <div className="">{isNotificationsOpen ? <NotificationCard /> : ""}</div>
    </div>
  );
}

export default NavBar;
