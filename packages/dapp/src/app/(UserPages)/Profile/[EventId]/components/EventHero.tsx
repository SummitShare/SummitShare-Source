import React from "react";

function EventHero() {
  return (
    <div className="space-y-6 text-left lg:text-center lg:flex lg:flex-row lg:gap-10">
      <div className="bg-slate-200 rounded-xl w-full h-[310px] lg:w-[800px] lg:h-[480px] "></div>
      <div className=" flex flex-col gap-5 lg:items-center lg:justify-center lg:text-left">
        <div className="space-y-2">
          <p className="text-xl font-semibold">Lusaka Art Gallery</p>
          <div className="flex flex-row gap-2 text-xs items-center">
            <div className="w-6 h-6 rounded-full bg-slate-100"></div>
            <p>Admin Name</p>
          </div>
          <p className="text-sm text-slate-500">
            Lorem ipsum dolor sit amet consectetur. Porttitor bibendum et cras
            interdum faucibus quis tortor sagittis orci. Libero gravida
            parturient ultrices non leo integer senectus urna auctor. Est
            viverra cras se.
          </p>
        </div>

        <div className="flex flex-row w-full justify-start gap-2 lg:justify-start"></div>
      </div>
    </div>
  );
}

export default EventHero;
