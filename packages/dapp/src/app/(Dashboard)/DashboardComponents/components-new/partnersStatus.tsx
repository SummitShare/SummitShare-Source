import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

interface PartnersStatus {
  image: string;
  text: string;
  status: boolean;
}

const data: PartnersStatus = {
  image:
    "https://images.unsplash.com/photo-1701519664290-dac9ba60fce6?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  text: "Kate Morrison",
  status: true,
};

function PartnersStatus({ image, text, status }: PartnersStatus) {
  return (
    <div className="w-full rounded-[4px] h-fit p-2 bg-slate-50 flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2 items-center">
        <Image
          src={image} // Replace with your image path
          alt="profile"
          width={32} // Set the width to 32px
          height={32} // Set the height to 32px
          className="rounded-full bg-slate-500 w-8 h-8" // Tailwind CSS for rounded corners
        />
        <p
          className="Body-text-mobile-big text-blue-950 
"
        >
          {text}
        </p>
      </div>
      <div
        className={`w-fit rounded-full h-fit px-3 py-1 ${
          status ? "bg-green-500" : "bg-red-500"
        } Body-text-mobile text-white flex flex-row gap-2 items-center`}
      >
        <p>{status ? "Accepted" : "Declined"}</p>
        <ExclamationCircleIcon className="w-4 h-4" />
      </div>
    </div>
  );
}

export default PartnersStatus;
