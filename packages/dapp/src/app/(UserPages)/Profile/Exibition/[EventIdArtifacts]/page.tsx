import React from "react";
import EventInfo from "./components/ExbitionEventInfo";
import EventHero from "./components/EventHero";
import OtherEvents from "./components/OtherEvents";
import PreviousEvents from "./components/PreviousEvents";

function Event() {


  return (
    <div className="space-y-10">
      <EventHero />
      <EventInfo />
      <PreviousEvents />
      <OtherEvents />
    </div>
  );
}

export default Event;
