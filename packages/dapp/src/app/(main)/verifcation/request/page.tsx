import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className=" w-full flex items-center justify-center fixed inset-0 bg-gray-50 z-20 ">
      <div className="flex flex-col gap-6 items-center justify-center  ">
        <h1 className="text-3xl text-gray-950 ">
          Summit<span className="text-orange-500">Share</span>
        </h1>
        <div className=" flex flex-col gap-4 items-center justify-center">
          <div className=" w-[80%] text-center  md:w-fit">
            <p className="text-xs text-gray-700">
              You have been invited by Mariomaguyasjere@gmail.com to join{" "}
            </p>
          </div>

          <h1 className="text-xl font-bold text-gray-950">
            Jacks crypto party
          </h1>
        </div>
      </div>
      <div className="space-y-3 ring-1 ring-gray-300 rounded-md py-3 px-4 fixed bottom-5 right-5 left-5  md:right-5 md:left-[60%] ">
        <p className="text-sm text-gray-700">
          This invitation is currently valid choose to accept or decline now
        </p>
        <div className="flex flex-row gap-2 ">
          <Link href={"/"}>
            <button className="ring-1 ring-gray-300 rounded-md px-3 py-2 text-xs">
              accept
            </button>
          </Link>
          <Link href={"/"}>
            <button className="ring-1 ring-gray-300 rounded-md px-3 py-2 text-xs">
              decline
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
