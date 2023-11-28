"use client";
import Button from "@/components/reusebaeComponents/button";
import { useRouter, usePathname } from 'next/navigation';
import useExhibit from "@/lib/useGetExhibitById";
import React from "react";
import Image from 'next/image';


function EventHero() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split('/').pop() as string;
  const exhibit = useExhibit(id);

  console.log(exhibit?.exhibitDetails[0]);

  return (
    <div className="space-y-6 text-left lg:text-center lg:flex lg:flex-row lg:gap-10">

      <div className="flex-1 bg-slate-200 rounded-xl h-[310px] overflow-hidden max-w-[600px] ">
        <Image src="https://source.unsplash.com/random" alt="Random" layout="cover" width={600} height={310} />
      </div>
      <div className=" flex flex-col gap-5 lg:items-center lg:justify-center lg:text-left">
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="title-h2-orange">{exhibit?.exhibitDetails[0].name}</p>
            <div className="flex flex-row gap-2 body-text-h5 items-center">
              <div className="w-6 h-6 rounded-full bg-slate-100"></div>
              <p className="text-slate-950">Admin Name</p>
            </div>
            <p className="body-text-h4 ">
              {exhibit?.exhibitDetails[0].details}
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
