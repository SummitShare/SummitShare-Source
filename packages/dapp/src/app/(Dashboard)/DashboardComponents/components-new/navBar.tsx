"use client";
import React from "react";
import { useRouter } from "next/navigation";

// Icons from Heroicons
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
} from "@heroicons/react/24/outline";

// Custom components for navigation items
import NavBarIconText from "@/components/reusebaeComponents/navBarIconText";
import NavBarIconTextDropDown from "@/components/reusebaeComponents/navBarIconTextDropDown";

function NavBar() {
  // Using useRouter hook for navigation
  const router = useRouter();

  return (
    <nav className="flex flex-row justify-between items-center w-full h-10 lg:flex-col lg:gap-11 lg:w-fit lg:fixed lg:top-0 lg:bottom-0 lg:h-full lg:py-12 lg:justify-normal bg-white">
      {/* Brand logo or name */}
      <p className="H3-Base-mobile text-blue-950 ">
        Summit<span className="text-orange-500">Share</span>
      </p>

      {/* Navigation links for larger screens */}
      <div className="flex flex-col gap-6 ml-12">
        <NavBarIconText icon={<Squares2X2Icon />} text="OverView" link="AdminDashboard" />
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
      </div>

      {/* Icons for mobile screens */}
      <div className="flex flex-row gap-4 lg:hidden">
        <div className="flex items-center justify-center rounded-full border-4 border-orange-500 w-6 h-6">
          <PlusIcon className="w-3 h-3 text-orange-500" />
        </div>
        <Bars2Icon className="w-6 h-6" />
      </div>
    </nav>
  );
}

export default NavBar;
