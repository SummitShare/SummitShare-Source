"use client";
import React, { useState } from "react";
import {
  ArrowsRightLeftIcon,
  Bars2Icon,
  CalendarIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Cog8ToothIcon,
  PlusIcon,
  PowerIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import AddAdminForm from "./AddAdminEmail";
import NavBarIconText from "@/components/reusebaeComponents/navBarIconText";
import NavBarIconTextDropDown from "@/components/reusebaeComponents/navBarIconTextDropDown";

export default function DashBoardNav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [isItOpen, setIsItOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsItOpen(!isItOpen);
  };

  return (
    <nav className="">
      <div className="lg:hidden fixed top-0 right-0 left-0 bg-white shadow-sm flex flex-row justify-between px-6 py-6 items-center  ">
        <p className="text-xl font-semibold">
          {/* <Image className="w-14 h-14" src={""} alt="" /> */}
          SummitShare
        </p>
        {isOpen ? (
          <nav className="fixed top-0 bottom-0 right-0 left-0 bg-slate-50 flex flex-col  px-10 z-10 gap-5 pt-24">
            <div className=" absolute top-6 right-6  ">
              <button onClick={handleMenu} className="">
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>
            <NavBarIconText
              icon={<Squares2X2Icon />}
              text="OverView"
              link="AdminDashboard"
            />
            <NavBarIconTextDropDown
              icon={<CalendarIcon />}
              text="Events"
              iconTwo={<ChevronRightIcon />}
              iconThree={<ChevronDownIcon />}
              open={[
                { to: "AdminDashboard/CreateEvent", name: "CreateEvent" },
                { to: "AdminDashboard/EventsList", name: "EventList" },
              ]}
            />
            <NavBarIconText
              icon={<ArrowsRightLeftIcon />}
              text="Transactions"
              link="AdminDashboard/Transactions"
            />
            <NavBarIconText
              icon={<ChartBarIcon />}
              text="FundDistribution"
              link="AdminDashboard/FundDistribution"
            />
            <NavBarIconText
              icon={<Cog8ToothIcon />}
              text="Settings"
              link="AdminDashboard/Settings"
            />
            <NavBarIconText icon={<PowerIcon />} text="LogOut" />
          </nav>
        ) : (
          <div className="flex flex-row gap-4 items-center">
            <div className="relative">
              <div
                onClick={handleOpen}
                className=" relative  border-4 border-slate-950 rounded-full w-6 h-6"
              >
                {isItOpen ? (
                  <XMarkIcon className="w-4 h-4 text-slate-950 font-bold stroke-2" />
                ) : (
                  <PlusIcon
                    stroke-width="10px"
                    className="w-4 h-4 text-slate-950 font-bold stroke-2"
                  />
                )}

                {/* Display the Plus icon */}
              </div>
              {isItOpen ? <AddAdminForm /> : <div></div>}
            </div>

            <button onClick={handleMenu}>
              <Bars2Icon className=" w-8 h-8" />
            </button>
          </div>
        )}
      </div>
      <div className="hidden sm:block">
        <nav className=" fixed top-0 bottom-0 w-fit space-y-10 pt-20 pl-5 bg-slate-50 ">
          <NavBarIconText
            icon={<Squares2X2Icon />}
            text="OverView"
            link="AdminDashboard"
          />
          <NavBarIconTextDropDown
            icon={<CalendarIcon />}
            text="Events"
            iconTwo={<ChevronRightIcon />}
            iconThree={<ChevronDownIcon />}
            open={[
              { to: "AdminDashboard/CreateEvent", name: "CreateEvent" },
              { to: "AdminDashboard/EventsList", name: "EventList" },
            ]}
          />
          <NavBarIconText
            icon={<ArrowsRightLeftIcon />}
            text="Transactions"
            link="AdminDashboard/Transactions"
          />
          <NavBarIconText
            icon={<ChartBarIcon />}
            text="FundDistribution"
            link="AdminDashboard/FundDistribution"
          />
          <NavBarIconText
            icon={<Cog8ToothIcon />}
            text="Settings"
            link="AdminDashboard/Settings"
          />
          <NavBarIconText icon={<PowerIcon />} text="LogOut" />
        </nav>
      </div>
    </nav>
  );
}
