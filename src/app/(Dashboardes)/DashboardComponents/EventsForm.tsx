import { addEventToDatabase } from "@/app/functonality/createEvent"; // Make sure the path is correct
import Link from "next/link";
import React from "react";

function EventsForm() {
  return (
    <div className="w-full h-full flex justify-center items-center fixed bg-gray-500/75">
      <div className="py-5 space-y-6 p-5 bg-white w-fit h-fit rounded-lg shadow-md">
        <div className="text-left">
          <h1 className="font-bold text-xl text-[#131212]">Add Events</h1>
          <p className="font-normal text-lg text-[#666666]">
            Let’s add a new event!
          </p>
        </div>
        <form action={addEventToDatabase} className="flex flex-col gap-6">
          <div className="flex flex-row gap-6">
            <div className="space-y-4">
              {/* Event Name */}
              <div className="space-y-2 flex flex-col">
                <label className="text-base font-medium" htmlFor="eventName">
                  Event Name
                </label>
                <input
                  className="w-[442px] h-[48px] pl-5 rounded-lg border caret-lime-500"
                  type="text"
                  name="eventName"
                  placeholder="Type the event name"
                />
              </div>

              {/* Event Time  */}
              <div className="space-y-2 flex flex-col">
                <label className="text-base font-medium" htmlFor="eventTime">
                  Event Time
                </label>
                <input
                  className="w-[442px] h-[48px] pl-5 rounded-lg border caret-lime-500 pr-4"
                  type="time"
                  name="eventTime"
                />
              </div>

              {/* Event Date*/}
              <div className="space-y-2 flex flex-col">
                <label className="text-base font-medium" htmlFor="eventDate">
                  Event Date
                </label>
                <input
                  className="w-[442px] h-[48px] pl-5 rounded-lg border caret-lime-500 pr-4"
                  type="date"
                  name="eventDate"
                />
              </div>

              {/* Event Description   */}
              <div className="space-y-2 flex flex-col">
                <label
                  className="text-base font-medium"
                  htmlFor="eventDescription"
                >
                  Event Description
                </label>
                <input
                  className="resize-y w-[442px] h-[48px] p-5 rounded-xl border caret-lime-500"
                  name="eventDescription"
                  placeholder="Type the event details"
                />
              </div>

              {/* Wallet RS2 */}
              <div className="space-y-2 flex flex-col">
                <label className="text-base font-medium" htmlFor="walletOne">
                  Wallet RS2
                </label>
                <input
                  className="w-[442px] h-[48px] pl-5 rounded-lg border caret-lime-500"
                  type="text"
                  name="walletOne"
                  placeholder="Wallet 1"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Wallet RS3 */}
              <div className="space-y-2 flex flex-col">
                <label className="text-base font-medium" htmlFor="walletTwo">
                  Wallet RS3
                </label>
                <input
                  className="w-[442px] h-[48px] pl-5 rounded-lg border caret-lime-500"
                  type="text"
                  name="walletTwo"
                  placeholder="Wallet 2"
                />
              </div>

              {/* Total Tickets */}
              <div className="space-y-2 flex flex-col">
                <label className="text-base font-medium" htmlFor="ticketNumber">
                  Total Tickets
                </label>
                <input
                  className="w-[442px] h-[48px] pl-5 rounded-lg border caret-lime-500"
                  type="text"
                  name="ticketNumber"
                  placeholder="100"
                />
              </div>

              {/* Split */}
              <div className="space-y-2 flex flex-col">
                <label className="text-base font-medium" htmlFor="split">
                  Split
                </label>
                <input
                  className="w-[442px] h-[48px] pl-5 rounded-lg border caret-lime-500"
                  type="text"
                  name="split"
                  placeholder="0%"
                />
              </div>

              {/* Cost of Ticket */}
              <div className="space-y-2 flex flex-col">
                <label className="text-base font-medium" htmlFor="price">
                  Price
                </label>
                <input
                  className="w-[442px] h-[48px] pl-5 rounded-lg border caret-lime-500"
                  type="number"
                  name="price"
                  placeholder="In Crypto"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <button
              type="submit"
              className="hover:bg-violet-700 flex flex-row gap-2 items-center justify-center bg-gradient-to-tr from-violet-500 to-violet-400 text-white px-5 py-3 text-xs rounded-full w-24"
            >
              Add
            </button>
            <Link
              href={"/EventCreatorDashboard/"}
              className="flex flex-row gap-2 items-center justify-center border border-gray-500 text-gray-500 px-5 py-3 text-xs rounded-full w-24"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventsForm;
