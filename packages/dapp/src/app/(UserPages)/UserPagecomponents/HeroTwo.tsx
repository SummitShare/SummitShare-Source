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
    <div className="w-full h-fit flex flex-col group relative justify-top items=top">
      {exhibits && exhibits.map((exhibit, index) => (

        < div key={index} className={`relative duration-500 ${index === currentIndex ? 'block' : 'hidden'} h-[600px] w-full`}>
          
              <Image
                className="rounded-xl w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=2509&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                width={480}
                height={480}
                quality={100} // {number 1-100}
                priority={true} // {false} | {true}
                style={{ objectFit: 'cover' }} // Add this line
              />
       
            <div className=" absolute top-[25%] right-[10%] flex flex-col gap-5 items-center justify-center text-left backdrop-blur-sm bg-white/10 rounded-xl  p-6 w-fit shadow-md ">
              <div className="space-y-2  flex flex-col w-full">
                <p className="text-2xl font-bold text-white">{exhibit.name}</p>
                {/* <p className="open-sans font-light text-slate-50">{exhibit.details}</p> */}
                  <p className="open-sans font-light text-slate-200 w-[500px]">{exhibit.details}</p>
              </div>
              <div className="flex flex-row w-full gap-2 justify-start">
                <Button
                  text="Purchases Ticket"
                  type="button"
                  backGroundColor=" bg-white"
                  textColor="text-slate-950 font-semibold open-sans"
                  click={() => router.push(`/Profile/Ticket/${exhibit.exhibit.id}`)}
                />
                <Button
                  text="Biography"
                  type="button"
                  backGroundColor="backdrop-blur-sm bg-white/5 "
                  textColor="text-white open-sans font-semibold"
                  borderColor="border-none"
                  click={() => router.push(`/Profile/Exibition/${exhibit.exhibit.id}`)}
                />
               
              </div>
                 <div className="open-sans  text-slate-200 w-[500px] flex flex-row gap-2 items-center justify-start"><p className="open-sans">11.13.2023</p>
                  <div className="rounded-full w-[5px] h-[5px] bg-slate-200 "></div>
                  <p className="open-sans">100 - tickets</p></div>
            </div>
        
        </div>
      ))
      }
      <div
        className="absolute left-[-15px] top-[50%] w-10 h-10 flex justify-center items-center bg-slate-950/80 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
        onClick={prevIndex}
      >
        <ChevronLeftIcon className="w-5 h-5 text-white" />
      </div>
      <div
        className="absolute right-[-15px] top-[50%] w-10 h-10 flex justify-center items-center bg-slate-950/80 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
        onClick={nextIndex}
      >
        <ChevronRightIcon className="w-5 h-5 text-white" />
      </div>
    </div >
  );
}

export default HeroTwo;
