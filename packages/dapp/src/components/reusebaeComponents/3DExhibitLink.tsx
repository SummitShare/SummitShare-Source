import Image from "next/image";
import Link from "next/link";
import React from "react";

function ExhibitLink() {
  return (
    <Link
      href={""}
      className="bg-white/25 w-[190px] h-fit rounded-xl flex flex-col gap-2 shadow-md p-1 cursor-pointer"
    >
      <div className="w-full h-[125px]  bg-gradient-to-tr from-orange-500 to-orange-300  rounded-xl" />
      <div className="title-h4-slate space-y-2 px-2 pb-2">
        <div className="text-sm">Headrest</div>
        <div className="text-sm text-orange-500">Julia Chikamoneka</div>
        <div className="body-text-h5 ">(1910 - 1986)</div>
      </div>
    </Link>
  );
}

export default ExhibitLink;
