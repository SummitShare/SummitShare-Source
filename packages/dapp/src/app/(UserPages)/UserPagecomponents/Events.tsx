import React from "react";
import SelectorCountry from "../../../ComponentsToBeEdited/SelectorCountry";
import SelectorEvents from "../../../ComponentsToBeEdited/SelectorEvent";
import TabsMenu from "../../../ComponentsToBeEdited/EventsSection";
import TicketCard from "../../../ComponentsToBeEdited/TicketCard";

function Events() {
  return (
    <div className="space-y-5 w-full">
      <div className="space-y-5 w-full  ">
        <div className="  relative">
          <div className="sm:block hidden">
            <TabsMenu />
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
