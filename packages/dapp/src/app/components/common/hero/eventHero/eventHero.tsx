/**
 * EventHero Component
 *
 * The EventHero component is designed to display a detailed hero section for a specific exhibit. It leverages the
 * useExhibit custom hook to fetch exhibit details based on an exhibit ID extracted from the current URL path.
 * This component is a key feature for exhibit detail pages, providing users with a visually engaging overview of
 * the exhibit alongside options to explore further or make purchases.
 *
 * Features:
 * - Dynamic exhibit detail fetching based on URL path.
 * - Responsive and visually striking design with a full-width background image and overlay effect for text readability.
 * - Use of ButtonBlack and ButtonWhite components for actions such as purchasing tickets or exploring more about the exhibit.
 * - Integration with Next.js's useRouter and usePathname hooks for navigation and path management.
 *
 * The component is styled using Tailwind CSS for a cohesive and responsive design. The overlay and backdrop blur effects
 * are applied to ensure that the text remains legible against the background image. The EventHero aims to captivate
 * users' attention immediately, offering them a glimpse into the exhibit's details with options to engage further.
 */

// Importing React hooks and components
"use client";
import React from "react";
import ButtonBlack from "../../button/buttonBlack";
import ButtonWhite from "../../button/buttonWhite";
import { usePathname, useRouter } from "next/navigation";
import useExhibit from "@/lib/useGetExhibitById";

function EventHero() {
  const pathname = usePathname();
  const id = pathname.split("/").pop() as string; // Extracting exhibit ID from URL path
  const exhibit = useExhibit(id); // Fetching exhibit details using custom hook

  return (
    <div className="relative">
      <div className="flex justify-center items-end w-full h-[500px] rounded-2xl p-6 bg-[url('https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFydHxlbnwwfHwwfHx8MA%3D%3D')] bg-cover bg-center">
        {/* Overlay for styling */}
        <div className="bg-gray-950/25 absolute inset-0 rounded-2xl"></div>
        {/* Exhibit details container */}
        <div className="bg-gray-50/25 backdrop-blur-md rounded-xl w-[100%] h-fit p-6 space-y-6 md:w-[30%] md:absolute md:right-10 md:top-[30%]">
          {/* Exhibit title and details */}
          <div className="space-y-2 min-h-20">
            <h1 className="text-xl font-semibold text-gray-50">
              {exhibit?.exhibitDetails[0].name}
            </h1>
            <p className="text-sm text-gray-50/80">
              {exhibit?.exhibitDetails[0].details}
            </p>
          </div>
          {/* Action buttons */}
          <div className="flex flex-row gap-2">
            <ButtonBlack width="w-full" text="text-base">
              Purchase
            </ButtonBlack>
            <ButtonWhite width="w-full" text="text-base">
              Biography
            </ButtonWhite>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventHero;
