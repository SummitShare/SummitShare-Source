import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

function DashboardAdminTransactionsHome() {
  return (
    <section>
      {/* Container for transaction information */}
      <div className="h-full rounded-xl space-y-4 bg-white flex flex-col items-center p-5">
        {/* Transaction Header */}
        <div className="flex flex-row gap-[120px]">
          <p className="text-base font-semibold">Transactions</p>
          {/* This Week information */}
          <p className="flex flex-row gap-6 text-xs font-medium">
            This Week
            <ChevronDownIcon className="w-3 h-3" />{" "}
            {/* Dropdown icon for week selection */}
          </p>
        </div>

        {/* Transaction Details */}
        <div className="flex flex-row gap-[90px] bg-gray-100 rounded-md  h-10 items-center justify-center shadow-sm px-3 py-2">
          {/* User Info (e.g., profile image and name) */}
          <div className="flex flex-row gap-2 text-base font-normal">
            {/* User profile image */}
            <Image
              className="w-6 h-6 bg-gray-200 rounded-full"
              src={""}
              alt=""
            />
            <p>Kate Morrison</p> {/* User name */}
          </div>

          {/* Transaction Details (e.g., quantity and amount) */}
          <div className="flex flex-row gap-6 text-sm font-medium">
            <p>X1</p> {/* Quantity */}
            <p className="text-slate-500">50$</p> {/* Transaction amount */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardAdminTransactionsHome;
