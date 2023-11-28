"use client";
import Button from "@/components/reusebaeComponents/button";
import Form from "@/components/reusebaeComponents/form";
import LineInputs from "@/components/reusebaeComponents/LineInput";
import TextArea from "@/components/reusebaeComponents/textArea";
import { useForm } from "react-hook-form";

interface fromData {
  eventName: string;
  eventStartTime: string;
  eventEndTime: string;
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
              <div className="space-y-6">
                <LineInputs
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
                <LineInputs
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
                <LineInputs
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
                <LineInputs
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
                <TextArea
                  text="Type..."
                  length="full"
                  label="Discretion"
                  name="discretion"
                  id="discretion"
                  message="discretion required!"
                  register={register}
                />
                <p className="text-xs text-red-500 font-light">
                  {errors.discretion?.message}
                </p>
              </div>
              <div className="space-y-6">
                <LineInputs
                  length="[350px]"
                  label="Event Start Time"
                  name="eventStartTime"
                  type="time"
                  id="eventStartTime"
                  message="time required!"
                  register={register}
                />
                <p className="text-xs text-red-500 font-light">
                  {errors.eventStartTime?.message}
                </p>
                <LineInputs
                  length="[350px]"
                  label="Event End Time"
                  name="eventEndTime"
                  type="time"
                  id="eventEndTime"
                  message="time required!"
                  register={register}
                />
                <p className="text-xs text-red-500 font-light">
                  {errors.eventEndTime?.message}
                </p>
                <LineInputs
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
              </div>
            </div>
          }
          submit={
            <div className="flex flex-row gap-2">
              <Button
                text="Submit"
                type="submit"
                backGroundColor="bg-amber-500"
                textColor="text-white"
              />
            </div>
          }
        />
      </div>
    </div>
  );
}

export default EventFormOne;
