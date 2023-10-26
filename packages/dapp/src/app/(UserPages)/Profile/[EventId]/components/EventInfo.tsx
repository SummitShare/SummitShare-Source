import { MapIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { ClockIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";

function EventInfo() {
  return (
    <div className="space-y-5">
      <div className="space-y-5 w-full lg:flex lg:flex-row lg:items-center lg:justify-center ">
        <div className="space-y-5">
          <p className="text-xl font-semibold">
            Expressing the word with color{" "}
          </p>
          <p className="text-sm text-slate-500">
            Lorem ipsum dolor sit amet consectetur. Porttitor bibendum et cras
            interdum faucibus.
          </p>
          <div className=" text-xs space-y-2 text-slate-700">
            <div className="flex flex-row gap-2 items-center">
              <MapPinIcon className="w-[14px] h-[14px]" /> Lusaka,Zambia
            </div>
            <div className="flex flex-row gap-2 items-center">
              <MapIcon className="w-[14px] h-[14px]" /> 13.11.2023
            </div>
            <div className="flex flex-row gap-2 items-center">
              <ClockIcon className="w-[14px] h-[14px]" /> 13:00PM
            </div>
          </div>
          <div className="space-x-[-5px] flex flex-row">
            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-50"></div>
            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-50"></div>
            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-50"></div>
          </div>

          <button className="bg-slate-950 text-slate-50 font-medium rounded-xl w-[100px] h-fit px-4 py-2 ">
            Punches
          </button>
        </div>
        <div className="flex flex-row gap-2 w-full">
          <div className="w-[300px] h-[300px] bg-slate-100 rounded-xl">
            <Image src={""} alt=""></Image>
          </div>
          <div className="w-[300px] h-[300px] bg-slate-100 rounded-xl">
            <Image src={""} alt=""></Image>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventInfo;
