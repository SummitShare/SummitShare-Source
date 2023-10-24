"use client";
import { addEventToDatabase } from "@/functonality/createEvent"; // Make sure the path is correct
import Button from "@/reusebaeComponents/button";
import Form from "@/reusebaeComponents/form";
import Inputs from "@/reusebaeComponents/inputs";

import Link from "next/link";
import { useForm } from "react-hook-form";

interface fromData {
  eventName: string;
  eventTime: string;
  eventLocation: string;
  ticketCost: string;
  ticketNo: string;
  discretion: string;
  eventDate: string;
}

function EventFormOne() {
  const form = useForm<fromData>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = (data: fromData) => {
    console.log("form submitted", data);
  };
  return (
    <div>
      <div>
        <Form
          title="Create a new event"
          // @ts-ignore
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          description=" fill in the inputs below to create a new event!"
          inputs={
            <div className="flex flex-row gap-8 ">
              <div className="space-y-2">
                <Inputs
                  text="The world museum"
                  length="[350px]"
                  label="Event Name"
                  name="eventName"
                  type="text"
                  id="eventName"
                  message="event name required!"
                  register={register}
                />
                <p className="text-xs text-red-500 font-light">
                  {errors.eventName?.message}
                </p>
                <Inputs
                  text="Lusaka,Zambia"
                  length="[350px]"
                  label="Event Location"
                  name="eventLocation"
                  type="text"
                  id="eventLocation"
                  message="event location required!"
                  register={register}
                />
                <p className="text-xs text-red-500 font-light">
                  {errors.eventLocation?.message}
                </p>
                <Inputs
                  text="0000.000Eth"
                  length="[350px]"
                  label="Ticket Cost"
                  name="ticketCost"
                  type="text"
                  id="ticketCost"
                  message="ticket cost required!"
                  register={register}
                />
                <p className="text-xs text-red-500 font-light">
                  {errors.ticketCost?.message}
                </p>
                <Inputs
                  text="Number"
                  length="[350px]"
                  label="Ticket N.o"
                  name="ticketNo"
                  type="text"
                  id="ticketNo"
                  message="ticketNo required!"
                  register={register}
                />
                <p className="text-xs text-red-500 font-light">
                  {errors.ticketNo?.message}
                </p>
              </div>
              <div className="space-y-2">
                <Inputs
                  length="[350px]"
                  label="Event Time"
                  name="eventTime"
                  type="time"
                  id="eventTime"
                  message="event time required!"
                  register={register}
                />
                <p className="text-xs text-red-500 font-light">
                  {errors.eventTime?.message}
                </p>
                <Inputs
                  length="[350px]"
                  label="Event Date"
                  name="eventDate"
                  type="date"
                  id="eventDate"
                  message="event date required!"
                  register={register}
                />
                <p className="text-xs text-red-500 font-light">
                  {errors.eventDate?.message}
                </p>
                <Inputs
                  text="Type..."
                  length="[350px]"
                  label="Discretion"
                  name="discretion"
                  type="text"
                  id="discretion"
                  message="discretion required!"
                  register={register}
                />
                <p className="text-xs text-red-500 font-light">
                  {errors.discretion?.message}
                </p>
              </div>
            </div>
          }
          submit={
            <div className="flex flex-row gap-2">
              <Button
                text="Next"
                type="submit"
                backGroundColor="slate-950"
                textColor="white"
              />
              <Button
                text="Cancel"
                type="button"
                textColor="slate-500"
                borderColor="slate-500"
              />
            </div>
          }
        />
      </div>
    </div>
  );
}

export default EventFormOne;
