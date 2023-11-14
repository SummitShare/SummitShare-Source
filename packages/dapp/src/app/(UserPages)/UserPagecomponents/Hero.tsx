import Button from "@/components/reusebaeComponents/button";
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
  image:
    "https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650963860604-LGJSBAWOMLQIU9ZXUK1K/all-women.71ba3487f51cab4dc38a.png?format=2500w",
};

function Hero() {
  return (
    <div className="space-y-6 text-center lg:flex lg:flex-row lg:gap-10 lg:px-10 w-full">
      <div className="bg-red-300 rounded-xl w-full lg:w-[480px] lg:h-[480px] ">
        <Image
          className=" lg:w-[480px] lg:h-[480px] rounded-xl"
          src={data.image}
          alt=""
          width={480}
          height={480}
        ></Image>
      </div>
      <div className=" flex flex-col gap-5 lg:items-center lg:justify-center lg:text-left ">
        <div className="space-y-2 w-[500px]">
          <p className="title-h2-slate">{data.textHeader}</p>
          <p className="body-text-h4">{data.bodyText}</p>
        </div>
        <div className="flex flex-row w-full justify-center gap-2 lg:justify-start">
          <Button
            text={data.buttonOneData}
            type="button"
            backGroundColor=" bg-red-500"
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
