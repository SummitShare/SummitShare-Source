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
import Button from "@/components/reusebaeComponents/button";
import { useRouter } from "next/navigation";

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

  return (
    <div>
      <div className="bg-white"></div>

      <div className=" fixed top-0 inset-x-0 w-full h-20 py-4 flex flex-row justify-between items-center backdrop-blur-md  px-5 bg-white/80 border-b z-50 ">
        <div className="flex flex-row justify-between items-center w-full lg:w-fit gap-6">
          <div className=" flex flex-row gap-6 items-center ">
            <div>
              {/* <Image className="w-14 h-14" src={logo} alt="Icon"></Image> */}
            </div>
            <Link href={"/"} className="title-h3-slate">
              Summit<span className="title-h3-orange">Share</span>
            </Link>

            <div className="relative w-fit sm:block hidden group title-h6-slate">
              <input
                type={"text"}
                placeholder="Search Collections,Artifacts or Tickets"
                className="rounded-xl w-[400px] h-[40px] bg-slate-100 px-3 py-2 text-sm border border-slate-100 focus:border-slate-200 focus:outline-none "
              ></input>
              <div className="bg-slate-200 text-slate-500 flex items-center justify-center w-6 h-6 rounded-md text-xs p-1 absolute right-3 top-2 ">
                /
              </div>
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
          {/* <div className="group transition-all">
            <BellIcon
              onClick={handleNotifications}
              className="w-6 h-6 text-stone-950 hover:text-amber-500"
            />
          </div> */}
        </div>
        <div className="flex flex-row gap-6 items-center title-h6-slate">
          <div className="text-base text-orange-500 font-medium flex flex-row gap-6">
            <Link
              className="  text-slate-950 transition-all cursor-pointer"
              href={""}
            >
              Partners
            </Link>
            <Link
              className="  text-slate-950 transition-all cursor-pointer"
              href={""}
            >
              Help
            </Link>
            <Link
              className="  text-slate-950 transition-all cursor-pointer"
              href={""}
            >
              Blog
            </Link>
            <Link
              className="  text-slate-950 transition-all cursor-pointer"
              href={""}
            >
              Git Hub
            </Link>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              click={handleClickSignUp}
              text="Sign Up"
              type="button"
              backGroundColor="bg-orange-500"
              textColor="text-white"
              hover=" hover:shadow-lg transition-all "
            />
            <Button
              click={handleClickSignIn}
              text="Sign In"
              type="button"
              backGroundColor="bg-slate-100"
              borderColor="amber-950"
              textColor="text-slate-950"
              hover=" transition-all  hover:shadow-lg"
            />
          </div>
        </div>
      </div>
      <div className="">{isNotificationsOpen ? <NotificationCard /> : ""}</div>
    </div>
  );
}

export default NavBar;
