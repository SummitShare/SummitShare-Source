/**
 * This JavaScript file defines a React functional component named `page` that renders a simple, instructional UI.
 * The component is structured to display a two-step guide for users on how to connect their wallet, presumably to
 * a web application. It utilizes Tailwind CSS for styling, offering a clean and responsive design. The `ButtonOrange`
 * component imported at the top is used within the UI to present an interactive "Connect" button, demonstrating the
 * use of custom React components within a larger instructional layout. The primary goal of this component is to
 * provide users with clear, easy-to-follow steps for initiating a wallet connection, enhancing user experience with
 * visually appealing elements and straightforward guidance.
 */

// Importing necessary components and libraries
import ButtonOrange from "@/app/components/common/button/buttonOrange"; // Custom orange button component for UI consistency
import React from "react"; // React library import for creating functional components

// Definition of the `page` functional component
const page = () => {
  // The component returns JSX structure defining the UI
  return (
    // Container for the entire page content with vertical spacing
    <div className="w-full space-y-12 ">
      {/* Container for step one instructions with vertical spacing */}
      <div className="w-full space-y-6 ">
        {/* Container for the step one title and description */}
        <div className="space-y-2">
          {/* Step one title */}
          <h2 className="text-orange-500 text-lg font-medium">Step one:</h2>
          {/* Step one description */}
          <p className="text-gray-700">
            Click on the connect button on the top right of the nav bar.
          </p>
        </div>
        {/* Container for the 'Connect' button with styling */}
        <div className="flex items-center justify-center w-full ring-1 ring-gray-300 h-[300px] rounded-xl bg-gradient-to-br from-gray-950/10 to-gray-500/10 backdrop-blur-md ">
          {/* Custom 'Connect' button component */}
          <ButtonOrange text="text-base" width="w-fit">
            Connect
          </ButtonOrange>
        </div>
      </div>
      {/* Container for step two instructions with vertical spacing */}
      <div className="w-full space-y-6">
        {/* Container for the step two title and description */}
        <div className="space-y-2 ">
          {/* Step two title */}
          <h2 className="text-orange-500 text-lg font-medium">Step two:</h2>
          {/* Step two description */}
          <p className="text-gray-700">
            Confirm the connection with your wallet and start your journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page; // Exporting the `page` component for use in other parts of the application
