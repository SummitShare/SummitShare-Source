"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";

const profile =
  "https://images.unsplash.com/photo-1701519664290-dac9ba60fce6?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

function DashboardAdminInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <section className="flex flex-row items-center  lg:justify-between lg:w-full">
      <div className="flex flex-row gap-2 items-center">
        <div className="flex justify-center items-center lg:hidden">
          <Image
            src={profile} // Replace with your image path
            alt="profile"
            width={32} // Set the width to 32px
            height={32} // Set the height to 32px
            className="rounded-full bg-slate-500 w-8 h-8" // Tailwind CSS for rounded corners
          />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium text-blue-950">Hi, Mario Jere</p>
          <p className="text-xs lg:text-sm text-slate-500">
            Let's manage your events!
          </p>
        </div>
      </div>

      <div className=" invisible  lg:visible">
        <div className="flex flex-row gap-3 items-center justify-end">
          <Image
            src={profile} // Replace with your image path
            alt="profile"
            width={32} // Set the width to 32px
            height={32} // Set the height to 32px
            className="rounded-full w-8 h-8" // Tailwind CSS for rounded corners
          />
          {/* <div className=" flex items-center justify-center rounded-full border-[6px] border-orange-500 w-8 h-8">
            <PlusIcon className="w-4 h-4 text-orange-500 " />
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default DashboardAdminInfo;
