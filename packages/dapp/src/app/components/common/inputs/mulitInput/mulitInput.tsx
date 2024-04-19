// Import statements
"use client";
import React, { use, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Box from "../../containers/box/box";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Input } from "@/app/components/ui/input";
import { proposals } from "@prisma/client";
import { useSession } from "next-auth/react";
import { ExtendedUser } from "next-auth";



// Define the structure of the email list
type EmailArray = string[];

// Interface for the proposal part of the form
interface IProposal {
  event_name: string; // Make event_name required as it's critical for form submission
  event_type?: string;
  event_category?: string;
  event_start_time?: Date;
  event_end_time?: Date;
  symbol?: string;
  event_timezone?: string;
  event_location?: string;
  description?: string;
  contract_address?: string;
  cost?: number;
  total_number_tickets?: number;
}

// Interface for the entire form's data model
interface RequestProps {
  user_id:string
  proposal: IProposal;
  emailsArray: EmailArray;
}

const EventRequest: React.FC = () => {
  const session = useSession();
  const { handleSubmit, register, reset, getValues } = useForm<RequestProps>();
  const [emails, setEmails] = useState<EmailArray>([]);

  const handleAddEmail = () => {
    const emailToAdd: any  | undefined = getValues("emailsArray"); // Specify that this is a string from the form
    if (emailToAdd && !emails.includes(emailToAdd)) {
      setEmails((currentEmails) => [...currentEmails, emailToAdd]);
      // Since `emails` is not a directly registered input in react-hook-form, we manage it via state
    }
  };  

  const sendData = async ({ emailsArray, proposal, user_id }: RequestProps) => {
    const host = process.env.NEXT_PUBLIC_HOST;
    const url = `${host}/api/v1/proposal`;  // Ensure correct URL formation

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailsArray, proposal, user_id }),
      });

      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      return response.json();
    } catch (error) {
      console.error("Failed to post request:", error);
    }
  };

  const onSubmit: SubmitHandler<RequestProps> = async (formData) => {
    const user_id = session.data?.user.id || '';  // Ensuring user_id is never undefined
    const { proposal } = formData;
    const event_name= proposal.event_name
    await sendData({ emailsArray: emails, proposal:{event_name}, user_id });
    console.log({ emailArray: emails, proposal:{event_name}, user_id })
    reset();
    setEmails([]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Box>
        <Input
          placeholder="Event Name"
          {...register("proposal.event_name", { required: "Event name is required" })}
        />
        <div className="flex flex-row gap-2">
          <Input
            placeholder="name@gmail.com"
            {...register("emailsArray")}
          />
          <button
            type="button"
            onClick={handleAddEmail}
            className="px-3 py-2 hover:bg-orange-500 ring-1 ring-orange-500 text-orange-500 hover:text-white rounded-md"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        {emails.length > 0 && (
          <div className="mt-4">
            {emails.map((email, index) => (
              <div key={index} className="flex justify-between items-center text-sm py-2">
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
