"use client";
import { ArrowRightIcon, StarIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";

export default function Home() {
  const [open, setOpen] = useState(false);

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

  return (
    <div className="space-y-20 ">
        {open ? (
          <div className="fixed inset-0 bg-gray-950/20 z-[60]">
            <div className="bg-gray-50 p-6 space-y-6  ">
              <XMarkIcon
                className="w-6 float-end"
                onClick={() => setOpen(!open)}
              />
              <div className="space-y-2">
                <h1 className="text-xl font-bold space-y-2">Details</h1>
                <p className="text-gray-700">
                  Once Purchase is Selected the transaction will need to be
                  signed in your wallet:
                </p>
              </div>

              <div className="flex flex-row gap-6 ">
                <ul className="space-y-2 font-semibold">
                  <li>Exhibit</li>
                  <li>Wallet to </li>
                  <li>Payments</li>
                </ul>
                <ul className="space-y-2  text-gray-700">
                  <li>Leading Ladies</li>
                  <li className="truncate w-[40%]">
                    041f4e029432bee35b075366b7b3ef881e46f993085310c6f05e0946a33d7
                  </li>
                  <li>$100</li>
                </ul>
              </div>
              <button className="w-fit flex gap-3 items-center px-6 py-3 rounded-lg bg-orange-500 font-bold dark:bg-950 text-gray-50 dark:text-gray-50">
                Purchase
              </button>
            </div>
          </div>
        ) : null}
      <section className="relative w-full  mt-10 px-6 pt-24 flex flex-col items-center justify-center gap-6 bg-[url('https://images.unsplash.com/photo-1553775927-a071d5a6a39a?q=80&w=2587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center ">
        <div className="absolute l inset-0 bg-black opacity-40 "></div>
        <div className="flex flex-col items-center gap-6 md:items-start z-10">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-black text-gray-50 dark:text-gray-50">
              The Leading Ladies Exhibit
            </h1>
            <p className=" text-gray-50 dark:text-gray-0">
              This exhibit explores the legacy of influential women from
              Zambia's 10 provinces, spanning the 17th to 19th centuries.
            </p>
          </div>

          <ul className="w-[70%] flex justify-center gap-6  md:w-full md:gap-0 md:justify-start font-black text-gray-50 dark:text-gray-50">
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

          <button className="w-fit flex gap-3 items-center px-6 py-3 rounded-t-xl bg-gray-50 font-bold dark:bg-gray-50 text-gray-950 dark:text-gray-950" onClick={() => setOpen(!open)}>
            Purchase ticket <ArrowRightIcon className="w-4" />
          </button>
        </div>
      </section>
      <section className=" px-6  w-full   flex flex-col  justify-center gap-6 ">
        <div className="space-y-2 text-pretty  z-10 text-gray-950">
          <h1 className="text-2xl font-black ">What is SummitShare?</h1>
          <p className="text-pretty leading-loose">
            <span className="bg-orange-500 text-gray-50 p-1"> SummitShare</span>. stands as
            a pioneering digital platform dedicated to the repatriation of
            African cultural artifacts.{" "}
            <span className="bg-orange-500 text-gray-50 p-1">
              utilizes the power of blockchain technology to
            </span>
            reclaim, celebrate, and{" "}
            <span className="bg-orange-500 text-gray-50 p-1">
              share the rich tapestry of Africa's history
            </span>{" "}
            with the world.
          </p>
        </div>

        <div className="flex gap-2 z-10">
          <button className="w-fit flex gap-3 items-center px-6 py-3 rounded-[8px] bg-gray-950 font-bold dark:bg-gray-50 text-gray-50 dark:text-gray-950">
            Donate
          </button>
          <button className="w-fit flex gap-3 items-center px-6 py-3 rounded-[8px] bg-slate-500/50 backdrop-blur-md font-bold dark:bg-gray-50 text-gray-50 dark:text-gray-950">
            Leave a start
            <StarIcon className="w-4" />
          </button>
        </div>
      </section>
      <section className="w-full  flex flex-col items-center justify-center gap-6 bg-orange-500  p-6 py-20">
        <div className="flex flex-col items-center gap-6 md:items-start">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-black text-gray-50 dark:text-gray-50">
              Collaborate with us
            </h1>
            <p className=" text-gray-50 dark:text-gray-50">
              Join us to bridge perspectives and create impact. Whether you're
              an individual or organization, let's collaborate. Fill out our
              form to explore partnership
            </p>
          </div>

          <div className="flex gap-2">
            <button className="w-fit flex gap-3 items-center px-6 py-3 rounded-[8px] bg-gray-50 font-bold dark:bg-gray-50 text-gray-950 dark:text-gray-950">
              Apply
              <ArrowRightIcon className="w-4" />
            </button>
          </div>
        </div>

        <img src="workWithUs.svg" alt="heroImg" />
      </section>
      <section className="w-full  flex flex-col items-center justify-center gap-6 p-6  rounded-xl  ">
        <div className="flex flex-col items-center gap-6 md:items-start">
          <div className="space-y-2 text-center md:text-left text-gray-950">
            <h1 className="text-2xl font-black">Get updates</h1>
            <p className=" ">
              Explore our blog for the latest updates on the SummitShare project
              and platform. Dive into insights, news, and developments that keep
              you connected and informed!
            </p>
          </div>

          <div className="flex gap-2">
            <button className="w-fit flex gap-3 items-center px-6 py-3  font-bold text-gray-950 dark:text-gray-950" >
              Blog updates
              <ArrowRightIcon  className="w-4" />
            </button>
          </div>
        </div>
      
      </section>
      <section className="w-full  flex flex-col items-center justify-center gap-6  px-6 py-20 bg-orange-500 ">
        <div className="flex flex-col items-center gap-6 md:items-start ">
          <div className="space-y-2 text-center md:text-left text-gray-50 dark:text-gray-50">
            <h1 className="text-2xl font-black ">Our Collaborators</h1>
            <p className="text-gray-50">
              Meet the organizations that contributed to our success{" "}
            </p>
          </div>
        </div>

        <div className="flex gap-6 ">
          {/* <div className="w-full h-[340px] flex flex-col items-center justify-center gap-6 rounded-md bg-gray-300/30 backdrop-blur-50 text-gray-950 px-6 py-8"> */}
          <img
            src="EF.svg"
            alt="EF"
            className="w-16 h-16 bg-white/50 rounded-full p-2"
          />
          {/* <div className="space-y-2 text-center">
  <h1 className="text-lg font-bold ">Ethereum Foundation</h1>
  <p className="text-xs">A global non-profit advancing Ethereum and blockchain innovation, fostering a future where the technology is open and accessible</p>
  </div> */}

          {/* </div> */}

          {/* <div className="w-full h-[340px] flex flex-col items-center justify-center gap-6 rounded-md bg-gray-300/30 backdrop-blur-50 text-gray-950 px-6 py-8"> */}
          <img
            src="WHM.svg"
            alt="EF"
            className="w-16 h-16 bg-white/50 rounded-full p-2"
          />
          {/* <div className="space-y-2 text-center">
  <h1 className="text-lg font-bold ">Women’s History Museum</h1>
  <p className="text-xs">Championing women’s narratives through digital humanities, the museum empowers and educates women in communities worldwide.</p>
  </div> */}

          {/* </div> */}
        </div>
      </section>
    </div>
  );
}
