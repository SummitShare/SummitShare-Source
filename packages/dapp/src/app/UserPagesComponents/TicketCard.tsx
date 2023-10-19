import { ClockIcon, MapIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React from "react";

function TicketCard() {
  return (
    <div className="flex flex-row gap-2">
      <div className="bg-slate-100 w-[200px] h-fit rounded-xl flex flex-col gap-2 shadow-md p-1">
        <div className="w-full h-[125px] bg-slate-300 rounded-xl"></div>
        <div className=" px-2 pb-5 text-xs space-y-2 text-slate-700">
          <div className=" flex flex-row justify-between text-sm font-semibold text-950">
            <div>Lusaka Art Galley</div>
            <div>Eth 0.1</div>
          </div>
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
      </div>
      <div className="bg-slate-100 w-[200px] h-fit rounded-xl flex flex-col gap-2 shadow-md p-1">
        <div className="w-full h-[125px] bg-slate-300 rounded-xl"></div>
        <div className=" px-2 pb-5 text-xs space-y-2 text-slate-700">
          <div className=" flex flex-row justify-between text-sm font-semibold text-950">
            <div>Lusaka Art Galley</div>
            <div>Eth 0.1</div>
          </div>
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
      </div>
    </div>
  );
}

export default TicketCard;
