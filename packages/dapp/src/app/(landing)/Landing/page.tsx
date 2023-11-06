"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { DotFilledIcon } from "@radix-ui/react-icons";

import React, { useState } from "react";

import LandingExhibitions from "./components/LandingExhibitions";
import ShortAbout from "./components/ShortAbout";

interface Component {
  (): JSX.Element;
}

const Components: Component[] = [ShortAbout, LandingExhibitions];

function Landing() {
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
    <div className="relative w-full h-full flex flex-col items-center  ">
      <div className="duration-500">{Components[currentIndex]()}</div>
      <div
        onClick={pervIndex}
        className="fixed top-[50%] left-5 w-12 h-12 bg-stone-950/90  rounded-full flex justify-center items-center cursor-pointer "
      >
        <ChevronLeftIcon className="w-6 h-6 text-white" />
      </div>
      <div
        onClick={nextIndex}
        className="fixed top-[50%] right-5  w-12 h-12 bg-stone-950/90 rounded-full flex justify-center items-center cursor-pointer"
      >
        <ChevronRightIcon className="w-6 h-6 text-white" />
      </div>
      <div className=" fixed bottom-3 flex-row flex bg-stone-100/90 px-3 py-2 rounded-full">
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
    </div>
  );
}

export default Landing;
