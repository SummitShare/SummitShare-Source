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

interface ExhibitionData {
  name: string;
  country: string;
  eventType: string;
  eventDescription: string;
  image: string;
  price: string;
}

const dummyData: ExhibitionData[] = [
  {
    name: "women's history Museum",
    country: "South Korea",
    eventType: "Conference",
    eventDescription: "Korean tech conference.",
    image:
      "https://images.unsplash.com/photo-1696508367494-8c68daee9a0f?auto=format&fit=crop&q=80&w=2580&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$120",
  },
  {
    name: "Event 13",
    country: "Brazil",
    eventType: "Workshop",
    eventDescription: "Software development workshop.",
    image:
      "https://images.unsplash.com/photo-1699009435420-756b3649564f?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$80",
  },
  {
    name: "Event 13",
    country: "Brazil",
    eventType: "Workshop",
    eventDescription: "Software development workshop.",
    image:
      "https://images.unsplash.com/photo-1698864273184-41cf2052196b?auto=format&fit=crop&q=80&w=2680&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$80",
  },
];

function ShortAbout() {
  return (
    <div className="flex flex-col gap-5  h-full w-full items-center  py-20 px-10 ">
      <div className="text-center text-4xl font-bold flex flex-col justify-center items-center gap-5">
        <div className="space-y-2">
          <p className="text-blue-950">Visit Our Exhibitions</p>
          <p className="text-blue-950 text-base font-medium">
            View art works Historical artifacts and more in a 3D experience that
            fuses <br />
            traditional exhibitions and technology
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-center gap-2">
        {dummyData.map((event, index) => (
          <div className="relative w-[200px] h-[200px] rounded-xl flex flex-col gap-2 shadow-md group">
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
            <Image
              width={100}
              height={100}
              src={event.image}
              alt=""
              className="w-full h-full rounded-xl object-cover"
            />
            <div className="absolute inset-x-0 bottom-2 flex flex-col justify-center text-sm text-amber-50 p-2 font-semibold space-y-2">
              <p>{event.name}</p>
              <div className=" font-normal  text-xs  text-green-700 bg-green-100 rounded-full px-2 py-1 w-fit ">
                {event.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShortAbout;
