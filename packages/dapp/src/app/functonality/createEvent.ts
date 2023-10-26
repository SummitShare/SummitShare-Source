import { revalidateTag } from "next/cache";
import React from "react";

export const addEventToDatabase = async (e: FormData) => {
  "use server";
  const eventName = e.get("eventName")?.toString();
  const eventDescription = e.get("eventDescription")?.toString();
  const eventTime = e.get("eventTime")?.toString();
  const eventDate = e.get("eventDate")?.toString();
  const walletOne = e.get("walletOne")?.toString();
  const walletTwo = e.get("walletTwo")?.toString();
  const split = e.get("split")?.toString();
  const price = e.get("price")?.toString();
  const ticketNumber = e.get("ticketNumber")?.toString();

  console.log("worked");

  if (
    !eventName ||
    !eventDescription ||
    !eventTime ||
    !eventDate ||
    !walletOne ||
    !walletTwo ||
    !split ||
    !price ||
    !ticketNumber
  ) {
    return console.log("Missing required fields");
  }

  const newEvent = {
    eventName,
    eventDescription,
    eventTime,
    eventDate,
    walletOne,
    walletTwo,
    split,
    price,
    ticketNumber,
  };

  console.log(newEvent);

  try {
    const response = await fetch(
      "https://64e27840ab0037358819053b.mockapi.io/graph",
      {
        method: "POST",
        body: JSON.stringify(newEvent),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      console.log("Event added successfully");
      revalidateTag("eventData");
    } else {
      console.error("Error adding the event");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
