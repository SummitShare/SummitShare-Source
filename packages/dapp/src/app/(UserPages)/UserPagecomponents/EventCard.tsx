"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { EventData } from "../../../../types";

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link href={`/Profile/${event.name}`} key={event.name}>
      <div className="bg-slate-50 w-[190px] h-fit rounded-xl flex flex-col gap-2 shadow-md p-1">
        <Image
          width={100}
          height={100}
          src={event.image}
          alt="Event Image"
          className="w-full h-[125px]  bg-slate-300 rounded-xl"
        />
        <div className="px-2 pb-5  space-y-2 body-text-h5 ">
          <div className="flex flex-row justify-between items-end title-h4-slate">
            <div className="text-slate-950 text-sm">{event.name}</div>
            <div className=" text-xs font-normal text-green-700 bg-green-100 rounded-full px-2 py-1 w-fit">
              {event.price}
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center  ">
            <MapPinIcon className="w-[14px] h-[14px] text-slate-950" />
            {event.country}
          </div>
          <div className="flex flex-row gap-2 items-center  ">
            <CalendarDaysIcon className="w-[14px] h-[14px] text-slate-950" />
            {event.date}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <ClockIcon className="w-[14px] h-[14px] text-slate-950" />
            {event.eventTimeStart}-{event.eventTimeEnd}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
