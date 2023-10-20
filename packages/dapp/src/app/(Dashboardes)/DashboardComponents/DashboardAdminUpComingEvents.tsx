import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

const DashboardAdminUpComingEvents = async () => {
  const res = await fetch("https://64e27840ab0037358819053b.mockapi.io/graph", {
    cache: "no-cache",
    next: {
      tags: ["eventData"],
    },
  });

  const event: EventsData[] = await res.json();

  return (
    <section className="space-y-4">
      <div className="flex flex-row gap-[105px] lg:gap-[395px] px-4">
        <p className="text-xl font-semibold">Upcoming Event</p>
        <div className="flex flex-row gap-[10px]">
          <ChevronLeftIcon className="w-6 h-6" />
          <ChevronRightIcon className="w-6 h-6" />
        </div>
      </div>
      <div className="space-y-5">
        {event.map((events) => (
          <div
            key={events.id}
            className="bg-white rounded-xl px-5 py-4 flex flex-row gap-4 w-[350px] h-[144px] shadow-sm lg:w-[636px] lg:h-fit lg:items-center"
          >
            <div className="w-10 h-10  lg:w-16 lg:h-16 rounded-full bg-gray-100 ">
              <Image src={""} alt="" />
            </div>
            <div className=" space-y-4">
              <div className="text-base font-semibold">{events.eventName}</div>
              <div className="space-y-2 text-sm font-normal text-gray-500  lg:flex lg:flex-row  lg:gap-6 items-end">
                <div className="flex flex-row gap-2 items-center  lg:text-base font-normal">
                  <ClockIcon className="w-4 h-4 text-violet-500 " />
                  <p>{events.eventTime}</p>
                </div>
                <div className="flex flex-row gap-2 items-center  lg:text-base font-normal">
                  <CalendarDaysIcon className="w-4 h-4 text-violet-500" />
                  <p>{events.eventDate}</p>
                </div>
                <div className="flex flex-row gap-2 items-center  lg:text-base font-normal">
                  <MapPinIcon className="w-4 h-4 text-violet-500" />
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
