import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import NotificationMessages from "./NotificationMessages";

const data = { TotalNotifications: 4 };

function NotificationCard() {
  return (
    <div className="fixed bottom-0 inset-x-0 lg:inset-x-auto  lg:top-20 lg:right-5 flex flex-col h-fit bg-stone-100 rounded-t-[34px]  px-5 py-10 gap-5 lg:w-fit  lg:rounded-xl z-30">
      {/* <XMarkIcon className="absolute top-14 right-8 w-6 h-6 text-stone-950" /> */}
      <div>
        <p className="text-2xl font-semibold text-stone-950">Notifications</p>
        <p className="text-sm text-stone-500">
          you have{" "}
          <span className="text-amber-500">
            {data.TotalNotifications} Notifications{" "}
          </span>
        </p>
      </div>
      <div>
        <NotificationMessages />
      </div>
    </div>
  );
}

export default NotificationCard;
