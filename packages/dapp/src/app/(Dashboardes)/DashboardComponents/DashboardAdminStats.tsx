import {
  TicketIcon,
  WalletIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";
import wiredLine from "/public/wiredLine.svg"; // Assuming this is the path to your wiredLine image

function DashboardAdminStats() {
  return (
    <section className="flex flex-row gap-4">
      {/* Upcoming Events Stat Card */}
      <div className="bg-black rounded-2xl p-6 flex flex-col gap-3 text-white items-center justify-center text-sm lg:w-[202px] shadow-sm">
        <div className="flex flex-row gap-2 justify-between items-center">
          <CalendarIcon className="w-6 h-6" /> {/* Calendar icon */}
          <p className="lg:text-base">Upcoming Events</p>{" "}
          {/* Stat title: "Upcoming Events" */}
        </div>
        <div className="flex flex-row gap-16 2 justify-between items-center">
          <p className="text-2xl font-semibold">2</p>{" "}
          {/* Number of upcoming events */}
          <p className="flex flex-row gap-1 items-center text-xs font-normal">
            +11.01%
            <Image className="w-4 h-4" src={wiredLine} alt="" />{" "}
            {/* Wired Line image */}
          </p>
        </div>
      </div>

      {/* Solid Tickets Stat Card */}
      <div className="bg-black rounded-2xl p-6 flex flex-col gap-3 text-white items-center justify-center text-sm lg:w-[202px] shadow-sm">
        <div className="flex flex-row gap-9 justify-between items-center">
          <TicketIcon className="w-6 h-6" /> {/* Ticket icon */}
          <p className="lg:text-base">Solid Tickets</p>{" "}
          {/* Stat title: "Solid Tickets" */}
        </div>
        <div className="flex flex-row gap-16 2 justify-between items-center">
          <p className="text-2xl font-semibold">30</p>{" "}
          {/* Number of solid tickets */}
          <p className="flex flex-row gap-1 items-center text-xs font-normal">
            +9.01%
            <Image className="w-4 h-4" src={wiredLine} alt="" />{" "}
            {/* Wired Line image */}
          </p>
        </div>
      </div>

      {/* Total Earnings Stat Card */}
      <div className="bg-black rounded-2xl p-6 px-3 flex flex-col gap-3 text-white items-center justify-center text-sm lg:w-[202px] shadow-sm">
        <div className="flex flex-row gap-8 justify-between items-center">
          <WalletIcon className="w-6 h-6" /> {/* Wallet icon */}
          <p className="lg:text-base">Total Earnings</p>{" "}
          {/* Stat title: "Total Earnings" */}
        </div>
        <div className="flex flex-row gap-16 2 justify-between items-center">
          <p className="text-2xl font-semibold">$12</p> {/* Total earnings */}
          <p className="flex flex-row gap-1 items-center text-xs font-normal">
            +45.01%
            <Image className="w-4 h-4" src={wiredLine} alt="" />{" "}
            {/* Wired Line image */}
          </p>
        </div>
      </div>
    </section>
  );
}

export default DashboardAdminStats;
