"use client";
import React, { useState } from "react";
import {
  Bars2Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useToggle } from "../../../functonality/navBarController";
import logo from "/public/summitsharelogo.png";
import Image from "next/image";
import NotificationCard from "./NotificationCard";
import Link from "next/link";

function NavBar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <div>
      <div className="bg-white"></div>

      <div className=" fixed top-0 inset-x-0 w-full h-20 py-4 flex flex-row justify-between items-center backdrop-blur-md px-5 bg-white/80 z-50 ">
        <div className="flex flex-row justify-between items-center w-full lg:w-fit gap-6">
          <div className="text-xl font-bold flex flex-row gap-2 items-center text-amber-950 ">
            <div>
              {/* <Image className="w-14 h-14" src={logo} alt="Icon"></Image> */}
            </div>
            <Link href={"/"} className="title-h4-slate">
              Summit<span className="title-h4-orange">Share</span>
            </Link>

            <div className="relative w-fit sm:block hidden ">
              <input
                type={"text"}
                placeholder="Search Collections,Artifacts or Tickets"
                className="rounded-xl w-[400px] h-[40px] bg-stone-100 px-10 py-2 placeholder:text-xs flex flex-row items-center"
              ></input>
              <MagnifyingGlassIcon className="w-5 h-5 absolute top-[10px] left-3 text-stone-400 " />
            </div>
          </div>
        </div>
        {/* <div className="flex flex-row gap-6 items-center">
            <div className="rounded-full bg-slate-100 h-6 w-6 lg:w-8 lg:h-8"></div>
            <Bars2Icon
              className="w-6 h-6 lg:hidden md:hidden"
              onClick={toggleOpen}
            />
          </div> */}
        <div className="flex flex-row gap-6 items-center">
          <MagnifyingGlassIcon className="w-6 h-6 lg:hidden " />
          <div className="group transition-all">
            <BellIcon
              onClick={handleNotifications}
              className="w-6 h-6 text-stone-950 group-hover:text-amber-500"
            />
          </div>
        </div>
      </div>
      <div className="">{isNotificationsOpen ? <NotificationCard /> : ""}</div>
    </div>
  );
}

export default NavBar;
