import Button from "@/components/reusebaeComponents/button";
import {
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
              <MapIcon className="w-[14px] h-[14px] text-orange-500" />{" "}
              13.11.2023
            </div>
            <div className="flex flex-row gap-2 items-center">
              <ClockIcon className="w-[14px] h-[14px] text-orange-500" /> 1:00PM
              - 5:00PM
            </div>
            <div className="flex flex-row gap-2 items-center">
              <CurrencyDollarIcon className="w-[14px] h-[14px] text-orange-500" />{" "}
              100
            </div>
          </div>

          <Button
            text=" Punches"
            type="button"
            backGroundColor="bg-gradient-to-r from-orange-500 to-orange-400"
            textColor="text-white"
          ></Button>
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
