import { addEventToDatabase } from "@/app/functonality/createEvent"; // Make sure the path is correct
import Button from "@/reusebaeComponents/button";
import Form from "@/reusebaeComponents/form";
import Inputs from "@/reusebaeComponents/inputs";

import Link from "next/link";

function EventFormOne() {
  return (
    <div className="w-full h-full flex justify-center items-center fixed bg-gray-500/75">
      <div>
        <Form
          title="Create a new event"
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
                />
                <Inputs
                  text="Lusaka,Zambia"
                  length="[350px]"
                  label="Event Location"
                  name="eventLocation"
                  type="text"
                />
                <Inputs
                  text="0000.000Eth"
                  length="[350px]"
                  label="Ticket Cost"
                  name="ticketCost"
                  type="text"
                />
                <Inputs
                  text="Number"
                  length="[350px]"
                  label="Ticket N.o"
                  name="ticketNo"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <Inputs
                  length="[350px]"
                  label="Event Time"
                  name="eventTime"
                  type="time"
                />
                <Inputs
                  length="[350px]"
                  label="Event Date"
                  name="eventDate"
                  type="date"
                />
                <Inputs
                  text="Type..."
                  length="[350px]"
                  label="Discretion"
                  name="discretion"
                  type="text"
                />
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
