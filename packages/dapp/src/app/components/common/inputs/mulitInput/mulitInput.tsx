/**
 * EventRequest Component
 *
 * This component serves as a form for submitting event requests, allowing users to input an event name and
 * add multiple email addresses associated with the event. It utilizes `react-hook-form` for form handling,
 * including validation and submission. The component demonstrates a dynamic way to handle an array of email
 * addresses, allowing users to add emails individually to a list before form submission.
 *
 * Features:
 * - Utilizes `react-hook-form` for efficient form management.
 * - Dynamically adds email addresses to a list, providing visual feedback of the added emails.
 * - Validates and submits event name and associated email addresses as a consolidated object.
 * - Leverages the custom `Input` component for input fields, ensuring a consistent UI/UX.
 *
 * The form simplifies the process of collecting multiple emails by allowing users to add them one at a time,
 * and displays the current list of added emails. Upon submission, the event name along with the list of emails
 * is logged to the console, demonstrating how the data could be processed or sent to an API.
 *
 * Implementation Notes:
 * - The `handleAddEmail` function prevents the addition of empty or duplicate email addresses to the list.
 * - Form submission resets the input fields and the list of emails, readying the form for another submission.
 * - The `Box` component is used to wrap the form elements, providing a styled container.
 */

// Import statements
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Box from "../../containers/box/box";
import Input from "../input/input";

// Type definition for form fields
interface RequestProps {
  eventName: string;
  email: string; // For individual email input
}

const EventRequest: React.FC = () => {
  const { control, handleSubmit, register, reset, getValues } =
    useForm<RequestProps>();
  const [emails, setEmails] = useState<string[]>([]); // State to store the list of emails

  const handleAddEmail = () => {
    const emailToAdd = getValues("email");
    if (emailToAdd && !emails.includes(emailToAdd)) {
      setEmails((currentEmails) => [...currentEmails, emailToAdd]);
      reset({ eventName: getValues("eventName") }); // Reset only the email field, preserving eventName
    }
  };

  const onSubmit = (data: RequestProps) => {
    const requestData = {
      eventName: data.eventName,
      emailsArray: emails,
    };
    console.log(requestData);
    reset(); // Reset the form fields
    setEmails([]); // Clear the email list
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Box>
        <Input
          placeholder="Event Name"
          register={register}
          required
          name="eventName"
          message="Event name is required"
        />
        <div className="flex flex-row gap-2">
          <Input
            placeholder="name@gmail.com"
            register={register}
            required
            name="email"
          />
          <button
            type="button" // Prevent form submission on button click
            onClick={handleAddEmail}
            className="px-3 py-2 bg-gray-950 text-white rounded-md w-[20%] h-full"
          >
            Add
          </button>
        </div>
        {emails.length > 0 && (
          <div className="mt-4">
            {emails.map((email, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm py-2 h-10"
              >
                <p>{email}</p>
              </div>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="px-3 py-2 bg-orange-500 text-white rounded text-sm flex justify-center w-full mt-4"
        >
          Submit Event
        </button>
      </Box>
    </form>
  );
};

export default EventRequest;
