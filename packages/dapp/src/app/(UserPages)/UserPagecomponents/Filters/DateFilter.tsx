// DateFilter.tsx
import React from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

interface DateFilterProps {
  activeTab: "today" | "week" | "month" | "year";
  onTabChange: (tab: "today" | "week" | "month" | "year") => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ activeTab, onTabChange }) => {
  const timeframes: Array<"today" | "week" | "month" | "year"> = [
    "today",
    "week",
    "month",
    "year",
  ];

  return (
    <div className="flex flex-row bg-slate-100 body-text-h4  rounded-lg items-center justify-between px-1">
      {timeframes.map((tab) => (
        <div
          key={tab}
          className={`cursor-pointer text-center px-1 py-1 w-20 h-full${
            tab === activeTab
              ? "text-slate-700 bg-white rounded-md shadow-sm"
              : "text-slate-200"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </div>
      ))}
    </div>
  );
};

export default DateFilter;
