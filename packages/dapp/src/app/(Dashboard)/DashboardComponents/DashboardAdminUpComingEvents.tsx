import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";
import { EventsData } from "../../../../types";

// Define the component for the Dashboard's Upcoming Events
const DashboardAdminUpComingEvents = async () => {
  // Fetch data from the mock API
  const res = await fetch("https://64e27840ab0037358819053b.mockapi.io/graph", {
    cache: "no-cache",
    next: {
      tags: ["eventData"], // Tags for the request
    },
  });

  // Get the events data from the API response
  const event: EventsData[] = await res.json();

  return (
    // Display section for upcoming events
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex flex-row justify-between px-4">
        <p className="text-xl font-semibold">Upcoming Event</p>
        {/* Navigation buttons */}
        <div className="flex flex-row gap-[10px]">
          <ChevronLeftIcon className="w-6 h-6" />
          <ChevronRightIcon className="w-6 h-6" />
        </div>
      </div>

      {/* Display upcoming events */}
      <div className="space-y-5">
        {event.map((events) => (
          <div
            key={events.id}
            className="bg-white rounded-xl px-5 py-4 flex flex-row gap-4  h-[144px] shadow-sm lg:w-[636px] lg:h-fit lg:items-center"
          >
            {/* Event image placeholder */}
            <div className="w-10 h-10  lg:w-16 lg:h-16 rounded-full bg-gray-100 ">
              <Image src={""} alt="" />
            </div>
            <div className=" space-y-2">
              {/* Event details */}
              <div className="text-base font-semibold">{events.eventName}</div>
              {/* Event date, time, and location */}
              <div className="space-y-2 text-sm font-normal text-gray-500  lg:flex lg:flex-row  lg:gap-5 items-end">
                <div className="flex flex-row gap-2 items-center  lg:text-base font-normal">
                  <ClockIcon className="w-4 h-4 text-slate-500 " />
                  <p>{events.eventTime}</p>
                </div>
                <div className="flex flex-row gap-2 items-center  lg:text-base font-normal">
                  <CalendarDaysIcon className="w-4 h-4 text-slate-500" />
                  <p>{events.eventDate}</p>
                </div>
                <div className="flex flex-row gap-2 items-center  lg:text-base font-normal">
                  <MapPinIcon className="w-4 h-4 text-slate-500" />
                  <p>{events.eventName}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardAdminUpComingEvents;
