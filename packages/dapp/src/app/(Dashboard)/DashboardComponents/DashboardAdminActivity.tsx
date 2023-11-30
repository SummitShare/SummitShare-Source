import { ChevronDownIcon } from "@heroicons/react/24/outline";
import DashboardActivityLineChart from "./DashboardActivityLineChart";

//data to come from backend api
const data = [
  ["Day", "Sold Tickets", "Earnings"],
  ["Monday", 1000, 500],
  ["Tuesday", 1170, 600],
  ["Wedesday", 660, 700],
  ["Thursday", 1030, 900],
  ["Friday", 1030, 900],
];

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

        <DashboardActivityLineChart data={data} />
      </div>
    </section>
  );
};

export default DashboardAdminActivity;
