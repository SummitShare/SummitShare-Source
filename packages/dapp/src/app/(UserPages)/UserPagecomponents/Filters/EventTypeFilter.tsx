// EventTypeFilter.tsx
import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface EventTypeFilterProps {
  onEventTypeChange: (eventType: string) => void;
  uniqueEventTypes: string[];
}

const EventTypeFilter: React.FC<EventTypeFilterProps> = ({
  onEventTypeChange,
  uniqueEventTypes,
}) => {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [eventTypeValue, setEventTypeValue] = useState("Select a Type");

  const handleTypeOpen = () => {
    setIsTypeOpen(!isTypeOpen);
  };

  const handleEventTypeChange = (eventType: string) => {
    onEventTypeChange(eventType);
    setEventTypeValue(eventType);
    setIsTypeOpen(false);
  };

  return (
    <div>
      <div className="relative space-y-2">
        <button
          onClick={handleTypeOpen}
          className="w-48 h-10 rounded-xl border flex flex-row justify-between items-center gap-2  shadow-sm px-3  bg-white body-text-h4"
        >
          <p className="text-slate-950">{eventTypeValue}</p>
          <ChevronDownIcon className="w-3 h-3" />
        </button>
        {isTypeOpen && (
          <ul className="absolute  w-48 h-fit rounded-xl border flex flex-col  items-start gap-1 shadow-md px-3 py-2  z-30 bg-white body-text-h4">
            {/* <li
              onClick={() => handleEventTypeChange("")}
              className="hover:bg-slate-50 w-full p-1 rounded-sm cursor-pointer"
              key="all"
            >
              All
            </li> */}
            {uniqueEventTypes.map((eventType) => (
              <li
                onClick={() => handleEventTypeChange(eventType)}
                className="hover:bg-slate-50 w-full px-2 py-2 rounded-md cursor-pointer text-slate-950"
                key={eventType}
              >
                {eventType}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventTypeFilter;
