import React from "react";
import SelectorCountry from "./SelectorCountry";
import SelectorEvents from "./SelectorEvent";
import TabsMenu from "./TabsMenu";
import TicketCard from "./TicketCard";

function OtherEvents() {
  return (
    <div className="space-y-5">
      <div className="space-y-5 w-full  ">
        <div className="w-full flex-row  ">
          <p className="text-xl font-semibold">You Might Be Interested in</p>
        </div>
        <div>
          <TicketCard />
        </div>
      </div>
    </div>
  );
}

export default OtherEvents;
