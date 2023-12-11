import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import EventsCardDb from "./eventsCardDb";

function EventsCarsSection() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-row justify-between">
        <p className="text-base font-medium">Upcoming Event</p>
        <div className="flex flex-row gap-2">
          <ChevronLeftIcon className="w-6 h-6 text-slate-950" />
          <ChevronRightIcon className="w-6 h-6 text-slate-950" />
        </div>
      </div>
      <div className="space-y-3">
        <EventsCardDb
          image={
            "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          title={"Maputo Art Gallery"}
          time={"9:00 AM - 5 PM"}
          date={"July 4th"}
          location={"Mozambique, Maputo"}
          description={
            "Designed and built with all the love in the world by the Bootstrap team with the help of our contributors."
          }
        />
        <EventsCardDb
          image={
            "https://images.unsplash.com/photo-1491566102020-21838225c3c8?q=80&w=2522&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          title={"Roma Museum"}
          time={"9:00 AM - 5 PM"}
          date={"July 4th"}
          location={"Mozambique, Maputo"}
          description={
            "Designed and built with all the love in the world by the Bootstrap team with the help of our contributors."
          }
        />
        <EventsCardDb
          image={
            "https://images.unsplash.com/photo-1528130723281-f9ffa133d787?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          title={"Top Self Art Gallery"}
          time={"9:00 AM - 5 PM"}
          date={"July 4th"}
          location={"Mozambique, Maputo"}
          description={
            "Designed and built with all the love in the world by the Bootstrap team with the help of our contributors."
          }
        />
        <EventsCardDb
          image={
            "https://images.unsplash.com/photo-1553775927-a071d5a6a39a?q=80&w=2587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          title={"Culture under the sun"}
          time={"9:00 AM - 5 PM"}
          date={"July 4th"}
          location={"Mozambique, Maputo"}
          description={
            "Designed and built with all the love in the world by the Bootstrap team with the help of our contributors."
          }
        />
      </div>
    </div>
  );
}

export default EventsCarsSection;
