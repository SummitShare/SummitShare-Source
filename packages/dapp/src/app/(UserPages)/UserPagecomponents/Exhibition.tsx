"use client";
import React, { useState, useEffect } from "react";

import CountryFilter from "@/app/(UserPages)/UserPagecomponents/Filters/CountryFilter";
import EventTypeFilter from "@/app/(UserPages)/UserPagecomponents/Filters/EventTypeFilter";
import PaginationControls from "@/app/(UserPages)/UserPagecomponents/Filters/Pagination";
import VirtualEventsCard from "@/components/reusebaeComponents/VirtualEventsCard";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Button from "@/components/reusebaeComponents/button";

export interface ExhibitionData {
  name: string;
  country: string;
  eventType: string;

  image: string;
  price: string;
}

const dummyData: ExhibitionData[] = [
  {
    name: "Womens History",
    country: "Lusaka,Zambia",
    price: "$10",
    eventType: "Museum",
    image:
      "https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650967637542-JRICAI9PM44TACJ9MINP/ll-cover.7d6f50234cee534f9855.png?format=2500w",
  },
  {
    name: "Spectrums Galley",

    country: "Location 2",
    price: "$200",
    eventType: "Type 2",
    image:
      "https://images.unsplash.com/photo-1678834907853-509ffb92a047?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Crystals Museum",

    country: "Location 3",
    price: "$300",
    eventType: "Type 3",
    image:
      "https://images.unsplash.com/photo-1697885938464-a4ddcb0238e4?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const VirtualEventCard = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState<ExhibitionData[]>(
    dummyData
  );
  const recordsPerPage = 6;

  useEffect(() => {
    setCurrentPage(0);

    const filtered = dummyData.filter((event) => {
      // Filtering by country
      if (selectedCountry && event.country !== selectedCountry) {
        return false;
      }
      // Filtering by event type
      if (selectedEventType && event.eventType !== selectedEventType) {
        return false;
      }
      return true;
    });

    setFilteredEvents(filtered);
  }, [selectedCountry, selectedEventType]);

  const startIndex = currentPage * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const totalPages = Math.ceil(filteredEvents.length / recordsPerPage);

  return (
    <div className="container mx-auto p-4 space-y-5">
      
      <div className="flex flex-row justify-between  ">
        <div className="flex flex-row gap-3">
            <CountryFilter
          onCountryChange={setSelectedCountry}
          uniqueCountries={getUniqueCountries(dummyData)}
        />
        <EventTypeFilter
          onEventTypeChange={setSelectedEventType}
          uniqueEventTypes={getUniqueEventTypes(dummyData)}
        />
        </div>
    
          <Link href={"#"} className="font-opensans bg-slate-100 rounded-xl flex flex-row gap-2 items-center px-3 py-[10px] w-fit">View All Exhibtions <ChevronRightIcon className="w-[18px] h-[18px]"/></Link>
      </div>

<div className="flex flex-row justify-between items-center">
  <div className="space-y-6">
    <div className="space-y-2">
        <p className="font-poppins text-2xl text-blue-950 font-bold">Virtual Exhibitions</p>
        <p className="font-opensans text-blue-950 ">
          Explore virtual exhibitions with ease! Filter by country 
            <br />and type
          below to find exactly what   <br />you're looking for
        </p>

        
      </div>
    <div className="flex flex-row gap-3">
        <Button
          text="View All"
          backGroundColor="bg-blue-950"
          textColor="text-white text-base font-bold font-roboto"
          type="button"
        />
         <Button
          text="Learn More"
          backGroundColor="bg-slate-500/30"
          textColor="text-white text-base font-bold font-roboto"
          type="button"
        />
      </div>
  </div>

  <div className=" flex flex-row gap-3 w-fit  mt-6">
        {filteredEvents.slice(startIndex, endIndex).map((event, index) => (
          <VirtualEventsCard key ={index} event={event} />
        ))}
      </div>
</div>

    

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default VirtualEventCard;

// Helper functions to extract unique countries and event types
function getUniqueCountries(events: ExhibitionData[]) {
  return Array.from(new Set(events.map((event) => event.country)));
}

function getUniqueEventTypes(events: ExhibitionData[]) {
  return Array.from(new Set(events.map((event) => event.eventType)));
}
