import React from "react";

export const fetchEvents = async () => {
  const res = await fetch(
    "https://64f61e582b07270f705e2c89.mockapi.io/eventData",
    {
      cache: "no-cache",
      next: {
        tags: ["eventData"],
      },
    }
  );
  const vent: EventsData[] = await res.json();
};
