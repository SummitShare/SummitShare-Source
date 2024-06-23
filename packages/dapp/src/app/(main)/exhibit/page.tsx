"use client";
import { useState, useEffect } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import Buttons from "@/app/components/common/button/Butons";
import SummitShareCanvas from "@/app/components/3DCanvas/3dCanvas";
import { Drum } from "@/app/components/3DCanvas/Drum";

export default function Home() {

  const [count, setCount] = useState({
    artifact: 0,
    donations: 0,
    visitors: 0,
  });

  const thresholds = {
    artifact: 10,
    donations: 20.5,
    visitors: 30,
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => {
        const newCount = {
          artifact:
            prevCount.artifact >= thresholds.artifact
              ? prevCount.artifact
              : prevCount.artifact + 0.1,
          donations:
            prevCount.donations >= thresholds.donations
              ? prevCount.donations
              : prevCount.donations + 0.1,
          visitors:
            prevCount.visitors >= thresholds.visitors
              ? prevCount.visitors
              : prevCount.visitors + 0.1,
        };

        if (
          newCount.artifact >= thresholds.artifact &&
          newCount.donations >= thresholds.donations &&
          newCount.visitors >= thresholds.visitors
        ) {
          clearInterval(intervalId);
        }
        return newCount;
      });
    }, 10);

    return () => clearInterval(intervalId);
  }, []);


  const counter =
    <ul className="w-[70%] flex justify-center gap-6  md:w-full md:gap-0 md:justify-start font-black ">
      <li className="space-y-3 text-center w-[1/3] md:w-fit lg:mr-3 ">
        <h3>Artifact</h3>
        <h2>{count.artifact.toFixed()}</h2>
      </li>
      <li className="space-y-3 text-center w-1/3 lg:w-[20%]">
        <h3>Visitors</h3>
        <h2>{count.visitors.toFixed(1)}k</h2>
      </li>
      <li className="space-y-3 text-center w-1/3 lg:w-[20%]">
        <h3>Donations</h3>
        <h2>{count.donations.toFixed(1)}k</h2>
      </li>
    </ul>

  return (<div className=" space-y-12 mx-6 mt-[96px]">
    <section className="border-b border-primary-900-5 space-y-[48px] pb-6">
      <div className="w-full h-[342px] rounded-[8px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515658323406-25d61c141a6e?q=80&w=2509&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="women walking together in a group"
          className="w-full h-full object-cover"
        />
      </div>
<div>
  <SummitShareCanvas modle={<Drum/>}/>
</div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2>The Leading Ladies</h2>
          <p>
            Those who walked before us and those to come. Those who wore red
            clay masks and rested their heads on bended knees. Those who
            washed the cowry bead and swung the snuff cup.
          </p>
        </div>
        <Buttons type="primary" size="large">Purchase</Buttons>
      </div>
    </section>

    <div className="w-full rounded-[8px] bg-primary-50 space-y-4 px-[45px] py-6">
      <div className="w-full ">
      <XMarkIcon className="w-6 float-end"/>
      </div>
      
      <div className="space-y-2">
      <h3>How to purchase a ticket</h3>
      <p>Those who walked before us and those to come.</p>
      </div>
      
      <div className="w-[118px]">
          <Buttons type="subTartary" size="small">Help me</Buttons>
        </div>
    </div>

    <section className="w-full">
<h2>All Artefact</h2>

<section className="flex flex-row gap-4 overflow-x-auto py-6">
<div className="flex flex-col  gap-6 justify-end min-w-[80%] h-[300px] rounded-[8px] bg-primary-50 px-[43px] py-6 ">
      <h3 className="text-white">Artifact name</h3>
        <div className="w-[66px]">
          <Buttons type="tartary" size="small">View</Buttons>
        </div>
      </div>
      <div className="flex flex-col  gap-6 justify-end min-w-[80%] h-[300px] rounded-[8px] bg-primary-50 px-[43px] py-6 ">
      <h3 className="text-white">Artifact name</h3>
        <div className="w-[66px]">
          <Buttons type="tartary" size="small">View</Buttons>
        </div>
      </div>
      
    </section>

</section>

    <section className="bg-primary-400 rounded-[8px] w-full h-[342px] flex flex-col items-center px-[45px] justify-center space-y-[48px]">

      <div className="space-y-2 text-center">
        <h3 className="text-white">Collaborate with us</h3>
        <p className="text-center text-white">Figma ipsum component variant main layer. Arrange draft plugin community.</p>
      </div>

      <div className="w-[164px]">
        <Buttons type="tartary" size="large">Register today</Buttons>
      </div>

    </section>



   
  </div>);
}
