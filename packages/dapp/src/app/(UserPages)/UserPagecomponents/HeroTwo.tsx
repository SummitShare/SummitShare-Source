"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { DotFilledIcon } from "@radix-ui/react-icons";

import React, { useState } from "react";

import Hero from "./Hero";

interface Component {
  (): JSX.Element;
}

const Components: Component[] = [Hero, Hero, Hero, Hero];

function HeroTwo() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const pervIndex = () => {
    const currentSlide = currentIndex === 0;
    const nextSlide = currentSlide ? Components.length - 1 : currentIndex - 1;
    setCurrentIndex(nextSlide);
  };
  const nextIndex = () => {
    const lastSlide = currentIndex === Components.length - 1;
    const nextSlide = lastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(nextSlide);
  };

  // const intervalId = setInterval(nextIndex, 5000);

  return (
    <div className=" w-full h-full flex flex-col  group ">
      <div className="relative duration-500 pb-10 ">
        {Components[currentIndex]()}
      </div>
      {/* <div
        onClick={pervIndex}
        className="absolute top-[50%] left-2 w-10 h-10 bg-stone-950/80  rounded-full flex justify-center items-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all "
      >
        <ChevronLeftIcon className="w-5 h-5 text-white" />
      </div> */}
      {/* <div
        onClick={nextIndex}
        className="absolute top-[50%] right-2  w-10 h-10 bg-stone-950/80  rounded-full flex justify-center items-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronRightIcon className="w-5 h-5 text-white" />
      </div> */}
      {/* <div className="w-full flex flex-row justify-center">
        <div className=" absolute bottom-3 flex-row flex bg-stone-100 px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all">
          {Components.map((slide, slideIndex) => (
            <div onClick={() => setCurrentIndex(slideIndex)} key={slideIndex}>
              <DotFilledIcon
                className={` cursor-pointer ${
                  currentIndex === slideIndex
                    ? `text-amber-500`
                    : `text-stone-500`
                }`}
              />
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default HeroTwo;
