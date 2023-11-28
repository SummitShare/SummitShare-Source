"use client";
import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface CountryFilterProps {
  onCountryChange: (country: string) => void;
  uniqueCountries: string[];
}

const CountryFilter: React.FC<CountryFilterProps> = ({
  onCountryChange,
  uniqueCountries,
}) => {
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countryValue, setCountryValue] = useState("Select a country");

  const handleCountyOpen = () => {
    setIsCountryOpen(!isCountryOpen);
  };

  const handleCountryChange = (country: string) => {
    onCountryChange(country);
    setCountryValue(country);
    setIsCountryOpen(false);
  };

  return (
    <div>
      <div className="relative space-y-2">
        <button
          onClick={handleCountyOpen}
          className="w-48 h-10 rounded-xl  border flex flex-row justify-between items-center gap-2 body-text-h4 shadow-sm px-3  bg-white "
        >
          <p className="text-slate-950">{countryValue}</p>
          <ChevronDownIcon className="w-3 h-3" />
        </button>
        {isCountryOpen && (
          <ul className="absolute  w-48 h-fit rounded-xl border-slate-100 border flex flex-col  items-start gap-1 shadow-md px-3 py-2 body-text-h4 z-30 bg-white ">
            {/* <li
              onClick={() => handleCountryChange({})}
              className="hover:bg-slate-50 w-full p-1 rounded-sm cursor-pointer"
              key="all"
            >
              All
            </li> */}
            {uniqueCountries.map((country) => (
              <li
                onClick={() => handleCountryChange(country)}
                className="hover:bg-slate-50 w-full px-2 py-2 rounded-md cursor-pointer text-slate-950"
                key={country}
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

export default CountryFilter;
