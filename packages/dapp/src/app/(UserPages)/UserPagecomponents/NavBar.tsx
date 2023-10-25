"use client";
import React from "react";
import {
  Bars2Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useToggle } from "../../../functonality/navBarController";

function NavBar() {
  const [isOpen, toggleOpen] = useToggle();
  return (
    <div>
      {isOpen ? (
        <div className="bg-slate-50">
          <nav className="fixed top-0 bottom-0 right-0 left-0 bg-slate-50 flex flex-col justify-between pt-20 px-5 z-10 pb-10">
            <div className="absolute top-7 right-5 ">
              <XMarkIcon className="w-6 h-6 " onClick={toggleOpen} />
            </div>
            <div className="space-y-3 text slate-500 text-lg font-semibold">
              <p className="hover:text-slate-950">Notifications</p>
              <p className="hover:text-slate-950">GitHub</p>
            </div>
            {/* <div className="w-full flex justify-center">
              <Wallet />
            </div> */}
          </nav>
        </div>
      ) : (
        <div className=" fixed top-0 inset-x-0 w-full h-20 py-4 flex flex-row justify-between items-center backdrop-blur-md px-5 ">
          <div className="flex flex-row gap-6 items-center">
            <p className="text-xl font-bold">Icon</p>
            <MagnifyingGlassIcon className="w-6 h-6 lg:hidden " />
            <div className="relative w-fit sm:block hidden ">
              <input
                type={"text"}
                placeholder="Search Collections,Artifacts or Tickets"
                className="rounded-xl w-[400px] h-[40px] bg-slate-100 px-10 py-2 placeholder:text-xs flex flex-row items-center"
              ></input>
              <MagnifyingGlassIcon className="w-5 h-5 absolute top-[10px] left-3 text-gray-400 " />
            </div>
            <div className="sm:block hidden">
              <div className="flex flex-row gap-5 text-slate-400 text-sm">
                <p>Notifications</p>
                <p>GitHub</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-6 items-center">
            {/* <div className="sm:block hidden">
              <Wallet />
            </div> */}

            <div className="rounded-full bg-slate-100 h-6 w-6 lg:w-8 lg:h-8"></div>
            <Bars2Icon
              className="w-6 h-6 lg:hidden md:hidden"
              onClick={toggleOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
