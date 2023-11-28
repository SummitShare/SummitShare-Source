import HelpCard from "@/components/reusebaeComponents/HelpCard";
import Link from "next/link";
import React from "react";

function HelpCardList() {
  return (
    <div className="space-y-5 w-full">
      <div className="flex flex-row w-full justify-between items-center">
        <p className="title-h4-slate">SummitShare 101</p>
        <Link
          href={""}
          className="w-fit h-fit py-2 px-4 bg-slate-100 rounded-xl body-title-h4 text-slate-950"
        >
          Learn more
        </Link>
      </div>
      <div className="flex flex-row gap-2">
        <HelpCard />
        <HelpCard />
        <HelpCard />
        <HelpCard />
      </div>
    </div>
  );
}

export default HelpCardList;
