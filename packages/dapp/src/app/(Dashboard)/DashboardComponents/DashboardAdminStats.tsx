import {
  TicketIcon,
  WalletIcon,
  CalendarIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";
import wiredLine from "/public/wiredLine.svg"; // Assuming this is the path to your wiredLine image

interface overViewDataProps {
  icon: any;
  tittle: string;
  values?: {}[];
  increment: string;
}

const value = {
  UpcomingEvents: "3",
  SoldTickets: "$106",
  TotalEarnings: "$500",
};

const increment = {
  UpcomingEvents: "+90.05%",
  SoldTickets: "+86.00%",
  TotalEarnings: "+97.00%",
};

function DashboardAdminStats() {
  return (
    <section className=" flex snap-x flex-row gap-5 overflow-x-auto no-scrollbar">
      <div className="snap-center">
        <div className="bg-black rounded-2xl px-6 py-3 space-y-3  text-white items-center justify-center text-sm w-[200px] ">
          <div className="flex flex-row gap-2 items-center ">
            <div className="w-6 h-6">
              <CalendarDaysIcon />
            </div>
            <p className="text-sm">Upcoming Events</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-xl font-semibold">{value.UpcomingEvents}</p>
            <p className="flex flex-row gap-1 items-center text-xs font-normal">
              {increment.UpcomingEvents}
              <Image className="w-4 h-4" src={wiredLine} alt="" />
            </p>
          </div>
        </div>
      </div>
      <div className="snap-center">
        <div className="bg-black rounded-2xl px-6 py-3 space-y-3  text-white items-center justify-center text-sm w-[200px]">
          <div className="flex flex-row gap-2 items-center ">
            <div className="w-6 h-6">
              <TicketIcon />
            </div>
            <p className="text-sm">Sold Tickets</p>
          </div>
          <div className="flex flex-row  justify-between items-center">
            <p className="text-xl font-semibold">{value.SoldTickets}</p>{" "}
            <p className="flex flex-row gap-1 items-center text-xs font-normal">
              {increment.SoldTickets}
              <Image className="w-4 h-4" src={wiredLine} alt="" />{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="snap-center">
        <div className="bg-black rounded-2xl px-6 py-3 space-y-3  text-white items-center justify-center text-sm w-[200px]">
          <div className="flex flex-row gap-2 items-center">
            <div className="w-6 h-6">
              <WalletIcon />
            </div>
            <p className="text-sm">Total Earnings</p>
          </div>
          <div className="flex flex-row  justify-between items-center">
            <p className="text-xl font-semibold">{value.TotalEarnings}</p>{" "}
            <p className="flex flex-row gap-1 items-center text-xs font-normal">
              {increment.TotalEarnings}
              <Image className="w-4 h-4" src={wiredLine} alt="" />{" "}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardAdminStats;
