import React from "react";
import SelectorCountry from "../../../../../ComponentsToBeEdited/SelectorCountry";
import SelectorEvents from "../../../../../ComponentsToBeEdited/SelectorEvent";
import TabsMenu from "../../../../../ComponentsToBeEdited/TabsMenu";
import TicketCard from "../../../../../ComponentsToBeEdited/TicketCard";

function PreviousEvents() {
  return (
    <div className="space-y-5">
      <div className="space-y-5 w-full  ">
        <div className="w-full flex-row  ">
          <p className="text-xl font-semibold">Our Events</p>
        </div>
        <div>
          <TicketCard />
        </div>
      </div>
    </div>
  );
}

export default PreviousEvents;
