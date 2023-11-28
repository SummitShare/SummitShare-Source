"use client";
import Button from "@/components/reusebaeComponents/button";
import { useRouter } from "next/navigation";
import React from "react";

function EventHero() {
  const router = useRouter();

  console.log(router, "yourData");

  return (
    <div className="space-y-6 text-left lg:text-center lg:flex lg:flex-row lg:gap-10">
      <div className="bg-slate-200 rounded-xl w-full h-[310px] lg:w-[800px] lg:h-[480px] "></div>
      <div className=" flex flex-col gap-5 lg:items-center lg:justify-center lg:text-left">
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="title-h2-orange">Lusaka Art Gallery</p>
            <div className="flex flex-row gap-2 body-text-h5 items-center">
              <div className="w-6 h-6 rounded-full bg-slate-100"></div>
              <p className="text-slate-950">Admin Name</p>
            </div>
            <p className="body-text-h4 ">
              Lorem ipsum dolor sit amet consectetur. Porttitor bibendum et cras
              interdum faucibus quis tortor sagittis orci. Libero gravida
              parturient ultrices non leo integer senectus urna auctor. Est
              viverra cras se.
            </p>
          </div>

          <Button
            text=" Punches"
            type="button"
            backGroundColor="bg-gradient-to-r from-orange-500 to-orange-400"
            textColor="text-white"
          ></Button>
        </div>

        <div className="flex flex-row w-full justify-start gap-2 lg:justify-start"></div>
      </div>
    </div>
  );
}

export default EventHero;
