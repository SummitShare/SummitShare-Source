"use client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

// Define the interface for the event type
interface IEventType {
  name: string;
}

interface SelectComponentProps {
  options: IEventType[];
  placeholder?: string;
  width?: string;
  value?: string;
  onChange: (value: string) => void;
}

function SelectComponent({
  options,
  placeholder = "Select a Type",
  width = "w-48",
  value,
  onChange,
}: SelectComponentProps) {
  const [eventTypeValue, setEventTypeValue] = useState(placeholder);

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const handleTypeOpen = () => {
    setIsTypeOpen(!isTypeOpen);
  };
  const handleEventTypeChange = (eventType: IEventType) => {
    onChange(eventType.name);
    setEventTypeValue(eventType.name);
  };
  return (
    <div>
      <div className="relative space-y-2">
        <button
          onClick={handleTypeOpen}
          className={`${width} h-10 rounded-xl border flex flex-row justify-between items-center gap-2 shadow-sm px-3 bg-white body-text-h4`}
        >
          <p className="text-slate-950">{eventTypeValue}</p>
          <ChevronDownIcon className="w-3 h-3" />
        </button>
        {isTypeOpen && (
          <ul
            className={`absolute ${width} h-fit rounded-xl border flex flex-col items-start gap-1 shadow-md px-3 py-2 z-30 bg-white body-text-h4`}
          >
            {options.map((eventType, index) => (
              <li
                onClick={() => handleEventTypeChange(eventType)}
                className="hover:bg-slate-50 w-full px-2 py-2 rounded-md cursor-pointer text-slate-950"
                key={index}
              >
                {eventType.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SelectComponent;

