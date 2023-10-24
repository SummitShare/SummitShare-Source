import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";

interface TableProps {
  name: string;
  rowNames: string[];
  dataRows: string[][];
  gridColumnString: string;
  style?: string; // Change the prop type to a number
}

function Table({
  name,
  rowNames,
  dataRows,
  gridColumnString,
  style,
}: TableProps) {
  // Create a string for the number of columns based on the grid prop

  return (
    <div className="px-6">
      {/* Mobile View */}
      <section className="lg:hidden">
        <div className="mt-24 bg-white rounded-t-xl">
          {/* Header */}
          <div className="flex flex-row border-b border-gray-100 px-6 py-4 justify-between">
            <p className="text-xl font-semibold">{name}</p>
            <div className="flex flex-row gap-10">
              <ChevronLeftIcon className="w-6 h-6" />
              <ChevronRightIcon className="w-6 h-6" />
            </div>
          </div>
          {/* Event Details */}

          <div className="flex flex-col gap-4 border-b border-gray-100 py-4 px-6">
            <div className="flex flex-row justify-between">
              <div className="space-y-2 text-gray-500 text-sm font-medium">
                {rowNames.map((rowName, index) => (
                  <p key={index}>{rowName}</p>
                ))}
              </div>

              {dataRows.map((rowData, rowIndex) => (
                <div
                  className="space-y-2 text-right text-sm font-medium"
                  key={rowIndex}
                >
                  {rowData.map((data, dataIndex) => (
                    <p key={dataIndex}>{data}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Desktop View */}
      <section className="hidden sm:block ">
        <div className="flex  justify-center items-center ml-[220px]">
          <div className="mt-24 bg-white rounded-t-xl w-fit ">
            {/* Header */}
            <div className="flex flex-row border-b border-gray-100 px-6 py-4 justify-between">
              <p className="text-xl font-semibold">{name}</p>
              <div className="flex flex-row gap-5">
                <ChevronLeftIcon className="w-6 h-6" />
                <ChevronRightIcon className="w-6 h-6" />
              </div>
            </div>
            {/* Event Details (table format) */}
            <div className={`flex flex-col border-b border-gray-100 `}>
              {/* Row Names */}
              <div
                className={`grid ${gridColumnString} text-gray-500 gap-5 font-medium  border-b border-gray-100 justify-between w-full text-sm px-3 py-2`}
              >
                {rowNames.map((rowName, index) => (
                  <p key={index}>{rowName}</p>
                ))}
              </div>

              {/* Data Rows */}
              <div>
                {dataRows.map((rowData, rowIndex) => (
                  <div
                    className={`grid ${gridColumnString} gap-5 items-center text-xs hover:bg-lime-100 px-3 py-2`}
                    key={rowIndex}
                  >
                    {rowData.map((data, dataIndex) => (
                      <p key={dataIndex}>{data}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Table;
