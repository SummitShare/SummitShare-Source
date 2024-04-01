/**
 * ProductsContainer Component
 *
 * This component serves as a dynamic container for displaying a filtered list of event products. It incorporates
 * several interactive elements including date filters, country, and event type selectors, along with a pagination
 * control. The component showcases events based on user-selected filters, enhancing the browsing experience.
 *
 * Features:
 * - Dynamic event filtering based on selected criteria such as date, country, and event type.
 * - Pagination controls for navigating through filtered event results.
 * - Utilizes custom components like `DateFilter`, `SelectType`, and `ProductCard` for a cohesive UI.
 * - Responsive design adapts to different screen sizes, ensuring a smooth user experience across devices.
 *
 * The component leverages React hooks for state management and effectful operations, such as fetching event data
 * and applying filter criteria. It demonstrates a practical application of conditional rendering and array manipulation
 * in React to achieve a complex yet intuitive UI pattern.
 *
 * Implementation Notes:
 * - Ensure the `useSelector` hook correctly fetches state from the Redux store.
 * - The dummy data array `dummyData` is used to simulate fetching events from an external source.
 * - Helper functions `getUniqueCountries` and `getUniqueEventTypes` are used to dynamically generate filter options.
 */

"use client";
import React, { useState, useEffect } from "react";
import DateFilter from "../functonal/datePicker/dateFilter";
import { useSelector } from "react-redux";
import PaginationControls from "../functonal/pagination/pagination";
import SelectType from "../functonal/selectType/selectType";
import ProductCard from "../productCards/productCard";
import { RootState } from "@/redux/store";
import { EventData } from "@/utils/dev/frontEndInterfaces";

const dummyData: EventData[] = [
  {
    name: "Mountain View",
    date: "2024.05.15",
    country: "Swiss",
    price: "Free",
    eventType: "Nature Photography",
    image:
      "https://images.unsplash.com/photo-1574367157590-3454fe866961?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "City Lights",
    date: "2024.06.20",
    country: "america",
    price: "$200",
    eventType: "Urban Photography",
    image:
      "https://images.unsplash.com/photo-1637680298164-74342b63a61a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Seaside Sunrise",
    date: "2024.09.10",
    country: "Maldives",
    price: "$150",
    eventType: "Landscape Photography",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Forest Trail",
    date: "2024.08.05",
    country: "Amazon",
    price: "Free",
    eventType: "Wildlife Photography",
    image:
      "https://images.unsplash.com/photo-1621886292650-520f76c747d6?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Night Sky",
    date: "2024.01.15",
    country: "Sahara ",
    price: "$300",
    eventType: "Astrophotography",
    image:
      "https://images.unsplash.com/photo-1534235826754-0a3572d1d6d5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Architecture",
    date: "2024.12.30",
    country: "Rome",
    price: "Free",
    eventType: "Cultural Photography",
    image:
      "https://images.unsplash.com/photo-1526285849717-482456cd7436?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const ProductsContainer: React.FC = () => {
  const eventType = useSelector((state: RootState) => state.select.eventType);
  const eventCountry = useSelector(
    (state: RootState) => state.select.eventCountryType
  );
  const [activeTab, setActiveTab] = useState<
    "today" | "week" | "month" | "year"
  >("year");

  const [currentPage, setCurrentPage] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>(dummyData);
  const [recordsPerPage, setRecordsPerPage] = useState(2);

  // Helper function to determine the number of records based on window width
  const calculateRecordsPerPage = () => {
    if (window.innerWidth > 768) {
      // Assuming 768px is the breakpoint for mobile devices
      return 6; // Number of items for PC
    } else {
      return 2; // Number of items for mobile
    }
  };
  useEffect(() => {
    // Function to update the state based on window width
    const handleResize = () => {
      setRecordsPerPage(calculateRecordsPerPage());
    };

    // Set initial state based on current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Filter logic inside useEffect which will run when dependencies change
    const filtered = dummyData.filter((event) => {
      setCurrentPage(0);
      // Filtering by country
      if (eventCountry && event.country !== eventCountry) {
        return false;
      }
      // Filtering by event eventType
      if (eventType && event.eventType !== eventType) {
        return false;
      }

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
  }, [eventType, eventCountry, activeTab]);

  const totalPages = Math.ceil(filteredEvents.length / recordsPerPage);
  const startIndex = currentPage * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2">
        <p className="text-xl font-semibold text-gray-950">
          Upcoming Exhibitions
        </p>
        <p className="text-sm text-gray-700">
          Explore upcoming exhibitions with ease! Filter by country, date, and
          event to find exactly what you're looking for!
        </p>
      </div>

      <div className="space-y-3 w-full md:flex md:flex-row md:justify-between md:space-y-0">
        <div className="md:w-[40%]">
          <DateFilter activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex flex-row gap-2 md:w-[40%]">
          <SelectType
            first="Select Country"
            options={getUniqueCountries(dummyData)}
            type="eventCountryType"
          />
          <SelectType
            first="Select Type"
            options={getUniqueEventeventTypes(dummyData)}
            type="eventType"
          />
        </div>
      </div>

      <div className="  w-full flex justify-between items-center h-[260px] ">
        {filteredEvents.slice(startIndex, endIndex).map((event, index) => (
          <ProductCard
            key={index}
            author={"mario jere"}
            title={event.name}
            price={event.price}
            detailOne="Date"
            valueOne={event.date}
            detailTwo="Location"
            valueTwo={event.country}
            // image={event.image}
          />
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

export default ProductsContainer;

// Helper functions to extract unique countries and event eventTypes
function getUniqueCountries(events: EventData[]) {
  return Array.from(new Set(events.map((event) => event.country)));
}

function getUniqueEventeventTypes(events: EventData[]) {
  return Array.from(new Set(events.map((event) => event.eventType)));
}
