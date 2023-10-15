import { addEventToDatabase } from "@/app/functonality/createEvent"; // Make sure the path is correct
import Link from "next/link";

function EventsForm() {
  return (
    <div className="w-full h-full flex justify-center items-center fixed bg-gray-500/75">
      <div className="py-5 space-y-6 p-5 bg-white w-fit h-fit rounded-lg shadow-md">
        <div className="text-left">
          <h1 className="font-bold text-xl text-[#131212]">Add Event!</h1>
          <p className="font-normal text-lg text-[#666666]">
            Let’s add a new event!
          </p>
        </div>

        <form action={addEventToDatabase} className="flex flex-col gap-5">
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
            </div>
            <div className="flex flex-row gap-6">
              <div className="flex flex-col gap-4">
                {/* Partner */}
                <div className="space-y-2 flex flex-col w-[442px]">
                  <label className="text-base font-medium" htmlFor="walletTwo">
                    Partner
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      className="w-32 h-[48px] pl-5 rounded-lg border caret-lime-500"
                      type="text"
                      name="user"
                      placeholder="User Name"
                    />
                    <input
                      className="w-full h-[48px] pl-5 rounded-lg border caret-lime-500"
                      type="text"
                      name="walletAddress"
                      placeholder="Wallet Address"
                    />
                    <input
                      className="w-20 h-[48px] pl-5 rounded-lg border caret-lime-500"
                      type="text"
                      name="split"
                      placeholder="Split"
                    />
                  </div>
                </div>

                {/* Total Tickets */}
                <div className="space-y-2 flex flex-col">
                  <label
                    className="text-base font-medium"
                    htmlFor="ticketNumber"
                  >
                    Total Tickets
                  </label>
                  <input
                    className="w-[442px] h-[48px] pl-5 rounded-lg border caret-lime-500"
                    type="text"
                    name="ticketNumber"
                    placeholder="100"
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
          </div>
          {/* Image */}

          <div className=" space-y-2 flex flex-col w-full">
            <div className="flex flex-row gap-4">
              <div className="flex flex-row gap-2">
                <div className="  w-40 h-40 relative rounded-xl border-2 border-dashed  ">
                  <p className=" absolute inset-0 text-slate-950 flex items-center justify-center">
                    Cover Photo
                  </p>
                  <input
                    className=" opacity-0 w-full h-full z-10"
                    type="file"
                    name="Image"
                  />
                </div>
                <div className="  w-40 h-40 relative rounded-xl border-2 border-dashed  ">
                  <p className=" absolute inset-0 text-slate-950 flex items-center justify-center">
                    Gallery Images
                  </p>
                  <input
                    className=" opacity-0 w-full h-full z-10"
                    type="file"
                    name="Image"
                  />
                </div>
              </div>
              {/* Event Description   */}
              <div className="space-y-2 flex flex-col w-full">
                <textarea
                  className="w-full h-full  rounded-xl border p-5 -pt-10 resize-none"
                  name="eventDescription"
                  placeholder="Type the event details"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <button
              type="submit"
              className="hover:bg-slate-700 flex flex-row gap-2 items-center justify-center bg-gradient-to-tr from-slate-500 to-slate-400 text-white px-5 py-3 text-xs rounded-xl w-24"
            >
              Add
            </button>
            <Link
              href={"/EventCreatorDashboard/"}
              className="flex flex-row gap-2 items-center justify-center border border-gray-500 text-gray-500 px-5 py-3 text-xs rounded-xl w-24"
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
