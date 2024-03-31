/**
 * PaginationControls Component
 *
 * This component serves as a navigation aid for paginated content within a React application. It provides a set
 * of controls that allow the user to move between pages of content, including forward and backward buttons, along
 * with visual indicators for each page. The component is designed to be flexible, accommodating any total number
 * of pages, and dynamically updates based on the current page.
 *
 * Props:
 * - `currentPage`: The current page number (zero-based index).
 * - `totalPages`: The total number of pages available.
 * - `onPageChange`: A callback function that is called with the new page number whenever the user selects a different page.
 *
 * The component utilizes icons from the `@heroicons/react` and `@radix-ui/react-icons` libraries to provide intuitive
 * navigation cues. These include left and right chevrons for moving to the previous or next page, and filled dots
 * to represent individual pages.
 *
 * Styling is applied using Tailwind CSS, with conditional classes added to enhance usability, such as changing the
 * cursor style and text color to indicate when navigation options are unavailable (e.g., when the user is on the first
 * or last page).
 */

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"; // Navigation arrow icons
import { DotFilledIcon } from "@radix-ui/react-icons"; // Dot icon for page indicators

interface PaginationControlsProps {
  currentPage: number; // The current active page
  totalPages: number; // Total number of pages
  onPageChange: (page: number) => void; // Function to call when a new page is selected
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Create an array of page numbers for rendering page indicators
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index);

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Previous page button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0} // Disable if on the first page
        className={`p-2 ${
          currentPage === 0
            ? "cursor-not-allowed text-gray-300"
            : "cursor-pointer"
        }`}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Page indicators */}
      <div className="bg-gray-100 rounded-full px-3 py-2 flex items-center justify-center w-fit h-fit">
        {pageNumbers.map((number) => (
          <button
            key={number} // Unique key for React list
            onClick={() => onPageChange(number)} // Change page on click
            className={`${
              currentPage === number
                ? "text-orange-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            <DotFilledIcon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Next page button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1} // Disable if on the last page
        className={`p-2 ${
          currentPage === totalPages - 1
            ? "cursor-not-allowed text-gray-300"
            : "cursor-pointer"
        }`}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PaginationControls; // Exports the component for use elsewhere in the application
