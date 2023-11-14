import EventHero from "@/app/(UserPages)/Profile/Ticket/[EventIdTickets]/components/EventHero";

import OtherEvents from "@/app/(UserPages)/Profile/Ticket/[EventIdTickets]/components/OtherEvents";
import PreviousEvents from "@/app/(UserPages)/Profile/Ticket/[EventIdTickets]/components/PreviousEvents";

import React from "react";
import EventInfo from "./components/ExbitionEventInfo";

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
