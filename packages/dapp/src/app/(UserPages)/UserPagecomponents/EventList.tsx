"use client";
import React from "react";
import { EventData } from "../../../../types";
import EventCard from "./EventCard";

interface EventListProps {
  events: EventData[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div className="relative flex flex-row gap-4 w-full group">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
