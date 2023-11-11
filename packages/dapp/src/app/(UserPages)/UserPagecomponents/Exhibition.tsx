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
      "https://images.unsplash.com/photo-1699009435420-756b3649564f?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$80",
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
      "https://images.unsplash.com/photo-1699009435420-756b3649564f?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$80",
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
      "https://images.unsplash.com/photo-1699009435420-756b3649564f?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$80",
  },
  {
    name: "Event 14",
    country: "Mexico",
    eventType: "Seminar",
    eventDescription: "Mexican tech seminar.",
    image:
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto.format&fit=crop&q=80&w=2160&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$70",
  },
  {
    name: "Event 15",
    country: "Argentina",
    eventType: "Conference",
    eventDescription: "Argentinian tech conference.",
    image:
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80&w=2160&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$130",
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
    <div className="container mx-auto p-4 space-y-10">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <CountryFilter
            onCountryChange={setSelectedCountry}
            uniqueCountries={getUniqueCountries(dummyData)}
          />
          <EventTypeFilter
            onEventTypeChange={setSelectedEventType}
            uniqueEventTypes={getUniqueEventTypes(dummyData)}
          />
        </div>
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
