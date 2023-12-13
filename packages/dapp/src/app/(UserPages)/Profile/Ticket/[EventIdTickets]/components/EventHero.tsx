"use client";
import Button from "@/components/reusebaeComponents/button";
import React from "react";
import { useRouter, usePathname } from 'next/navigation';
import useExhibit from "@/lib/useGetExhibitById";
import Image from 'next/image';

function EventHero() {

  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split('/').pop() as string;
  const exhibit = useExhibit(id);

  console.log(exhibit?.exhibitDetails[0]);

  return (
    <div className="w-full h-fit flex flex-col group relative justify-top items=top">
      < div  className={`relative duration-500  h-[600px] w-full`}>
          

      <Image
                className="rounded-xl w-full h-full object-cover"
                src="https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1553622184666-CI6FIQ660SKJO67HZQVO/sitefrontpage1.jpg?format=2500w"
                alt=""
                width={480}
                height={480}
                quality={100} // {number 1-100}
                priority={true} // {false} | {true}
                style={{ objectFit: 'cover' }} // Add this line
              />
         <div className=" absolute top-[25%] right-[10%] flex flex-col gap-5 items-center justify-center text-left backdrop-blur-sm bg-white/10 rounded-xl  p-6 w-fit shadow-md ">
              <div className="space-y-2  flex flex-col w-full">
                <p className="text-2xl font-bold text-white">{exhibit?.exhibitDetails[0].name}</p>
                {/* <p className="open-sans font-light text-slate-50">{exhibit.details}</p> */}
                  <p className="open-sans font-light text-slate-200 w-[500px]">         {exhibit?.exhibitDetails[0].details}</p>
              </div>
              <div className="flex flex-row w-full gap-2 justify-start">
                <Button
                  text="Purchases Ticket"
                  type="button"
                  backGroundColor=" bg-white"
                  textColor="text-slate-950 font-semibold open-sans"
                  // click={() => router.push(`/Profile/Ticket/${exhibit.exhibit.id}`)}
                />
                <Button
                  text="Biography"
                  type="button"
                  backGroundColor="backdrop-blur-sm bg-white/5 "
                  textColor="text-white open-sans font-semibold"
                  borderColor="border-none"
                  // click={() => router.push(`/Profile/Exibition/${exhibit.exhibit.id}`)}
                />
               
              </div>
                 <div className="open-sans  text-slate-200 w-[500px] flex flex-row gap-2 items-center justify-start"><p className="open-sans">11.13.2023</p>
                  <div className="rounded-full w-[5px] h-[5px] bg-slate-200 "></div>
                  <p className="open-sans">100 - tickets</p></div>
            </div>

        <div className="flex flex-row w-full justify-start gap-2 lg:justify-start"></div>
      </div>
    </div>
  );
}

export default EventHero;
