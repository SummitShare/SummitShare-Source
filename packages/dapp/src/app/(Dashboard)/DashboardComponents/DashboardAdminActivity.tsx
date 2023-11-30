import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";
import lineChart from "/public/lineChart.png"; // Assuming this is the path to your lineChart image
import ActivityLineChart from "./LineChart";
import LineChart from "./LineChart";

const DashboardAdminActivity = () => {
  return (
    <section>
      {/* Container for Activity */}
      <div className="bg-white  lg:w-[638px]  rounded-xl p-6 shadow-sm">
        {/* Activity Header */}
        <div className="flex flex-row justify-between items-center">
          <p className="text-xl font-semibold">Activity</p>{" "}
          {/* Title: "Activity" */}
          <p className="flex flex-row gap-6 text-xs font-medium">
            This Week
            <ChevronDownIcon className="w-3 h-3" />{" "}
            {/* Dropdown icon for week selection */}
          </p>
        </div>
        {/* Activity Line Chart */}

        {/* Display the line chart */}

        <LineChart />
      </div>
    </section>
  );
};

export default DashboardAdminActivity;
