import { ChevronDownIcon } from "@heroicons/react/24/outline";
import DashboardProfitBarchart from "./DashboardProfitBarchart";
const data = [
  ["Product", "Views", { role: "style" }],
  ["Etherem", 3000, "#f97316"],
  ["Dai", 2500, "#22c55e"],
  ["Shiba Inu", 2000, "#030712"],
  ["Arbitrum", 2800, "#0ea5e9"],
];
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

        <DashboardProfitBarchart data={data} />
      </div>
    </section>
  );
}

export default DashboardAdminProfits;
