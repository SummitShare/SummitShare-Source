
import EventHero from "@/app/(UserPages)/Profile/[EventId]/components/EventHero";
import EventInfo from "@/app/(UserPages)/Profile/[EventId]/components/EventInfo";
import Events from "@/app/(UserPages)/UserPagecomponents/Events";
import OtherEvents from "@/app/(UserPages)/Profile/[EventId]/components/OtherEvents";
import PreviousEvents from "@/app/(UserPages)/Profile/[EventId]/components/PreviousEvents";


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
