"use client";
import React from "react";
import logo from "/public/summitsharelogo.png";
import Image from "next/image";
import Link from "next/link";
import Button from "@/reusebaeComponents/button";
import { useRouter } from "next/navigation";

function LandingNavBar() {
  const router = useRouter();

  const handleClickSignUp = () => {
    router.push("Landing/auth/signUp");
  };
  const handleClickSignIn = () => {
    router.push("Landing/auth/signIn");
  };
  return (
    <div>
      <div className=" fixed top-0 inset-x-0 w-full h-20 py-4 flex flex-row justify-between items-center backdrop-blur-md px-5 bg-white/75 z-50 ">
        <div className="flex flex-row justify-between items-center w-full lg:w-fit gap-6">
          <div className="text-xl font-bold flex flex-row gap-2 items-center text-amber-950 ">
            <div>
              {/* <Image className="w-14 h-14" src={logo} alt="Icon"></Image> */}
            </div>
            <div className="title-h4-slate">
              Summit<span className="title-h4-orange">Share</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-6 items-center">
          <Link
            className=" font-medium  text-amber-950 transition-all cursor-pointer"
            href={""}
          >
            Blog
          </Link>
          <Link
            className=" font-medium  text-amber-950 transition-all cursor-pointer"
            href={""}
          >
            Git Hub
          </Link>

          <div className="flex flex-row gap-2 items-center">
            <Button
              click={handleClickSignUp}
              text="Sign up"
              type="button"
              backGroundColor="bg-amber-950"
              textColor="text-white"
              hover="hover:bg-amber-950 hover:shadow-lg transition-all "
            />
            <Button
              click={handleClickSignIn}
              text="Sign in"
              type="button"
              backGroundColor="bg-stone-200"
              borderColor="amber-950"
              textColor="text-amber-950"
              hover="hover:bg-amber-950 hover:text-white transition-all  hover:shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingNavBar;
