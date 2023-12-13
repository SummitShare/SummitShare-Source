"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import DateFilter from "@/app/(UserPages)/UserPagecomponents/Filters/DateFilter";
import CountryFilter from "@/app/(UserPages)/UserPagecomponents/Filters/CountryFilter";
import EventTypeFilter from "@/app/(UserPages)/UserPagecomponents/Filters/EventTypeFilter";
import PaginationControls from "@/app/(UserPages)/UserPagecomponents/Filters/Pagination";
import EventCard from "@/app/(UserPages)/UserPagecomponents/EventCard";
import { EventData } from "../../../../types";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const dummyData: EventData[] = [
  {
    name: "Mountain View",
    date: "2023-05-15",
    country: "Swiss Alps",
    price: "Free",
    eventType: "Nature Photography",
    image:
      "https://images.unsplash.com/photo-1574367157590-3454fe866961?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "City Lights",
    date: "2023-03-20",
    country: "New York City",
    price: "$200",
    eventType: "Urban Photography",
    image:
      "https://images.unsplash.com/photo-1637680298164-74342b63a61a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Seaside Sunrise",
    date: "2023-09-10",
    country: "Maldives",
    price: "$150",
    eventType: "Landscape Photography",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Night Sky",
    date: "2023-01-15",
    country: "Sahara Desert",
    price: "$300",
    eventType: "Astrophotography",
    image:
      "https://images.unsplash.com/photo-1534235826754-0a3572d1d6d5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Old Architecture",
    date: "2023-12-30",
    country: "Rome, Italy",
    price: "Free",
    eventType: "Cultural Photography",
    image:
      "https://images.unsplash.com/photo-1526285849717-482456cd7436?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const UpcomingMuseumExhibitions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "today" | "week" | "month" | "year"
  >("year");
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>(dummyData);
  const recordsPerPage = 5;

  useEffect(() => {
    // Filter logic inside useEffect which will run when dependencies change
    const filtered = dummyData.filter((event) => {
      setCurrentPage(0);
      // Filtering by country
      if (selectedCountry && event.country !== selectedCountry) {
        return false;
      }
      // Filtering by event eventType
     
      // Filtering by activeTab (date logic)
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Clear time part for accurate comparison

      switch (activeTab) {
        case "today":
          return eventDate.toDateString() === today.toDateString();
        case "week": {
          let startOfWeek = new Date(today);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Assuming the week starts on Sunday
          let endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(endOfWeek.getDate() + 6);
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        }
        case "month": {
          let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          let endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          );
          return eventDate >= startOfMonth && eventDate <= endOfMonth;
        }
        case "year": {
          let startOfYear = new Date(today.getFullYear(), 0, 1);
          let endOfYear = new Date(today.getFullYear(), 11, 31);
          return eventDate >= startOfYear && eventDate <= endOfYear;
        }
        default:
          return true; // No date filter applied
      }
    });

    setFilteredEvents(filtered);
  }, [selectedCountry, activeTab]);

  const startIndex = currentPage * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const totalPages = Math.ceil(filteredEvents.length / recordsPerPage);

  return (
    <div className="container mx-auto p-4 space-y-5">
      <div className="space-y-2">
        <p className="font-poppins text-2xl text-blue-950 font-bold">Upcoming Museum Exhibitions</p>
        <p className="font-opensans text-blue-950 ">
          Explore upcoming exhibitions with ease! Filter by country, date, and{" "}
          <br />
          eventType below to find exactly what youre looking for
        </p>
      </div>

      <div className="flex flex-row justify-between">
        <DateFilter activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex flex-row gap-2">
          <CountryFilter
            onCountryChange={setSelectedCountry}
            uniqueCountries={getUniqueCountries(dummyData)}
          />
         
        </div>
      </div>

      <div className=" flex flex-row  gap-3 w-full  mt-6">
        {filteredEvents.slice(startIndex, endIndex).map((event, index) => (
          <EventCard event={event} key ={index}/>
        ))}
      </div>

      <Link href={"#"} className="font-opensans bg-slate-100 rounded-xl flex flex-row gap-2 items-center px-3 py-[10px] w-fit">View All Exhibtions <ChevronRightIcon className="w-[18px] h-[18px]"/></Link>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default UpcomingMuseumExhibitions;

// Helper functions to extract unique countries and event eventTypes
function getUniqueCountries(events: EventData[]) {
  return Array.from(new Set(events.map((event) => event.country)));
}

function getUniqueEventeventTypes(events: EventData[]) {
  return Array.from(new Set(events.map((event) => event.eventType)));
}
