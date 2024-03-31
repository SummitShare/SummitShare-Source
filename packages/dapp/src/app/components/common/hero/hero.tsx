/**
 * Hero Component
 *
 * This component is designed as a showcase feature for recent exhibits, primarily used on the homepage or
 * prominent sections of a gallery or museum website. It dynamically fetches and displays recent exhibits using
 * a custom hook, `useRecentExhibits`, providing users with a visually engaging overview of what's currently
 * available or featured. Navigation buttons allow users to cycle through the exhibits, enhancing interactivity.
 *
 * Features:
 * - Dynamic exhibit fetching through a custom hook, `useRecentExhibits`.
 * - Carousel-like navigation to cycle through fetched exhibits.
 * - Utilizes Next.js's `useRouter` for navigation, enabling programmatic routing to exhibit details.
 * - Stylish presentation with background images and overlay effects for readability.
 * - Responsive design for an optimal viewing experience across devices.
 *
 * The component makes use of Tailwind CSS for styling, ensuring consistency and responsiveness. The Hero component
 * aims to captivate users' attention immediately upon visiting the site, offering them a glimpse into the exhibits
 * with options to explore further or purchase tickets.
 */

// React and Next.js hooks, and other imports
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Corrected import path for useRouter hook
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ButtonBlack from "../button/buttonBlack";
import ButtonWhite from "../button/buttonTrasparent";
import useRecentExhibits from "@/lib/useGetRecentExhibits";

// Hero component function
function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0); // State for the current exhibit index
  const exhibits = useRecentExhibits(); // Custom hook to fetch recent exhibits data
  const router = useRouter(); // useRouter hook for navigation

  // Handlers for navigating through exhibits
  const prevIndex = () =>
    setCurrentIndex((oldIndex) =>
      oldIndex === 0 ? exhibits.length - 1 : oldIndex - 1
    );
  const nextIndex = () =>
    setCurrentIndex((oldIndex) =>
      oldIndex === exhibits.length - 1 ? 0 : oldIndex + 1
    );

  return (
    <div className="relative h-[400px] md:h-[600px] bg-gray-100 rounded-2xl">
      {exhibits &&
        exhibits.map((exhibit, index) => (
          <div
            key={index}
            className={`flex justify-center items-end w-full md:h-[600px] h-[400px] rounded-2xl p-6 bg-[url('https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFydHxlbnwwfHwwfHx8MA%3D%3D')] bg-cover bg-center ${
              index === currentIndex ? "block" : "hidden"
            }`}
          >
            <div className="bg-gray-950/25 absolute inset-0 rounded-2xl"></div>
            <div className="bg-gray-50/25 backdrop-blur-md rounded-xl w-[100%] h-fit p-6 space-y-6 md:w-[30%] md:absolute md:right-10 md:top-[30%]">
              <div className="space-y-2 min-h-20">
                <h1 className="text-xl font-semibold text-gray-50">
                  {exhibit.name}
                </h1>
                <p className="text-sm text-gray-50/80">{exhibit.details}</p>
              </div>
              <div className="flex flex-row gap-2">
                <ButtonBlack
                  width="w-full"
                  text="text-base"
                  click={() =>
                    router.push(`/event/ticket/${exhibit.exhibit.id}`)
                  }
                >
                  Purchase
                </ButtonBlack>
                <ButtonWhite width="w-full" text="text-base">
                  Biography
                </ButtonWhite>
              </div>
            </div>
          </div>
        ))}
      <div
        className="absolute -left-4 top-[50%] w-9 h-9 flex justify-center items-center bg-gray-950/80 rounded-full cursor-pointer transition-all"
        onClick={prevIndex}
        aria-label="Previous exhibit"
      >
        <ChevronLeftIcon className="w-3 text-gray-50" />
      </div>
      <div
        className="absolute -right-4 top-[50%] w-9 h-9 flex justify-center items-center bg-gray-950/80 rounded-full cursor-pointer transition-all"
        onClick={nextIndex}
        aria-label="Next exhibit"
      >
        <ChevronRightIcon className="w-3 text-gray-50" />
      </div>
    </div>
  );
}

export default Hero;
