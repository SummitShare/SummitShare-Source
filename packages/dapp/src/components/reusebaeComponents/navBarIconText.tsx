"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface IconTextProps {
  icon?: any;
  text: string;
  link?: string;
  iconTwo?: any;
  iconThree?: any;
}

function NavBarIconText({
  icon,
  text,
  link,
  iconTwo,
  iconThree,
}: IconTextProps) {

  const pathname = usePathname();

  // Check if the current pathname matches the link
  const isActive = link ? pathname === `/${link}` : false;

  return (
    <Link href={link ? `/${link}` : '#'}>
      <div
        className={`Link-text-desktop text-slate-500 flex flex-row gap-2 items-center p-2 pr-8 lg:rounded-l-xl w-full hover:text-slate-950 hover:bg-slate-100 ${
          isActive ? "text-slate-950 bg-slate-100" : ""
        }`}
      >
        <div className="w-6 h-6">{icon}</div>
        <p>{text}</p>
        {iconTwo && <div className="w-3 h-3">{iconTwo}</div>}
        {iconThree && <div className="w-3 h-3">{iconThree}</div>}
      </div>
    </Link>
  );
}

export default NavBarIconText;
