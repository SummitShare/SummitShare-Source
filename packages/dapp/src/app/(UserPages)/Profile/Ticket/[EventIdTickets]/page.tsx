import EventHero from "@/app/(UserPages)/Profile/Ticket/[EventIdTickets]/components/EventHero";
import EventInfo from "@/app/(UserPages)/Profile/Ticket/[EventIdTickets]/components/TicketsEventInfo";

import OtherEvents from "@/app/(UserPages)/Profile/Ticket/[EventIdTickets]/components/OtherEvents";


import React from "react";
import AdminSignUpCard from "@/app/(UserPages)/UserPagecomponents/AdminSignUpCard";


function Event() {

  return (
    <div className="space-y-10 pt-8 pb-20">
      <EventHero />
      <EventInfo />
            <AdminSignUpCard />
 
      <OtherEvents />
    </div>
  );
}

export default Event;
