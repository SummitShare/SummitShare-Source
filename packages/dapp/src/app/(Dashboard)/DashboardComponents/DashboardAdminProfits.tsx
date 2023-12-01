import { ChevronDownIcon } from "@heroicons/react/24/outline";
import DashboardProfitBarchart from "./DashboardProfitBarchart";
const data = [
  ["Product", "Views", { role: "style" }],
  ["Etherem", 3000, "#fdba74"],
  ["Dai", 2500, "#4ade80"],
  ["Shiba Inu", 2000, "#3f3f46"],
  ["Arbitrum", 2800, "#2dd4bf"],
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
