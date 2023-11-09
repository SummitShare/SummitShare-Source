// PaginationControls.tsx
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { DotFilledIcon } from "@radix-ui/react-icons";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generates an array of page numbers for rendering pagination controls
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index);

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`p-2 ${
          currentPage === 0
            ? "cursor-not-allowed text-gray-300"
            : "cursor-pointer"
        }`}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      <div className="bg-slate-100 rounded-full px-3 py-2 flex items-center justify-center w-fit h-fit">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={` ${
              currentPage === number
                ? "text-orange-500 font-semibold"
                : "text-slate-500"
            }`}
          >
            <DotFilledIcon className="w-4 h-4" />
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
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

export default PaginationControls;
