"use client";
import { useState, useEffect } from "react";
import Buttons from "../components/button/Butons";


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
          src="https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650963860604-LGJSBAWOMLQIU9ZXUK1K/all-women.71ba3487f51cab4dc38a.png?format=2500w"
          alt="women walking together in a group"
          className="w-full h-full object-cover"
        />
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
        <Buttons type="primary" size="large">Explore</Buttons>
      </div>
    </section>

    <section className="space-y-8">
      <div className="space-y-2">      <h2>What is summitShare</h2>
        <p>Figma ipsum component variant main layer. Arrange draft plugin community effect. Line stroke comment flows invite device.</p></div>
      <div className="space-y-4">   <Buttons type="primary" size="large">Donate</Buttons>
        <Buttons type="secondary" size="large" >Star repo</Buttons></div>


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

<section className="w-full">
<h2>Get updates</h2>
<p>Figma ipsum component variant main layer. Arrange draft plugin community.</p>
<section className="flex flex-row gap-4 overflow-x-auto py-6">
      <div className="min-w-[80%] h-fit rounded-[8px] bg-primary-50 px-[43px] py-6 space-y-6">
        <div className="space-y-2">
          <h3>Blog</h3>
          <p>Figma ipsum component variant main layer. Arrange draft plugin community.</p>
        </div>
        <div className="w-[66px]">
          <Buttons type="subTartary" size="small">Read</Buttons>
        </div>
      </div>
      <div className="min-w-[80%] h-fit rounded-[8px] bg-primary-50 px-[43px] py-6 space-y-6">
        <div className="space-y-2">
          <h3>Blog</h3>
          <p>Figma ipsum component variant main layer. Arrange draft plugin community.</p>
        </div>
        <div className="w-[66px]">
          <Buttons type="subTartary" size="small">Read</Buttons>
        </div>
      </div>
    </section>

</section>

    <section className="bg-primary-400 rounded-[8px] w-full h-[342px] flex flex-col items-center px-[45px] justify-center space-y-[48px]">

      <div className="space-y-2 text-center">
        <h3 className="text-white">Our Partners</h3>
        <p className="text-center text-white">Figma ipsum component variant main layer. Arrange draft plugin community.</p>
      </div>


      <Buttons type="tartary" size="large">Learn more about them</Buttons>


    </section>
  </div>);
}
