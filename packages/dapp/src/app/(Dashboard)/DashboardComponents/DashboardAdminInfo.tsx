"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";
import AddAdminForm from "./AddAdminEmail";

function DashboardAdminInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <section className="lg:flex lg:flex-row lg:justify-between lg:items-center">
      {/* Left side content (for both mobile and desktop) */}
      <div className="flex flex-row gap-4 items-center">
        {/* User profile picture (visible only in mobile view) */}
        <div className="lg:hidden w-8 h-8 rounded-full bg-slate-500 ">
          <Image src={""} alt="" className="bg-slate-500 rounded-full" />{" "}
          {/* Display user profile image */}
        </div>
        <div>
          <p className="lg:text-2xl lg:font-semibold">Hi,</p>
          {/* Greeting */}
          <div className="text-gray-500 lg:text-base">
            Let's manage your events!
          </div>
        </div>
      </div>

      {/* Right side content (for desktop view) */}
      <div className="hidden sm:block lg:flex lg:flex-row lg:gap-4 lg:items-center">
        {/* User profile picture (visible only in desktop view) */}
        <div className="hidden sm:block bg-gray-100 rounded-full w-6 h-6">
          <Image
            src={""}
            alt=""
            className="w-full h-full rounded-full font-bold stroke-2 bg-slate-500 "
          />
          {/* Display user profile image */}
        </div>
        {/* Plus icon (visible only in desktop view) */}

        <div className="relative">
          <div
            onClick={handleOpen}
            className="hidden sm:block   border-4 border-slate-950 rounded-full w-6 h-6"
          >
            {isOpen ? (
              <XMarkIcon className="w-4 h-4 text-slate-950 font-bold stroke-2" />
            ) : (
              <PlusIcon
                stroke-width="10px"
                className="w-4 h-4 text-slate-950 font-bold stroke-2"
              />
            )}

            {/* Display the Plus icon */}
          </div>
          <div className="w-full flex justify-center">
            {isOpen ? <AddAdminForm /> : <div></div>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardAdminInfo;
