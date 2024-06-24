"use client";
import { useState, useEffect } from "react";
import Buttons from "../components/button/Butons";
import BlogList from "../(test)/test/page";


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
      <li className="space-y-3 text-center w-[1/3] md:w-fit md:mr-3 ">
        <h3>Artifact</h3>
        <h2>{count.artifact.toFixed()}</h2>
      </li>
      <li className="space-y-3 text-center w-1/3 md:w-[20%]">
        <h3>Visitors</h3>
        <h2>{count.visitors.toFixed(1)}k</h2>
      </li>
      <li className="space-y-3 text-center w-1/3 md:w-[20%]">
        <h3>Donations</h3>
        <h2>{count.donations.toFixed(1)}k</h2>
      </li>
    </ul>

  return (<div className=" space-y-24 mx-6 my-28">


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
        <Buttons type="primary" size="large">Explore</Buttons>
      </div>
    </section>

    <section className="space-y-8">
      <div className="space-y-2"><h2>What is summitShare</h2>
        <p>SummitShare stands as a pioneering digital platform dedicated to the repatriation of African cultural artifacts. Bridging the past and present, it serves as a beacon of hope and a testament to the resilience of African heritage, utilizing the power of blockchain technology to reclaim, celebrate, and share the rich tapestry of Africa's history with the world.</p></div>
      <div className="space-y-4 md:flex md:flex-row md:gap-4 md:w-[50%] md:items-center md:space-y-0">   <Buttons type="primary" size="large">Donate</Buttons>
        <Buttons type="secondary" size="large" >Star repo</Buttons></div>
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

    <section className="w-full space-y-6">
      <div className="sapce-y-2">
        <h2>Get updates</h2>
        <p>Figma ipsum component variant main layer. Arrange draft plugin community.</p>
      </div>
      <BlogList />
    </section>



    <section className="bg-primary-400 rounded-[0.5rem] w-full h-[21.375rem] flex flex-col items-center px-[2.813rem] justify-center space-y-12 ">
      <div className="space-y-2 text-center">
        <h3 className="text-white">Our Partnerss</h3>
        <p className="text-center text-white">Figma ipsum component variant main layer. Arrange draft plugin community.</p>
      </div>
      <div className="w-[164px]">
        <Buttons type="tartary" size="large">Learn more</Buttons>
      </div>
    </section>
  </div>);
}
