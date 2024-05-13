'use client'
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

export const  Banner = () => {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`w-full inset-0 flex relative justify-center bg-green-500 text-sm text-gray-50 underline  ${
        open === false ? "hidden" : "bock"
      }`}
    >
      Donate and help us support more counties{" "}
      <XMarkIcon
        onClick={() => {
          setOpen(!open);
        }}
        className="absolute right-5 top-[2px] w-4 "
      />
    </div>
  );
}
