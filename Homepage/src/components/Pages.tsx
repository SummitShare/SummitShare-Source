import React, { useState } from "react";
import Ticket from "./tickets";
import { SavedData } from "./SaveData";
import { Test } from "./EventsForm";

interface FormData {
  id: number;
  eventName: string;
  eventDate: number;
  eventTime: number;
  eventLocation: string;
  ticketCost: string;
  walletOne: string;
  walletTwo: string;
  split: number;
}

const Pages = () => {
  return (
    <>
      <Test />
    </>
  );
};

export default Pages;
