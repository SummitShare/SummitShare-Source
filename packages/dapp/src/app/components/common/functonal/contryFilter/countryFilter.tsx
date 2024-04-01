/**
 * CountryFilter Component
 *
 * This component is designed to provide a dropdown selection for filtering content by country in a React application.
 * It's built with TypeScript, ensuring type safety for props and state. The `CountryFilter` component allows users
 * to select a country from a provided list of unique countries, and it notifies the parent component of the selection
 * through a callback function.
 *
 * Features include a toggleable dropdown list, dynamically populated with countries, and state management for the
 * dropdown's open/closed status and the current country selection. It utilizes the `@heroicons/react` library for
 * a downward chevron icon, indicating the dropdown functionality.
 *
 * Props:
 * - `onCountryChange`: A callback function that is invoked when a country is selected, passing the selected country as an argument.
 * - `uniqueCountries`: An array of strings representing the unique countries available for selection.
 *
 * State:
 * - `isCountryOpen`: A boolean state determining the visibility of the dropdown list.
 * - `countryValue`: A string state holding the currently selected country or the placeholder text.
 */

"use client"; // Directive for React Server Components to indicate client-side execution

import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline"; // Import ChevronDownIcon from Heroicons
import { CountryFilterProps } from "@/utils/dev/frontEndInterfaces";

// Define the CountryFilter functional component with destructured props
const CountryFilter: React.FC<CountryFilterProps> = ({
  onCountryChange,
  uniqueCountries,
}) => {
  const [isCountryOpen, setIsCountryOpen] = useState(false); // State for managing dropdown visibility
  const [countryValue, setCountryValue] = useState("Select a country"); // State for selected country or default text

  // Function to toggle the dropdown list visibility
  const handleCountyOpen = () => {
    setIsCountryOpen(!isCountryOpen);
  };

  // Function to handle country selection
  const handleCountryChange = (country: string) => {
    onCountryChange(country); // Invoke callback with selected country
    setCountryValue(country); // Update the displayed country value
    setIsCountryOpen(false); // Close the dropdown list
  };

  // Component render function
  return (
    <div>
      <div className="relative space-y-2">
        {/* Dropdown button */}
        <button
          onClick={handleCountyOpen}
          className="w-48 h-10 rounded-xl border flex flex-row justify-between items-center gap-2 body-text-h4 shadow-sm px-3 bg-white"
        >
          <p className="text-slate-950">{countryValue}</p>{" "}
          {/* Displayed country value */}
          <ChevronDownIcon className="w-3 h-3" /> {/* Dropdown icon */}
        </button>
        {/* Dropdown list */}
        {isCountryOpen && (
          <ul className="absolute w-48 h-fit rounded-xl border-slate-100 border flex flex-col items-start gap-1 shadow-md px-3 py-2 body-text-h4 z-30 bg-white">
            {uniqueCountries.map((country) => (
              <li
                onClick={() => handleCountryChange(country)} // Country selection handler
                className="hover:bg-slate-50 w-full px-2 py-2 rounded-md cursor-pointer text-slate-950"
                key={country} // Unique key for React list
              >
                {country}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CountryFilter; // Exports the component for use elsewhere in the application
