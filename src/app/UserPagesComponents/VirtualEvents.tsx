import React from "react";
import SelectorCountry from "./SelectorCountry";
import VirtualSelector from "./VirtualSelectorTypes";

import VirtualEventsCard from "./VirtualEventsCard";

export default function VirtualMuseum() {
  return (
    <div className="space-y-5">
      <div className="space-y-5 w-full ">
        <div className="space-y-2">
          <p className="text-xl font-semibold">Virtual museum</p>
        </div>
        <div className="flex flex-row justify-between">
          <SelectorCountry />
          <VirtualSelector />
        </div>
        <VirtualEventsCard />
      </div>
    </div>
  );
}
