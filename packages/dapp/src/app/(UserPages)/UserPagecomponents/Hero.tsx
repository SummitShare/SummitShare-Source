import Button from "@/reusebaeComponents/button";
import { Content } from "next/font/google";
import Image from "next/image";
import React from "react";
import heroImage from "/public/scrollerhero.avif";

interface content {
  header: string;
  text: string;
  buttonOne: string;
  buttonTwo?: string;
  image: string;
}

const data = {
  textHeader: "Women’s History Museum",
  bodyText: ` Those who walked before us and those to come. Those who wore red clay masks and rested their heads on bended knees. Those who washed the cowry bead and swung the snuff cup.Those who weaved the baskets and wrapped the cloth. Those who fought for peace and danced to the drum.`,
  buttonOneData: "Ticket",
  buttonTwoData: "Biography",
  image: heroImage,
};

function Hero() {
  return (
    <div className="space-y-6 text-center lg:flex lg:flex-row lg:gap-10">
      <div className="bg-slate-200 rounded-xl w-full h-[310px] lg:w-[480px] lg:h-[480px] ">
        <Image
          className="w-full h-full rounded-xl"
          src={data.image}
          alt=""
        ></Image>
      </div>
      <div className=" flex flex-col gap-5 lg:items-center lg:justify-center lg:text-left">
        <div className="space-y-2 w-[600px]">
          <p className="title-h2-slate">{data.textHeader}</p>
          <p className="body-text-h4">{data.bodyText}</p>
        </div>
        <div className="flex flex-row w-full justify-center gap-2 lg:justify-start">
          <Button
            text={data.buttonOneData}
            type="button"
            backGroundColor=" bg-gradient-to-r from-orange-500 to-orange-400"
            textColor="text-white"
          ></Button>
          <Button
            text={data.buttonTwoData}
            type="button"
            backGroundColor="bg-slate-100"
            textColor="text-slate-950"
            borderColor="border-none"
          ></Button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
