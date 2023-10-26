"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import {
  Bars2Icon,
  PlusIcon,
  PowerIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronUpIcon } from "@radix-ui/react-icons";

export default function DashBoardNav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEventOpen, setisEventOpen] = useState<boolean>(false);

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleEventsMenu = () => {
    setisEventOpen(!isEventOpen);
  };

  return (
    <nav className="">
      <div className="lg:hidden fixed top-0 right-0 left-0 bg-white shadow-sm flex flex-row justify-between px-6 py-2 items-center  ">
        <p className="text-xl font-semibold">
          {/* <Image className="w-14 h-14" src={""} alt="" /> */}
          SummitShare
        </p>
        {isOpen ? (
          <nav className="bg-white fixed top-0 bottom-0 right-0 left-0 px-5 py-4 space-y-10">
            <div className="flex flex-row justify-end  ">
              <button onClick={handleMenu} className="">
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>

            <div className="text-base font-normal space-y-[450px]">
              <div className="text-base font-normal flex flex-col gap-6">
                <div className="flex flex-row gap-2">
                  <Link
                    className="focus:text-violet-500 font-medium text-gray-500 active:text-violet-500"
                    href={"/EventCreatorDashboard"}
                  >
                    Overview
                  </Link>
                </div>

                <div>
                  {isEventOpen ? (
                    <div className="flex flex-col gap-4">
                      <div
                        onClick={handleEventsMenu}
                        className="flex flex-row  justify-between"
                      >
                        <div className="flex flex-row gap-2">
                          <Link
                            className="focus:text-black font-medium text-[#A1A1A1] focus:black-grn-100"
                            href={"/EventCreatorDashboard/EventsList"}
                          >
                            Events
                          </Link>
                        </div>

                        <ChevronUpIcon className="w-4 h-4" />
                      </div>
                      <div className="space-y-6 mx-6 text-[#A1A1A1]">
                        <p>
                          {" "}
                          <Link
                            className="focus:text-black"
                            href={"/EventCreatorDashboard/CreateEvents"}
                          >
                            Events Creation
                          </Link>
                        </p>
                        <p>
                          <Link
                            className="focus:text-black"
                            href={"/EventCreatorDashboard/EventsList"}
                          >
                            Events List
                          </Link>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={handleEventsMenu}
                      className="flex flex-row  justify-between"
                    >
                      <div className="flex flex-row gap-2">
                        <p className="focus:text-black font-medium text-[#A1A1A1] focus:black-grn-100">
                          Events
                        </p>
                      </div>

                      <ChevronRightIcon className="w-4 h-4 text-[]" />
                    </div>
                  )}
                </div>

                <div className="flex flex-row gap-2">
                  <Link
                    className="focus:text-black font-medium text-[#A1A1A1] focus:black-grn-100"
                    href={"/EventCreatorDashboard/Transactions"}
                  >
                    Transactions
                  </Link>
                </div>

                <div className="flex flex-row gap-2">
                  <Link
                    className="focus:text-black font-medium text-[#A1A1A1] focus:black-grn-100"
                    href={"/EventCreatorDashboard/FundDistribution"}
                  >
                    Fund Distribution
                  </Link>
                </div>

                <div className="flex flex-row gap-2">
                  <Link
                    className="focus:text-black focus:fill-black font-medium text-[#A1A1A1] focus:black-grn-100"
                    href={"/EventCreatorDashboard/Settings"}
                  >
                    Settings
                  </Link>
                </div>

                <div className="flex flex-row gap-2">
                  <PowerIcon className="w-6 h-6 fill-[#A1A1A1]" />
                  <Link
                    className="focus:text-black focus:fill-black font-medium text-[#A1A1A1] focus:black-grn-100"
                    href={"/EventCreatorDashboard/Settings"}
                  >
                    LogOut
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        ) : (
          <div className="flex flex-row gap-4 items-center">
            <div className=" border-4 border-lime-500 rounded-full w-6 h-6">
              <PlusIcon className="w-4 h-4 text-lime-500 font-bold stroke-2 " />
            </div>

            <button onClick={handleMenu}>
              <Bars2Icon className=" w-8 h-8" />
            </button>
          </div>
        )}
      </div>
      <div className="hidden sm:block">
        <div className="fixed top-0 bottom-0 left-0 bg-white shadow-sm flex flex-col items-center w-[240px] px-10 gap-[44px] pt-8">
          <p className="text-xl font-semibold">
            {/* <Image className="w-14 h-14" src={summitShareLogo} alt="" /> */}
          </p>
          <div className="">
            <div className="text-base font-normal ">
              <div className="text-sm  font-normal space-y-6">
                <div className="flex flex-row gap-2  ">
                  <Link
                    className="focus:text-black font-medium text-[#A1A1A1] focus:black-grn-100"
                    href={"/EventCreatorDashboard"}
                  >
                    Overview
                  </Link>
                </div>

                <div>
                  {isEventOpen ? (
                    <div className="flex flex-col gap-4">
                      <div
                        onClick={handleEventsMenu}
                        className="flex flex-row  justify-between"
                      >
                        <div className="flex flex-row gap-2">
                          <Link
                            className="focus:text-black font-medium text-[#A1A1A1] focus:black-grn-100"
                            href={"/EventCreatorDashboard/EventsList"}
                          >
                            Events
                          </Link>
                        </div>

                        <ChevronUpIcon className="w-4 h-4" />
                      </div>
                      <div className="space-y-6 mx-6 text-[#A1A1A1]">
                        <p>
                          {" "}
                          <Link
                            className="focus:text-black"
                            href={"/EventCreatorDashboard/CreateEvents"}
                          >
                            Events Creation
                          </Link>
                        </p>
                        <p>
                          <Link
                            className="focus:text-black"
                            href={"/EventCreatorDashboard/EventsList"}
                          >
                            Events List
                          </Link>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={handleEventsMenu}
                      className="flex flex-row  justify-between"
                    >
                      <div className="flex flex-row gap-2">
                        <p className="focus:text-black font-medium text-[#A1A1A1] focus:black-grn-100">
                          Events
                        </p>
                      </div>

                      <ChevronRightIcon className="w-4 h-4 text-[]" />
                    </div>
                  )}
                </div>

                <div className="flex flex-row gap-2">
                  <Link
                    className="focus:text-black font-medium text-[#A1A1A1] focus:black-grn-100"
                    href={"/EventCreatorDashboard/Transactions"}
                  >
                    Transactions
                  </Link>
                </div>

                <div className="flex flex-row gap-2">
                  <Link
                    className="focus:text-black font-medium text-[#A1A1A1] focus:black-grn-100"
                    href={"/EventCreatorDashboard/FundDistribution"}
                  >
                    Fund Distribution
                  </Link>
                </div>

                <div className="flex flex-row gap-2">
                  <Link
                    className="focus:text-black focus:fill-black font-medium text-[#A1A1A1] focus:black-grn-100"
                    href={"/EventCreatorDashboard/Settings"}
                  >
                    Settings
                  </Link>
                </div>

                <div className="flex flex-row gap-2">
                  <PowerIcon className="w-6 h-6 fill-[#A1A1A1]" />
                  <Link
                    className="focus:text-black focus:fill-black font-medium text-[#A1A1A1] focus:black-grn-100"
                    href={"/EventCreatorDashboard/Settings"}
                  >
                    LogOut
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
