import { DotFilledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";

interface dataProps {
  Image: string;
  Title: string;
  Message: string;
  time: string;
}

const data = [
  {
    Image:
      "https://images.unsplash.com/photo-1698864273184-41cf2052196b?auto=format&fit=crop&q=80&w=2680&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Title: "Luso Art Galley",
    Message: "You have been added as a partner to the Luso next event",
    time: "13 min ago",
  },
];

function NotificationMessages() {
  return (
    <div>
      {data.map((messages, index) => (
        <div key ={index} className=" cursor-pointer">
          <div className="flex flex-row gap-5 py-5 items-center">
            <div>
              <DotFilledIcon className="text-blue-500 w-5 h-5" />
            </div>

            <Image
              width={100}
              height={100}
              src={messages.Image}
              alt="sender"
              className="rounded-full w-12 h-12 "
            />

            <div className="space-y-2 w-60 lg:w-full">
              <p className="text-amber-500 font-medium">{messages.Title}</p>
              <p className="text-xs text-stone-600">{messages.Message}</p>
              <p className="text-xs text-stone-500">
                Received message - {messages.time}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationMessages;
