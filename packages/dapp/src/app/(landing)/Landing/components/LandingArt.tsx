import TicketCard from "@/ComponentsToBeEdited/TicketCard";
import Button from "@/reusebaeComponents/button";
import Image from "next/image";
import React from "react";
import LoginImg from "/public/login.png";
import oneImg from "/public/1.png";
import twoImg from "/public/2.png";
import threeImg from "/public/3.png";
import fourImg from "/public/4.png";
import fiveImg from "/public/5.png";

function LandingArt() {
  return (
    <div className="grid grid-rows-2 gap-5 lg:flex-row md:flex-row  h-full w-full items-center  py-20  px-10">
      <div className="grid grid-cols-7 gap-[16px]">
        <div className="col-start-2 col-span-2 rounded-lg self-end relative group w-fit h-fit ">
          <div className=" rounded-lg shadow-md">
            <Image className="" src={oneImg} alt="one" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg opacity-100 transition-opacity ">
            {/* This is the overlay */}
          </div>
        </div>
        <div className="col-start-4 col-span-2 rounded-lg self-end relative group w-fit h-fit">
          <div className=" rounded-lg shadow-md">
            <Image className="" src={twoImg} alt="two" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg opacity-100 transition-opacity ">
            {/* This is the overlay */}
          </div>
        </div>
        <div className="col-start-1 col-span-2 rounded-lg self-start relative group w-fit h-fit">
          <div className=" rounded-lg shadow-md">
            <Image className="" src={threeImg} alt="three" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg opacity-100 transition-opacity ">
            {/* This is the overlay */}
          </div>
        </div>
        <div className="col-start-3 col-span-2 rounded-lg self-start relative group w-fit h-fit">
          <div className=" rounded-lg shadow-md">
            <Image className="" src={fourImg} alt="four" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg opacity-100 transition-opacity ">
            {/* This is the overlay */}
          </div>
        </div>
        <div className="col-start-5 col-span-2 rounded-lg self-start relative group w-fit h-fit">
          <div className=" rounded-lg shadow-md">
            <Image className="" src={fiveImg} alt="five" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg opacity-100 transition-opacity ">
            {/* This is the overlay */}
          </div>
        </div>
      </div>

      <div className="text-center text-4xl font-bold flex flex-col justify-center items-center gap-5">
        <div className="space-y-2">
          <p className="text-lime-950">Discover new art works</p>
          <p className="text-lime-950 text-base font-medium">
            View new and old are by upcoming and popular artist while learning
            the story behind each artwork in a curated fashion{" "}
          </p>
        </div>
        <Button
          text="Explore"
          type="button"
          backGroundColor="bg-lime-950"
          textColor="text-lime-50"
        />
      </div>
    </div>
  );
}

export default LandingArt;
