import {
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import React from "react";

interface IconTextProps {
  icon?: any;
  text: string;
  value: string;
  percentage: string;
}

function Widget({ icon, text, value, percentage }: IconTextProps) {
  return (
    <div className="flex flex-col gap-2 w-full h-[96px] p-6 bg-slate-950 rounded-2xl ">
      <div className="flex flex-row gap-2 items-center">
        <div className="w-6 h-6">{icon}</div>
        <p className="H4-Base-mobile-card font-semibold text-white">{text}</p>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="w-6 h-6 H2-Base-mobile text-white ">{value}</div>
        <p className="flex flex-row gap-2 Body-text-mobile text-white">
          +{percentage}% <ArrowTrendingUpIcon className="w-4 h-4 text-white" />
        </p>
      </div>
    </div>
  );
}

export default Widget;
