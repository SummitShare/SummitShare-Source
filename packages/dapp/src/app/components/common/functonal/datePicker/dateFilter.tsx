// DateFilter.tsx
import { DateFilterProps } from "@/utils/dev/frontEndInterfaces";

const DateFilter: React.FC<DateFilterProps> = ({ activeTab, onTabChange }) => {
  const timeframes: Array<"today" | "week" | "month" | "year"> = [
    "today",
    "week",
    "month",
    "year",
  ];

  return (
    <div className="flex flex-row bg-white  rounded-md items-center justify-between  h-10  ring-1 ring-gray-300 px-2  text-[0.8rem] w-full">
      {timeframes.map((tab) => (
        <div
          key={tab}
          className={`cursor-pointer text-center px-1 py-1 w-full ${
            tab === activeTab
              ? "text-gray-950 bg-gray-100 rounded-sm shadow-sm"
              : "text-gray-600"
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
