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

function NavBarIconTextDropDown({
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
    <div onClick={handleOpen} className="text-base pl-2">
      {isOpen ? (
        <>
          <div className="text-slate-500 hover:text-slate-950 flex flex-row gap-2 items-center">
            <div className="w-6 h-6">{icon}</div>
            <p>{text}</p>
            <div className="w-3 h-3">{iconThree}</div>
          </div>
          <div className="flex flex-col gap-5  ml-8 mt-5">
            {open &&
              open.map((linkItem, index) => (
                <Link
                  className="text-slate-500 hover:text-slate-950 lg:hover:bg-slate-100 p-2 lg:rounded-l-xl w-full"
                  key={index}
                  href={`/${linkItem.to}`}
                >
                  {linkItem.name}
                </Link>
              ))}
          </div>
        </>
      ) : (
        <div>
          <div className="text-slate-500 hover:text-slate-950 flex flex-row gap-2 items-center">
            <div className="w-6 h-6">{icon}</div>
            <p>{text}</p>
            <div className="w-3 h-3">{iconTwo}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBarIconTextDropDown;
