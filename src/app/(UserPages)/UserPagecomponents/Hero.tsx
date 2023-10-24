import React from "react";

function Hero() {
  return (
    <div className="space-y-6 text-center lg:flex lg:flex-row lg:gap-10">
      <div className="bg-slate-200 rounded-xl w-full h-[310px] lg:w-[800px] lg:h-[480px] "></div>
      <div className=" flex flex-col gap-5 lg:items-center lg:justify-center lg:text-left">
        <div className="space-y-2">
          <p className="text-xl font-semibold">Women’s History Museum</p>
          <p className="text-sm text-slate-500">
            Lorem ipsum dolor sit amet consectetur. Porttitor bibendum et cras
            interdum faucibus quis tortor sagittis orci. Libero gravida
            parturient ultrices non leo integer senectus urna auctor. Est
            viverra cras se.
          </p>
        </div>
        <div className="flex flex-row w-full justify-center gap-2 lg:justify-start">
          <button className="bg-slate-950 text-slate-50 font-medium rounded-xl w-[100px] h-fit px-4 py-2 ">
            Ticket
          </button>
          <button className="bg-slate-200 font-medium rounded-xl text-slate-950 w-fit h-fit px-4 py-2 ">
            Biography
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
