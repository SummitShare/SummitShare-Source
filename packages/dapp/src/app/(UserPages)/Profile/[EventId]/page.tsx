import EventHero from "@/app/UserPagesComponents/EventHero";
import EventInfo from "@/app/UserPagesComponents/EventInfo";
import Events from "@/app/UserPagesComponents/Events";
import OtherEvents from "@/app/UserPagesComponents/OtherEvents";
import PreviousEvents from "@/app/UserPagesComponents/PreviousEvents";

import React from "react";

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
