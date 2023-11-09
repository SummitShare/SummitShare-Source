"use client";

import {
  CalendarIcon,
  ChevronLeftIcon,
  ClockIcon,
  MapIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon, DotFilledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface EventsData {
  id?: number;
  eventName: string;
  eventDescription: string;
  eventTimeStart: string;
  eventTimeEnd: string;
  eventDate: string;
  walletOne: string;
  walletTwo: string;
  split: string;
  price: string;
  ticketNumber: string;
  eventLocation: string;
  image: string;
}

const TicketCard = () => {
  const [events, setEvents] = useState<EventsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://64e27840ab0037358819053b.mockapi.io/graph",
          {
            method: "GET", // specify the HTTP method
            headers: {
              "Cache-Control": "no-cache", // set the Cache-Control header
              "next-tags": "eventData", // set your custom header
            },
          }
        );

        if (res.ok) {
          const data: EventsData[] = await res.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const firstIndex = currentPage * recordsPerPage; // Calculate firstIndex based on currentPage
  const lastIndex = firstIndex + recordsPerPage;
  const records = events.slice(firstIndex, lastIndex);

  const nPages = Math.ceil(events.length / recordsPerPage);
  const numbers = Array.from({ length: nPages }, (_, i) => i + 1);

  // Function to handle page number click
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };
  const nextPage = () => {
    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="relative flex flex-row gap-4 w-full justify-center group ">
      {records.map((event, index) => (
        <div
          key={index}
          className="bg-white/25 w-[190px] h-fit rounded-xl flex flex-col gap-2 shadow-md p-1"
        >
          <Image
            width={125}
            height={100}
            src={event.image}
            alt="idk"
            className="w-full h-[125px] bg-slate-300 rounded-xl"
          />
          <div className="px-2 pb-5 text-xs space-y-2 text-slate-700">
            <div className="flex flex-row justify-between text-sm font-semibold text-950">
              <div>{event.eventName}</div>
              <div>${event.price}</div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <MapPinIcon className="w-[14px] h-[14px]" />
              {event.eventLocation}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <CalendarIcon className="w-[14px] h-[14px]" /> {"13/11/2023"}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <ClockIcon className="w-[14px] h-[14px]" /> {"13:00 pm"}
            </div>
          </div>
        </div>
      ))}
      <div className=" absolute -bottom-14 flex-row flex bg-slate-100 px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all ">
        {numbers.map((number, index) => (
          <div onClick={() => setCurrentPage(index)} key={index}>
            <DotFilledIcon
              className={` cursor-pointer ${
                index === currentPage ? `text-blue-500` : `text-slate-500`
              }`}
            />
          </div>
        ))}
      </div>
      <div
        onClick={prevPage}
        className="absolute top-[50%] -left-5 w-10 h-10 bg-slate-950/80  rounded-full flex justify-center items-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronLeftIcon className="w-5 h-5 text-white" />
      </div>
      <div
        onClick={nextPage}
        className="absolute top-[50%] -right-5  w-10 h-10 bg-slate-950/80  rounded-full flex justify-center items-center cursor-pointer  opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronRightIcon className="w-5 h-5 text-white" />
      </div>
    </div>
  );
};

export default TicketCard;
