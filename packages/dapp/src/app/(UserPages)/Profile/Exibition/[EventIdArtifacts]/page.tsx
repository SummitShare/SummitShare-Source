import React from "react";
import EventHero from "../../Ticket/[EventIdTickets]/components/EventHero";
import EventInfo from "../../Ticket/[EventIdTickets]/components/TicketsEventInfo";
import AdminSignUpCard from "@/app/(UserPages)/UserPagecomponents/AdminSignUpCard";
import OtherEvents from "../../Ticket/[EventIdTickets]/components/OtherEvents";


function Event() {


  return (
    <div className="space-y-10 pt-12 pb-20">
      <EventHero />
      <EventInfo />
      <AdminSignUpCard />
      <OtherEvents />
    </div>
  );
}

export default Event;
