import EventHero from "@/app/(UserPages)/Profile/Ticket/[EventIdTickets]/components/EventHero";
import EventInfo from "@/app/(UserPages)/Profile/Ticket/[EventIdTickets]/components/TicketsEventInfo";

import OtherEvents from "@/app/(UserPages)/Profile/Ticket/[EventIdTickets]/components/OtherEvents";
import PreviousEvents from "@/app/(UserPages)/Profile/Ticket/[EventIdTickets]/components/PreviousEvents";

import React from "react";
import AdminSignUpCard from "@/app/(UserPages)/UserPagecomponents/AdminSignUpCard";


function Event() {

  return (
    <div className="space-y-10">
      <EventHero />
      <EventInfo />
            <AdminSignUpCard />
      <PreviousEvents />
      <OtherEvents />
    </div>
  );
}

export default Event;
