import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className=" w-full flex items-center justify-center fixed inset-0 bg-gray-50 z-20 ">
      <div className="flex flex-col gap-6 items-center justify-center  ">
        <h1 className="text-3xl text-gray-950 ">
          Summit<span className="text-orange-500">Share</span>
        </h1>
        <div className=" w-[80%] text-center">
          <p className="text-sm text-gray-700">
            Your email has been verified successful welcome to our community
          </p>
        </div>
      </div>
      <div className="space-y-3 ring-1 ring-gray-300 rounded-md py-3 px-4 fixed bottom-5 right-5 left-5  md:right-5 md:left-[60%] ">
        <p className="text-sm text-gray-700">
          navigate to the home page and start your cultural adventure
        </p>
        <div>
          <Link href={"/"}>
            <button className="ring-1 ring-gray-300 rounded-md px-3 py-2 text-xs">
              navigate
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
