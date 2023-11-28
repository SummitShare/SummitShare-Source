"use client";
import React, { useState, useEffect } from "react";

import CountryFilter from "@/app/(UserPages)/UserPagecomponents/Filters/CountryFilter";
import EventTypeFilter from "@/app/(UserPages)/UserPagecomponents/Filters/EventTypeFilter";
import PaginationControls from "@/app/(UserPages)/UserPagecomponents/Filters/Pagination";
import VirtualEventsCard from "@/components/reusebaeComponents/VirtualEventsCard";

export interface ExhibitionData {
  name: string;
  country: string;
  eventType: string;

  image: string;
  price: string;
}

const dummyData: ExhibitionData[] = [
  {
    name: "Greenery",
    country: "Location 1",
    price: "$100",
    eventType: "Type 1",
    image:
      "https://images.unsplash.com/photo-1677070542698-164b6126d0de?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      <div className="space-y-2">
        <p className="title-h4-slate">Virtual Exhibitions</p>
        <p className="body-text-h4">
          Explore virtual exhibitions with ease! Filter by country and type{" "}
          <br />
          below to find exactly what you're looking for
        </p>
      </div>
      <div className="flex flex-row justify-between ">
        <CountryFilter
          onCountryChange={setSelectedCountry}
          uniqueCountries={getUniqueCountries(dummyData)}
        />
        <EventTypeFilter
          onEventTypeChange={setSelectedEventType}
          uniqueEventTypes={getUniqueEventTypes(dummyData)}
        />
      </div>

      <div className="relative flex flex-row gap-3 w-full group mt-6">
        {filteredEvents.slice(startIndex, endIndex).map((event) => (
          <VirtualEventsCard event={event} />
        ))}
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
