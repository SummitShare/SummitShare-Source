"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";
import AddAdminForm from "./AddAdminEmail"

const profile = "https://images.unsplash.com/photo-1701532546697-638c74b97022?q=80&w=2050&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

function DashboardAdminInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (<section className="flex flex-row items-center gap-2  w-fit">
 
<div className="flex justify-center items-center">
   
      <Image 
        src={profile} // Replace with your image path
        alt="profile"
        width={32}  // Set the width to 32px
        height={32} // Set the height to 32px
        className="rounded-full bg-slate-500 w-8 h-8" // Tailwind CSS for rounded corners
      />
    
    </div>
  <div className="flex flex-col">
        <p className="H3-Base-mobile text-blue-950">Hi,</p>
 <p className="body-text-mobile text-slate-500">Let's manage your events!</p>

      </div>

      <div className=" flex items-center justify-center rounded-full border-4 border-orange-500 w-8 h-8">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16" className="text-orange-500 font-bold">
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
</svg>
      </div>

 
  </section>












    // <section className="flex flex-row justify-between w-full">
    //   {/* Left side content (for both mobile and desktop) */}
    //   <div className="flex flex-row gap-4 items-center">
    //     {/* User profile picture (visible only in mobile view) */}
    //     <div className="lg:hidden w-8 h-8 rounded-full bg-slate-500 ">
    //       <Image src={""} alt="" className="bg-slate-500 rounded-full" />{" "}
    //       {/* Display user profile image */}
    //     </div>
    //     <div>
    //       <p className="H1-Base-desktop text-blue-950">Hi,</p>
    //       {/* Greeting */}
    //       <div className="text-slate-500 lg:text-base">
    //         Let's manage your events!
    //       </div>
    //     </div>
    //   </div>

    //   {/* Right side content (for desktop view) */}
    //   <div className="hidden sm:block lg:flex lg:flex-row lg:gap-4 lg:items-center">
    //     {/* User profile picture (visible only in desktop view) */}
    //     <div className="hidden sm:block bg-gray-100 rounded-full w-6 h-6">
    //       <Image
    //         src={""}
    //         alt=""
    //         className="w-full h-full rounded-full font-bold stroke-2 bg-slate-500 "
    //       />
    //       {/* Display user profile image */}
    //     </div>
    //     {/* Plus icon (visible only in desktop view) */}

    //     <div className="relative">
    //       <div
    //         onClick={handleOpen}
    //         className="hidden sm:block   border-4 border-slate-950 rounded-full w-6 h-6"
    //       >
    //         {isOpen ? (
    //           <XMarkIcon className="w-4 h-4 text-slate-950 font-bold stroke-2" />
    //         ) : (
    //           <PlusIcon
    //             stroke-width="10px"
    //             className="w-4 h-4 text-slate-950 font-bold stroke-2"
    //           />
    //         )}

    //         {/* Display the Plus icon */}
    //       </div>
    //       {/* <div className="w-full flex justify-center">
    //         {isOpen ? <AddAdminForm /> : <div></div>}
    //       </div> */}
    //     </div>
    //   </div>
    // </section>
  );
}

export default DashboardAdminInfo;
