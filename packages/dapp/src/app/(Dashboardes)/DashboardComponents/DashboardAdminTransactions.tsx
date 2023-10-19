import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";

function DashboardAdminTransactions() {
  return (
    <div className="px-6">
      {/* Mobile View */}
      <section className="lg:hidden">
        <div className="mt-24 bg-white rounded-t-xl ">
          {/* Transaction Header */}
          <div className="flex flex-row  border-b border-gray-100 px-6 py-4 justify-between">
            <p className="text-xl font-semibold">Transactions</p>
            <div className="flex flex-row gap-[10px]">
              <ChevronLeftIcon className="w-6 h-6" />
              <ChevronRightIcon className="w-6 h-6" />
            </div>
          </div>
          {/* Transaction Details */}
          <div className="flex flex-col gap-4 border-b border-gray-100 py-4 px-6">
            <div className="text-base font-medium">Maputo Art Gallery</div>
            <div className="flex flex-row justify-between">
              {/* Left Column (Labels) */}
              <div className="space-y-2 text-gray-500 text-sm font-medium">
                <p>Ticket ID</p>
                <p>Transaction ID</p>
                <p>Date</p>
                <p>Amount</p>
                <p>Type</p>
              </div>
              {/* Right Column (Values) */}
              <div className="space-y-2 text-right text-sm font-medium">
                <p>***** 2468</p>
                <p>***** 2468</p>
                <p>Jan 12, 2023</p>
                <p>1000$</p>
                <p>Deposit</p>
              </div>
            </div>
          </div>
          {/* Additional Transactions Go Here */}
        </div>
      </section>

      {/* Desktop View */}
      <section className="hidden sm:block ">
        <div className="mt-24 bg-white rounded-t-xl w-fit ml-[250px]">
          {/* Transaction Header */}
          <div className="flex flex-row  border-b border-gray-100 px-6 py-4 justify-between">
            <p className="text-xl font-semibold">Events List</p>
            <div className="flex flex-row gap-[10px]">
              <ChevronLeftIcon className="w-6 h-6" />
              <ChevronRightIcon className="w-6 h-6" />
            </div>
          </div>
          {/* Transaction Details (Table) */}
          <div className="flex flex-col gap-4 border-b border-gray-100 py-4 px-6 justify-center">
            {/* Table Header (Labels) */}
            <div className="grid grid-cols-6 text-gray-500 text-xl font-medium gap-5 border-b border-gray-100 py-4 ">
              <p>Event Name</p>
              <p>Ticket ID</p>
              <p>Transaction ID</p>
              <p>Date</p>
              <p>Amount</p>
              <p>Type</p>
            </div>
            {/* Table Rows (Values) */}
            <div className="grid grid-cols-6 gap-5 items-center text-base">
              <p>Maputo Art Gallery</p>
              <p>***** 2468</p>
              <p>***** 2468</p>
              <p>Jan 12, 2023</p>
              <p>1000$</p>
              <p>Deposit</p>
            </div>
            {/* Additional Rows Go Here */}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardAdminTransactions;
