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
    <Link href={`/Profile/${event.name}`} key={event.name} className="group">
      <div className="  w-[230px] h-fit rounded-xl flex flex-col  shadow-md  p-1 ">
        <div className="relative w-full h-[150px]">
          <div className="absolute inset-0  rounded-xl bg-black/10"></div>
         
           <Image
                className="rounded-xl w-full h-full object-cover"
                src={event.image}
                alt=""
                width={480}
                height={480}
                quality={100} // {number 1-100}
                priority={true} // {false} | {true}
                style={{ objectFit: 'cover' }} // Add this line
              />

              <div className="absolute inset-0 w-full h-full flex items-end justify-center py-2">
<div className="  bg-slate-950 rounded-[12px] px-[12px] py-[10px] text-center w-fit h-fit invisible group-hover:visible transition-all duration-150">
                 <p className="roboto font-medium text-sm text-white">View Ticket</p>
                </div>
              </div>
                
        </div>

        <div className="   p-3 flex flex-col space-y-2 body-text-h5 w-full h-full justify-end">
                 <div className="flex flex-row gap-2 items-center w-full gap-2">
                    <div className=" w-2 h-2 rounded-full bg-blue-500">
        
            </div>
          <div className="roboto  font-light text-blue-950 text-[10px]">{event.name}</div>
          
          </div>

              <div className="flex flex-row gap-2 items-center w-full justify-between">
          <div className="font-bold text-blue-950 text-base">{event.name}</div>
            <div className=" flex flex-row items-center rounded-xl bg-[#FF7324] w-fit h-fit px-2 py-1">
              <p className=" roboto text-[10px] font-medium text-white">{event.price}</p>
            </div>
          </div>
          <div className="flex flex-row justify-between bg-[#F1F5F9] rounded-[8px] py-[10px] px-3 ">
            <div className="flex flex-col gap-2 items-left text-xs font-normal text-slate-500 ">
              <p className="roboto text-sm font-light ">Date</p>
              <p className="roboto font-semibold text-sm text-blue-950">  {event.date}</p>
            
            </div>

            <div className="flex flex-col gap-2 items-left text-xs font-normal text-slate-500">
              <p className="roboto text-sm font-light "> Location</p>
              <p className="roboto font-semibold text-sm text-blue-950"> {event.country}</p>
             
            </div>



          </div>

     
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
