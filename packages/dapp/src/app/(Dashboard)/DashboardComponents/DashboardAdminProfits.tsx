import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";
import barChart from "/public/barChart.png"; // Assuming this is the path to your barChart image
import DashboardProfitBarchart from "./DashboardProfitBarchart";

function DashboardAdminProfits() {
  return (
    <section>
      {/* Container for Profits */}
      <div className="bg-white  w-full rounded-xl p-6 shadow-sm">
        {/* Profits Header */}
        <div className="flex flex-row justify-between items-center">
          <p className="text-xl font-semibold lg:text-base">Profits</p>{" "}
          {/* Title: "Profits" */}
          <p className="flex flex-row gap-6 text-xs font-medium">
            This Week
            <ChevronDownIcon className="w-3 h-3" />{" "}
            {/* Dropdown icon for week selection */}
          </p>
        </div>

        <DashboardProfitBarchart />
      </div>
    </section>
  );
}

export default DashboardAdminProfits;
