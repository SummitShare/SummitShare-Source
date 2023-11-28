import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Button from "./button";

function HelpCard() {
  return (
    <div className=" relative w-[300px] h-[300px] bg-blue-500 rounded-xl  pb-5 px-5 title-h4-slate ">
      <div className="w-full h-full"></div>
      <div className="absolute inset-0 bg-black/20 rounded-xl text-2xl font-semi-bold text-white flex  flex-col justify-end pl-5 pb-5 gap-2">
        <div>
          How To Connect
          <br /> Your Wallet
        </div>

        <button className="text-xs rounded-full font-normal text-slate-950 bg-white w-fit h-fit px-2 py-1 pr-3 flex flex-row gap-2 items-center">
          <ArrowUpRightIcon className="w-3 h-3" />
          Read
        </button>
      </div>
    </div>
  );
}

export default HelpCard;
