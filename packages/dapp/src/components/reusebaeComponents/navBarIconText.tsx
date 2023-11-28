"use client";
import Link from "next/link";
import React, { useState } from "react";

interface IconTextProps {
  icon?: any;
  text: string;
  link?: string;
  iconTwo?: any;
  iconThree?: any;
  open?: { to: string; name: string }[];
}

function NavBarIconText({
  icon,
  text,
  iconTwo,
  open,
  iconThree,
  link,
}: IconTextProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Link
      href={`/${link}`}
      className="text-slate-500 hover:text-slate-950 flex flex-row gap-2 items-center lg:hover:bg-slate-100 p-2 lg:rounded-l-xl w-full"
    >
      <div className="w-6 h-6">{icon}</div>
      <p>{text}</p>
      <div className="w-3 h-3">{iconTwo}</div>
    </Link>
  );
}

export default NavBarIconText;
