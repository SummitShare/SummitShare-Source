"use client";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import useRecentExhibits from '@/lib/useGetRecentExhibits';
import Image from 'next/image';
import Button from '@/components/reusebaeComponents/button';


//TODO: replace the image with the actual image from the exhibitNFT
function HeroTwo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const exhibits = useRecentExhibits();

  const router = useRouter();

  const prevIndex = () => {
    setCurrentIndex(oldIndex => oldIndex === 0 ? exhibits.length - 1 : oldIndex - 1);
  };

  const nextIndex = () => {
    setCurrentIndex(oldIndex => oldIndex === exhibits.length - 1 ? 0 : oldIndex + 1);
  };

  return (
    <div className="px-8 w-full h-full flex flex-col group relative justify-top items=top">
      {exhibits && exhibits.map((exhibit, index) => (

        < div key={index} className={`relative duration-500 ${index === currentIndex ? 'block' : 'hidden'}`}>
          <div className=" text-center md:flex md:flex-row lg:gap-10 lg:px-10 w-full">
            <div className="bg-red-300 rounded-xl w-full lg:w-[480px] lg:h-[480px] flex-shrink-0">
              <Image
                className=" lg:w-[480px] lg:h-[480px] rounded-xl"
                src="https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650963860604-LGJSBAWOMLQIU9ZXUK1K/all-women.71ba3487f51cab4dc38a.png?format=2500w"
                alt=""
                width={480}
                height={480}
              />
            </div>
            <div className="flex flex-col gap-5 items-center justify-center text-left ">
              <div className="space-y-2  flex flex-col w-full">
                <p className="title-h2-slate tracking-tighter">{exhibit.name}</p>
                <p className="body-text-h4">{exhibit.details}</p>
              </div>
              <div className="flex flex-row w-full gap-2 justify-start">
                <Button
                  text="Buy Ticket"
                  type="button"
                  backGroundColor=" bg-red-500"
                  textColor="text-white"
                  click={() => router.push(`/Profile/Ticket/${exhibit.exhibit.id}`)}
                />
                <Button
                  text="Biography"
                  type="button"
                  backGroundColor="bg-slate-100"
                  textColor="text-slate-950"
                  borderColor="border-none"
                  click={() => router.push(`/Profile/Exibition/${exhibit.exhibit.id}`)}
                />
              </div>
            </div>
          </div>
        </div>
      ))
      }
      <div
        className="absolute left-0 top-[50%] w-10 h-10 flex justify-center items-center bg-slate-950/80 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
        onClick={prevIndex}
      >
        <ChevronLeftIcon className="w-5 h-5 text-white" />
      </div>
      <div
        className="absolute right-8 top-[50%] w-10 h-10 flex justify-center items-center bg-slate-950/80 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
        onClick={nextIndex}
      >
        <ChevronRightIcon className="w-5 h-5 text-white" />
      </div>
    </div >
  );
}

export default HeroTwo;