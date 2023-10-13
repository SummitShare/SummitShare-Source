import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";

function DashboardAdminFundDistribution() {
  return (
    <div className="px-6 w-fit">
      {/* Mobile View */}
      <section className="lg:hidden">
        <div className="mt-24 bg-white rounded-t-xl ">
          <div className="flex flex-row justify-between border-b-2 border-gray-100 px-6 py-4">
            <p className="text-xl font-semibold">Funds Distribution</p>{" "}
            {/* Title: "Funds Distribution" */}
            <div className="flex flex-row gap-[10px]">
              <ChevronLeftIcon className="w-6 h-6" />
              <ChevronRightIcon className="w-6 h-6" />
            </div>
          </div>
          {/* Distribution Details */}
          <div className="border-b border-gray-100">
            <div className="flex flex-col gap-4  py-4 px-6">
              <div className="text-base font-medium">Nosizwe Otobong</div>
              <div className="flex flex-row justify-between">
                <div className="space-y-2 text-gray-500 text-sm font-medium">
                  <p>Wallet One</p>
                  <p>Wallet Two</p>
                  <p>Total Balance</p>
                </div>
                <div className="space-y-2 text-right text-sm font-medium">
                  <p>1.5 ETH</p>
                  <p>2 ETH</p>
                  <p>$1000</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6  border-b border-gray-100">
              <div className="flex flex-col gap-4 py-4 px-6">
                <div className="text-base font-medium">Bilkisu Uduak</div>
                <div className="flex flex-row justify-between">
                  <div className="space-y-2 text-gray-500 text-sm font-medium">
                    <p>Wallet One</p>
                    <p>Wallet Two</p>
                    <p>Total Balance</p>
                  </div>
                  <div className="space-y-2 text-right text-sm font-medium">
                    <p>1.5 ETH</p>
                    <p>2 ETH</p>
                    <p>$1000</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <button className="bg-violet-500 text-white py-3 px-4 rounded-full w-fit">
                  Distribute
                </button>
              </div>
            </div>
          </div>
          {/* Distribution Details (repeated) */}
          <div className="border-b border-gray-100">
            <div className="flex flex-col gap-4  py-4 px-6">
              <div className="text-base font-medium">Nosizwe Otobong</div>
              <div className="flex flex-row justify-between">
                <div className="space-y-2 text-gray-500 text-sm font-medium">
                  <p>Wallet One</p>
                  <p>Wallet Two</p>
                  <p>Total Balance</p>
                </div>
                <div className="space-y-2 text-right text-sm font-medium">
                  <p>1.5 ETH</p>
                  <p>2 ETH</p>
                  <p>$1000</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6  border-b border-gray-100">
              <div className="flex flex-col gap-4 py-4 px-6">
                <div className="text-base font-medium">Bilkisu Uduak</div>
                <div className="flex flex-row justify-between">
                  <div className="space-y-2 text-gray-500 text-sm font-medium">
                    <p>Wallet One</p>
                    <p>Wallet Two</p>
                    <p>Total Balance</p>
                  </div>
                  <div className="space-y-2 text-right text-sm font-medium">
                    <p>1.5 ETH</p>
                    <p>2 ETH</p>
                    <p>$1000</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <button className="bg-violet-500 text-white py-3 px-4 rounded-full w-fit">
                  Distribute
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop View */}
      <section className="hidden sm:block ml-[300px]">
        <div className="mt-24 bg-white rounded-t-xl">
          <div className="flex flex-row justify-between border-b-2 border-gray-100 px-6 py-4">
            <p className="text-xl font-semibold">Funds Distribution</p>{" "}
            {/* Title: "Funds Distribution" */}
            <div className="flex flex-row gap-[10px]">
              <ChevronLeftIcon className="w-6 h-6" />
              <ChevronRightIcon className="w-6 h-6" />
            </div>
          </div>
          {/* Distribution Details (table format) */}
          <div className="border-b border-gray-100 w-fit">
            <div className="flex flex-col gap-4  py-4">
              <div className="flex flex-col gap-4 py-4 px-6 justify-center">
                <div className="grid grid-cols-5 text-gray-500 text-xl font-medium gap-10 border-b border-gray-100 py-4 ">
                  <p>Participants</p>
                  <p>Wallet One</p>
                  <p>Wallet Two</p>
                  <p>Total Balance</p>
                  <p>Action</p>
                </div>
                <div className="grid grid-cols-5 grid-rows-2 gap-10 items-center text-base">
                  <p>Nosizwe Otobong</p>
                  <p>1.5 ETH</p>
                  <p>2 ETH</p>
                  <p>$1000</p>
                  <div className=""></div>

                  <p>Bilkisu Uduak</p>
                  <p>1.5 ETH</p>
                  <p>2 ETH</p>
                  <p>$1000</p>
                  <div>
                    <button className="bg-violet-500 text-white py-3 px-4 rounded-full w-fit">
                      Distribute
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardAdminFundDistribution;
