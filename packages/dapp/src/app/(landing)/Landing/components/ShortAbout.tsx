import TicketCard from "@/ComponentsToBeEdited/TicketCard";
import Button from "@/reusebaeComponents/button";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";
import LoginImg from "/public/login.png";

interface EventData {
  name: string;
  date: string;
  country: string;
  eventType: string;
  eventDescription: string;
  image: string;
  price: string;
  eventTimeStart: string;
  eventTimeEnd: string;
}

const dummyData: EventData[] = [
  {
    name: "Event 1",
    date: "2023-10-29",
    country: "USA",
    eventType: "Conference",
    eventDescription: "A conference on technology advancements.",
    image:
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80&w=2160&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$100",
    eventTimeStart: "09:00 AM",
    eventTimeEnd: "05:00 PM",
  },
  {
    name: "Event 2",
    date: "2023-10-30",
    country: "Canada",
    eventType: "Workshop",
    eventDescription: "Hands-on workshop for developers.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=2671&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$50",
    eventTimeStart: "10:00 AM",
    eventTimeEnd: "03:00 PM",
  },
  {
    name: "Event 3",
    date: "2023-11-05",
    country: "UK",
    eventType: "Seminar",
    eventDescription: "A seminar on business strategies.",
    image:
      "https://images.unsplash.com/photo-1484589065579-248aad0d8b13?auto=format&fit=crop&q=80&w=2559&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$75",
    eventTimeStart: "02:00 PM",
    eventTimeEnd: "06:00 PM",
  },
];

function ShortAbout() {
  return (
    <div className="flex flex-col gap-5  h-full w-full items-center  py-20 px-10 ">
      <div className="text-center text-4xl font-bold flex flex-col justify-center items-center gap-5">
        <div className="space-y-2">
          <p className="text-amber-950">Experience Culture</p>
          <p className="text-amber-950 text-base font-medium">
            Join our Museums,art Galleries and Exhibitions embrace cutler
            together and <br />
            learn more about art and history
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-center gap-2">
        {dummyData.map((event, index) => (
          <div
            key={index}
            className="bg-stone-50 w-[190px] h-fit rounded-xl flex flex-col gap-2 shadow-md p-1"
          >
            <Image
              width={125}
              height={100}
              src={event.image}
              alt="idk"
              className="w-full h-[125px] bg-slate-300 rounded-xl"
            />
            <div className="px-2 pb-5 text-xs space-y-2 text-slate-700">
              <div className="flex flex-row justify-between text-sm font-semibold  text-amber-950">
                <div>{event.name}</div>
                <div className=" font-normal  text-xs  text-green-700 bg-green-100 rounded-full px-2 py-1 w-fit ">
                  {event.price}
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center text-sm font-normal text-stone-500">
                <MapPinIcon className="text-amber-500 w-[14px] h-[14px]" />
                {event.country}
              </div>
              <div className="flex flex-row gap-2 items-center text-sm font-normal text-stone-500">
                <CalendarDaysIcon className="text-amber-500 w-[14px] h-[14px]" />{" "}
                {event.date}
              </div>
              <div className="flex flex-row gap-2 items-center text-sm font-normal text-stone-500">
                <ClockIcon className="text-amber-500 w-[14px] h-[14px]" />
                {event.eventTimeStart}-{event.eventTimeEnd}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShortAbout;
