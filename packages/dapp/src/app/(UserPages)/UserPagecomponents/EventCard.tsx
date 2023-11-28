"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { EventData } from "../../../../types";
import Button from "@/components/reusebaeComponents/button";

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link href={`/Profile/${event.name}`} key={event.name}>
      <div className="  w-[190px] h-fit rounded-xl flex flex-col  shadow-md px-1 ">
        <div className="relative w-full h-[150px]">
          <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
          <Image
            width={100}
            height={150}
            src={event.image}
            alt="Event Image"
            className="w-full h-[150px]  bg-slate-300 rounded-xl"
          />
        </div>

        <div className="  inset-0 p-3 flex flex-col space-y-[10px] body-text-h5 w-full h-full justify-end">
          <div className="flex flex-row justify-between items-end title-h4-slate">
            <div className="text-slate-950 text-sm">{event.name}</div>
          </div>
          <div className="space-y-2">
            <div className="flex flex-row gap-2 items-center text-xs font-normal text-slate-500 ">
              <CalendarDaysIcon className="text-slate-950 w-[14px] h-[14px]" />{" "}
              {event.date}
            </div>

            <div className="flex flex-row gap-2 items-center text-xs font-normal text-slate-500">
              <MapPinIcon className="text-slate-950 w-[14px] h-[14px]" />
              {event.country}
            </div>
          </div>

          <div className="flex flex-row gap-2 items-center w-full justify-between">
            <button
              className="bg-orange-500 text-xs h-fit w-fit rounded-xl px-3 py-1 text-white "
              type="button"
            >
              Buy
            </button>
            <div className=" flex flex-row items-center rounded-xl bg-slate-100 w-fit h-fit px-2 py-1">
              <p className="text-xs text-slate-950">{event.price}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
