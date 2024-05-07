/**
 * AdminRegisterCard Component
 *
 * This React component renders a registration card for administrative users, specifically aimed at exhibitors
 * interested in uploading content. The card features a vibrant, attention-grabbing design with options to either
 * sign up or learn more about becoming an exhibitor. It uses custom Button components to provide a unified and
 * accessible user interface.
 *
 * The component is styled with Tailwind CSS, utilizing utility classes to achieve a responsive and aesthetically
 * pleasing layout. The design includes a bold title, a subtitle with reduced opacity for contrast, and two button
 * options that align with the overall theme of the application.
 */

import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import ButtonTransparent from "../button/buttonTrasparent"; // Import custom transparent button component
import ButtonWhite from "../button/buttonWhite"; // Import custom white button component

// Defines the AdminRegisterCard functional component
function AdminRegisterCard() {
  // Component render function
  return (
    // Container with styling for rounded corners, padding, and orange background
    <div className="w-full rounded-xl p-6 space-y-6 bg-orange-500 md:p-10 md:py-20">
      {/* Text container with styling for bold and large text */}
      <div className="text-2xl font-bold text-gray-50 w-full space-y-2">
        <p> Interested In Uploading?</p>
        {/* Subtext with reduced opacity for differentiation */}
        <p className="text-gray-100/50">Sign up to become an Exhibitor</p>
      </div>
      {/* Button container with a gap for spacing */}
      <div className="w-full md:w-fit space-y-3 text-center md:text-left">
          <div className="relative w-full md:w-[400px] space-y-3">
            <input
              className="w-full h-10 focus:outline-none ring-1 ring-orange-300 focus:ring-orange-500 rounded-md py-[0.5rem] px-[0.8rem] transition-all input-autofill placeholder:text-gray-700 placeholder:text-[0.7rem] shadow-sm text-[0.7rem] text-gray-700"
              placeholder="Email"
            />
            {/* Search icon positioned inside the input field */}
         
          </div>
          <div className="w-full flex justify-right">
            <ButtonTransparent text="text-sm " width="w-fit">
              Submit
            </ButtonTransparent>
          </div>
        </div>
    </div>
  );
}

// Exports the AdminRegisterCard component for use in other parts of the application
export default AdminRegisterCard;
