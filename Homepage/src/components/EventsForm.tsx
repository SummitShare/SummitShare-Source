import React, { useState } from "react";
import Ticket from "./tickets";
import { SavedData } from "./SaveData";

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

export function Test() {
  const [formData, setFormData] = useState<FormData>({
    id: 1,
    eventName: "",
    eventDate: 0,
    eventTime: 0,
    eventLocation: "",
    ticketCost: "",
    walletOne: "",
    walletTwo: "",
    split: 0,
  });
  const [dataArray, setDataArray] = useState<FormData[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData) {
      const newDataArray = [...dataArray, { ...formData }];
      setDataArray(newDataArray);
      setFormData({
        id: formData.id + 1,
        eventName: "",
        eventDate: 0,
        eventTime: 0,
        eventLocation: "",
        ticketCost: "",
        walletOne: "",
        walletTwo: "",
        split: 0,
      });
    }
  };

  const handleSaveEdit = (itemId: number, editedData: FormData) => {
    const updatedArray = dataArray.map((item) =>
      item.id === itemId ? { ...item, ...editedData } : item
    );
    setDataArray(updatedArray);
  };

  return (
    <div>
      <h1>Input Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>event Name:</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>event location:</label>
          <input
            type="text"
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>event date:</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>event time:</label>
          <input
            type="time"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleChange}
          />
          <div>
            <label>ticket Cost:</label>
            <input
              type="number"
              name="ticketCost"
              value={formData.ticketCost}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>wallet one:</label>
            <input
              type="text"
              name="walletOne"
              value={formData.walletOne}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>walletTwo:</label>
            <input
              type="text"
              name="walletTwo"
              value={formData.walletTwo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>split:</label>
            <input
              type="text"
              name="split"
              value={formData.split}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      <SavedData dataArray={dataArray} onSaveEdit={handleSaveEdit} />
      <Ticket dataArray={dataArray} />
    </div>
  );
}
