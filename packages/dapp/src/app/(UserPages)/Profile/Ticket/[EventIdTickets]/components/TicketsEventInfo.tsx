'use client'
import Button from "@/components/reusebaeComponents/button";
import useExhibit from "@/lib/useGetExhibitById";
import {
  CalendarDaysIcon,
  CurrencyDollarIcon,
  MapIcon,
  MapPinIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { ClockIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";





function EventInfo() {
    const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split('/').pop() as string;
  const exhibit = useExhibit(id);
  return (
    <div className="space-y-5">
      <div className="flex flex-row justify-between w-full ">
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="font-poppins text-2xl text-blue-950 font-bold">Expressing the word with color </p>
      
              <p className="font-opensans text-blue-950  w-[500px]">{exhibit?.exhibitDetails[0].details}</p>
          </div>

          <div className="  space-y-2 text-slate-700">
            <div className="flex flex-row gap-2 items-center font-light font-opensans font-light font-opensans">
              <MapPinIcon className="w-[16px] h-164px] text-blue-950" />{" "}
              Lusaka,Zambia
            </div>
            <div className="flex flex-row gap-2 items-center font-light font-opensans">
              <CalendarDaysIcon className="w-[16px] h-164px] text-blue-950" />{" "}
              16.12.2023.CAT
            </div>
            <div className="flex flex-row gap-2 items-center font-light font-opensans">
              <ClockIcon className="w-[16px] h-164px] text-blue-950" /> 1:00PM
              - 5:00PM
            </div>
            <div className="flex flex-row gap-2 items-center font-light font-opensans">
              <WalletIcon className="w-[16px] h-164px] text-blue-950" />{" "}
              $100
            </div>
          </div>

          <Button
            text=" Punches"
            type="button"
            backGroundColor="bg-blue-950 "
            textColor="font-roboto font-semibold text-white"
          ></Button>
        </div>
        <div className="flex flex-row gap-2 w-full justify-end">
          <div className="w-[300px] h-[300px] bg-slate-100 rounded-xl">
           <Image
                className="rounded-xl w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                width={480}
                height={480}
                quality={100} // {number 1-100}
                priority={true} // {false} | {true}
                style={{ objectFit: 'cover' }} // Add this line
              />
          </div>
          <div className="w-[300px] h-[300px] bg-slate-100 rounded-xl">
 <Image
                className="rounded-xl w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2545&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                width={480}
                height={480}
                quality={100} // {number 1-100}
                priority={true} // {false} | {true}
                style={{ objectFit: 'cover' }} // Add this line
              />
          </div>
           
        </div>
      </div>
    </div>
  );
}

export default EventInfo;
