"use client";
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useState } from "react";

interface EventsCardProps {
  image: string;
  title: string;
  time: string;
  date: string;
  location: string;
  description: string;
}

function EventsCardDb({
  image,
  title,
  time,
  date,
  location,
  description,
}: EventsCardProps) {
 


  const [stauts,setStatus] = useState<boolean>();

const handleAccept = () => {
    setStatus(true);
    console.log({
      proposal_id: "65021f62-4a67-420c-bdd1-8cd96d0db1b9",
      Vote: true,
      user_id: "d0ffa426-41e5-49ed-b9e0-653a8c55d036"
    });
  };

  const handleDecline = () => {
    setStatus(false);
    console.log({
      proposal_id: "65021f62-4a67-420c-bdd1-8cd96d0db1b9",
      Vote: false,
      user_id: "d0ffa426-41e5-49ed-b9e0-653a8c55d036"
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-row justify-between w-full h-fit py-4 pl-5 bg-white rounded-[10px] pr-4">
      <div className="flex flex-row gap-4">
        <Image
          src={image}
          alt="event"
          width={64}
          height={64}
          className="rounded-full w-16 h-16"
        />
        <div className="flex flex-col gap-4">
          <p className="Body-text-mobile-big-thick text-blue-950">{title}</p>
          <div className="Body-text-mobile-mid text-slate-500 flex flex-col gap-2 lg:flex-row lg:5">
            <div className="flex flex-row gap-2 items-center">
              <ClockIcon className="w-5 h-5 text-orange-500" />
              <p>{time}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <CalendarDaysIcon className="w-5 h-5 text-orange-500" />
              <p>{date}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <MapPinIcon className="w-5 h-5 text-orange-500" />
              <p>{location}</p>
            </div>
          </div>
          {isOpen && (
            <>
              <div className="flex flex-col gap-2 items-start Body-text-mobile-mid text-slate-500">
                <p className="H4-Base-mobile-card text-blue-950 w-full">
                  Description
                </p>
                <p className="Body-text-mobile-mid w-[250px]">{description}</p>
              </div>
              <div className="space-x-2">
                <button onClick={handleAccept} className="bg-green-500 px-6 py-2 rounded-xl Button-text text-white w-fit">
                  Accept
                </button>
                <button onClick={handleDecline} className="border border-red-500 px-6 py-2 rounded-xl Button-text text-red-500 w-fit">
                  Decline
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="cursor-pointer" onClick={handleOpen}>
        <ChevronDownIcon className="w-4 h-4 text-blue-950" />
      </div>
    </div>
  );
}

export default EventsCardDb;
