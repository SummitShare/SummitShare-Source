import Button from "@/components/reusebaeComponents/button";
import {
  CloudArrowUpIcon,
  CurrencyDollarIcon,
  MapIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { ClockIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";

function EventInfo() {
  return (
    <div className="space-y-5">
      <div className="space-y-5 w-full lg:flex lg:flex-row lg:items-center lg:justify-center ">
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="title-h5-slate">Expressing the word with color </p>
            <p className="body-text-h4 ">
              Lorem ipsum dolor sit amet consectetur. Porttitor bibendum et cras
              interdum faucibus.
            </p>
          </div>

          <div className=" body-text-h5 space-y-2 text-slate-700">
            <div className="flex flex-row gap-2 items-center">
              <MapPinIcon className="w-[14px] h-[14px] text-orange-500" />{" "}
              Lusaka,Zambia
            </div>

            <div className="flex flex-row gap-2 items-center">
              <CloudArrowUpIcon className="w-[14px] h-[14px] text-orange-500" />{" "}
              5 Artifacts
            </div>
            <div className="flex flex-row gap-2 items-center">
              <CurrencyDollarIcon className="w-[14px] h-[14px] text-orange-500" />{" "}
              100
            </div>
          </div>
          <div className="space-x-[-5px] flex flex-row hover:space-x-1 w-fit transition-all duration-100">
            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-50 cursor-pointer"></div>
            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-50 cursor-pointer"></div>
            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-50 cursor-pointer"></div>
          </div>

         
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
