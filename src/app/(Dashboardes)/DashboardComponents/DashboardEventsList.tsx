import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";

function DashboardEventsList() {
  return (
    <div className="px-6">
      {/* Mobile View */}
      <section className="lg:hidden">
        <div className="mt-24 bg-white rounded-t-xl">
          {/* Header */}
          <div className="flex flex-row border-b border-gray-100 px-6 py-4 justify-between">
            <p className="text-xl font-semibold">Events List</p>
            <div className="flex flex-row gap-10">
              <ChevronLeftIcon className="w-6 h-6" />
              <ChevronRightIcon className="w-6 h-6" />
            </div>
          </div>
          {/* Event Details */}
          <div className="flex flex-col gap-4 border-b border-gray-100 py-4 px-6">
            <div className="text-base font-medium">Maputo Art Gallery</div>
            <div className="flex flex-row justify-between">
              <div className="space-y-2 text-gray-500 text-sm font-medium">
                <p>Event Date</p>
                <p>Ticket Price</p>
                <p>Tickets Sold</p>
                <p>Total Income</p>
              </div>
              <div className="space-y-2 text-right text-sm font-medium">
                <p>Jan 12, 2023</p>
                <p>$50</p>
                <p>
                  <span className="text-violet-500">100</span>/150
                </p>
                <p>$1000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop View */}
      <section className="hidden sm:block">
        <div className="mt-24 bg-white rounded-t-xl w-fit ml-[250px]">
          {/* Header */}
          <div className="flex flex-row border-b border-gray-100 px-6 py-4 justify-between">
            <p className="text-xl font-semibold">Events List</p>
            <div className="flex flex-row gap-10">
              <ChevronLeftIcon className="w-6 h-6" />
              <ChevronRightIcon className="w-6 h-6" />
            </div>
          </div>
          {/* Event Details (table format) */}
          <div className="flex flex-col gap-4 border-b border-gray-100 py-4 px-6">
            <div className="grid grid-cols-5 text-gray-500 text-xl font-medium gap-14 border-b border-gray-100 py-4 ">
              <p>Event Name</p>
              <p>Event Date</p>
              <p>Ticket Price</p>
              <p>Tickets Sold</p>
              <p>Total Income</p>
            </div>

            <div className="grid grid-cols-5 gap-14 items-center text-base">
              <p className="w-100px">Maputo Art Gallery</p>
              <p>Jan 12, 2023</p>
              <p>$50</p>
              <p>
                <span className="text-violet-500">100</span>/150
              </p>
              <p>$1000</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardEventsList;
