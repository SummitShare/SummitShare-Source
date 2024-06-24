"use client";
import { useState, useEffect } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import SummitShareCanvas from "@/app/components/3DCanvas/3dCanvas";
import { Drum } from "@/app/components/3DCanvas/models/Drum";
import Buttons from "@/app/components/button/Butons";

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

  return (<div className="space-y-24 mx-6 my-28">
    <section className="border-b md:border-b-0 border-primary-900-5 space-y-[48px] pb-6 md:flex md:flex-row md:gap-4">
      <div className="w-full md:w-[45%] h-[342px] rounded-[0.5rem] overflow-hidden bg-[url('https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650963860604-mdJSBAWOMLQIU9ZXUK1K/all-women.71ba3487f51cab4dc38a.png?format=2500w')] bg-cover bg-primary-50 bg-center">

      </div>
      <div className="space-y-6 md:w-[45%] md:flex md:flex-col md:justify-between">
        <div className="space-y-2">
          <h2>The Leading Ladies</h2>
          <p>
            Those who walked before us and those to come. Those who wore red clay masks and rested their heads on bended knees. Those who washed the cowry bead and swung the snuff cup.Those who weaved the baskets and wrapped the cloth. Those who fought for peace and danced to the drum.
          </p>
        </div>
        <Buttons type="primary" size="large">Purchus</Buttons>
      </div>
    </section>

    <div className="w-full rounded-[0.5rem] bg-primary-50 space-y-4 px-12 py-6">
      <div className="w-full ">
        <XMarkIcon className="w-6 float-end" />
      </div>

      <div className="space-y-2">
        <h3>How to purchase a ticket</h3>
        <p>Those who walked before us and those to come.</p>
      </div>

      <div className="w-[118px]">
        <Buttons type="subTartary" size="small">Help me</Buttons>
      </div>
    </div>

    <section className="w-full space-y-6">
      <h2>All Artefact</h2>

      <section className=" w-full  grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex flex-col  gap-6 justify-end  h-[15.625rem] rounded-[0.5rem] bg-primary-50 px-8 py-6 ">
          <h3 className="text-white">Artifact name</h3>
          <div className="w-[66px]">
            <Buttons type="tartary" size="small">View</Buttons>
          </div>
        </div>
        <div className="flex flex-col  gap-6 justify-end  h-[15.625rem] rounded-[0.5rem] bg-primary-50 px-8 py-6 ">
          <h3 className="text-white">Artifact name</h3>
          <div className="w-[66px]">
            <Buttons type="tartary" size="small">View</Buttons>
          </div>
        </div>
        <div className="flex flex-col  gap-6 justify-end  h-[15.625rem] rounded-[0.5rem] bg-primary-50 px-8 py-6 ">
          <h3 className="text-white">Artifact name</h3>
          <div className="w-[66px]">
            <Buttons type="tartary" size="small">View</Buttons>
          </div>
        </div>
        <div className="flex flex-col  gap-6 justify-end  h-[15.625rem] rounded-[0.5rem] bg-primary-50 px-8 py-6 ">
          <h3 className="text-white">Artifact name</h3>
          <div className="w-[66px]">
            <Buttons type="tartary" size="small">View</Buttons>
          </div>
        </div>
      
      

      </section>

    </section>

    <section className="bg-primary-400 rounded-[0.5rem] w-full h-[21.375rem] flex flex-col items-center px-[2.813rem] justify-center space-y-12 ">
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
