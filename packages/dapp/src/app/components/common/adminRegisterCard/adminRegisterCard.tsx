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

import ButtonTransparent from "../button/buttonTrasparent"; // Import custom transparent button component
import ButtonWhite from "../button/buttonWhite"; // Import custom white button component

// Defines the AdminRegisterCard functional component
function AdminRegisterCard() {
  // Component render function
  return (
    // Container with styling for rounded corners, padding, and orange background
    <div className="w-full rounded-xl p-6 space-y-6 bg-orange-500 md:p-10 md:py-20">
      {/* Text container with styling for bold and large text */}
      <div className="text-2xl font-bold text-gray-50 w-full">
        Interested In Uploading?
        <br />
        {/* Subtext with reduced opacity for differentiation */}
        <span className="text-gray-100/50">Sign up to become an Exhibitor</span>
      </div>
      {/* Button container with a gap for spacing */}
      <div className="w-full flex gap-2">
        {/* White button for the "Sign Up" action */}
        <ButtonWhite text="Sign Up" width="w-fit">
          Sign Up
        </ButtonWhite>
        {/* Transparent button for the "Learn More" action */}
        <ButtonTransparent text="Sign Up" width="w-fit">
          Learn More
        </ButtonTransparent>
      </div>
    </div>
  );
}

// Exports the AdminRegisterCard component for use in other parts of the application
export default AdminRegisterCard;
