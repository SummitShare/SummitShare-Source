import React from "react";
import SelectorCountry from "./SelectorCountry";
import SelectorEvents from "./SelectorEvent";
import TabsMenu from "./TabsMenu";
import TicketCard from "./TicketCard";

function Events() {
  return (
    <div className="space-y-5">
      <div className="space-y-5 w-full  ">
        <div className="w-full flex-row  ">
          <p className="text-xl font-semibold">Event Tickets</p>
        </div>

        <div className="flex flex-row justify-between ">
          <div className="sm:block hidden">
            <TabsMenu />
          </div>
          <div className="flex flex-row  gap-2">
            <SelectorCountry />
            <SelectorEvents />
          </div>
        </div>
        <div className="lg:hidden">
          <TabsMenu />
        </div>
      </div>
    </div>
  );
}

export default Events;
