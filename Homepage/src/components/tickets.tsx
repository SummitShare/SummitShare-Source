import React, { useState } from "react";
import { Connect } from "./Connect";

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

interface TicketProps {
  dataArray: FormData[];
}

const Ticket = ({ dataArray }: TicketProps) => {
  const [buyTicket, setBuyTicket] = useState<number | null>(null); // Changed state type to number | null
  const handleBuyToggle = (eventId: number) => {
    if (buyTicket === eventId) {
      setBuyTicket(null);
    } else {
      setBuyTicket(eventId);
    }
  };

  return (
    <div>
      <h2> Ticket</h2>
      <ul>
        {dataArray.map((item) => (
          <div key={item.id}>
            <li>
              {item.eventName}, {item.eventLocation}, {item.eventTime},
              {item.eventDate}, {item.ticketCost}
            </li>
            <button onClick={() => handleBuyToggle(item.id)}>Buy Ticket</button>
            {buyTicket === item.id && <Connect />}{" "}
            {/* Render Connect component when buyTicket matches event id */}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Ticket;
