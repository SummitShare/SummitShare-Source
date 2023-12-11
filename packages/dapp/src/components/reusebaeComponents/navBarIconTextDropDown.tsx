"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
   const pathname = usePathname();

     const isActive = link ? pathname === `/${link}` : false;

  return (
    <div onClick={handleOpen} className="text-base pl-2">
      {isOpen ? (
        <>
          <div className="Link-text-desktop  text-slate-500 hover:text-slate-950 flex flex-row gap-2 items-center">
            <div className="w-6 h-6">{icon}</div>
            <p>{text}</p>
            <div className="w-3 h-3">{iconThree}</div>
          </div>
          <div className="flex flex-col gap-5  ml-8 mt-5">
            {open &&
              open.map((linkItem, index) => (
                <Link
                  className={`Link-text-desktop text-slate-500 flex flex-row gap-2 items-center p-2 lg:rounded-l-xl w-full hover:text-slate-950 hover:bg-slate-100 ${
          isActive ? "text-slate-950 bg-slate-100" : ""
        }`}
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
