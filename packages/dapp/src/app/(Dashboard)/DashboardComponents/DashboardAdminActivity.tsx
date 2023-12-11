import { ChevronDownIcon } from "@heroicons/react/24/outline";
import DashboardActivityLineChart from "./DashboardActivityLineChart";
import StakeholderRevenuePiechart from "./StakeholderRevenuePiechart";
import TicketSalesLineChart from "./TicketSalesLineChart";
import EventAttendanceBarChart from "./EventAttendanceBarChart";

//data to come from backend api
const data = [
  ["Day", "Sold Tickets", "Earnings"],
  ["Monday", 1000, 500],
  ["Tuesday", 1170, 600],
  ["Wedesday", 660, 700],
  ["Thursday", 1030, 900],
  ["Friday", 1030, 900],
];
const revenueData = [
  ["stakeholders", "revenue"],
  ["Zamtel", 300],
  ["Airtel", 400],
  ["Brown Tech", 900],
  ["Zambia BOZ", 1000],
];

const ticketsData = [
  ["Day", "Sold Tickets"],
  ["Monday", 800],
  ["Tuesday", 110],
  ["Wedesday", 660],
  ["Thursday", 1030],
  ["Friday", 1030],
];



const eventssData = [
  ["Event", "Attentance"],
  ["Event-one", 500],
  ["Event-two", 900],
  ["Event-three", 860],
  ["Event-four", 130],
  ["Event-five", 550],
  ["Event-six", 100],

];


const DashboardAdminActivity = () => {
  return (
    <section>
      {/* Container for Activity */}
      <div className="bg-white  lg:w-full  rounded-xl p-6 shadow-sm">
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
        {/* <StakeholderRevenuePiechart data={revenueData} />
        <TicketSalesLineChart data={ticketsData} />
        <EventAttendanceBarChart data={eventssData} /> */}
      </div>
    </section>
  );
};

export default DashboardAdminActivity;
