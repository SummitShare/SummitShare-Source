"use client";
import { ArrowRightIcon, StarIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default function page() {
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
    <div className="space-y-10 ">
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
      <section className="px-6 space-y-2">
        <h1 className="text-xl font-black text-gray-950 ">This is an ode to <br/>the women among us.</h1>
        <p className="text-sm text-gray-700 text-pretty">Those who walked before us and those to come. Those who wore red clay masks and rested their heads on bended knees. Those who washed the cowry bead and swung the snuff cup.Those who weaved the baskets and wrapped the cloth. Those who fought for peace and danced to the drum:</p>
      </section>
      <section className="grid grid-rows-6 gap-6  p-6">
        <Link href={"/exhibit/loongo"} className="text-center space-y-2">
          <img src="https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650965510178-D24QXQOCKFVJEMJ26XVL/loongo.fb394b5caa52590a76f2.png?format=500w" alt="" />
          <h3 className="font-semibold">Loongo</h3>
        </Link>
        <Link href={"/exhibit/LuejiwaNkonde"} className="text-center space-y-2">
          <img src="https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650965527334-E2Z03ZQODOD6V3BHR8NK/lueji.f1f3c00ac13a6f15ad29.png?format=500w" alt="" />
          <h3 className="font-semibold">Lueji wa Nkonde</h3>
        </Link>
        <Link href={"/exhibit/JuliaChikamoneka"} className="text-center space-y-2">
          <img src="https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650965499911-UY1HS4JNGE3DMR3UCGBG/julia.8a3947559b371149d239.png?format=500w" alt="" />
          <h3 className="font-semibold">Julia Chikamoneka</h3>
        </Link>
        <Link href={"/exhibit/Mukwae"} className="text-center space-y-2">
          <img src="https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650965554535-SSV1ZXYARJWML420FDKT/mukwae.dcca9f02ec09b75af383.png?format=500w" alt="" />
          <h3 className="font-semibold">Mukwae</h3>
        </Link>
        <Link href={"/exhibit/Mwape"} className="text-center space-y-2">
          <img src="https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650965582894-353JRX20BETDCXS4QP44/mwape.65f6da26e8ba70662459.png?format=500w" alt="" />
          <h3 className="font-semibold">Mwape</h3>
        </Link>
        <Link href={"/exhibit/Mwenya"} className="text-center space-y-2">
          <img src="https://images.squarespace-cdn.com/content/v1/5878a307ebbd1ab23e1ed5a0/1650965599355-YAR8G18WK3HL39U976T4/mwenya.29445005ff1bfd622c6a.png?format=500w" alt="" />
          <h3 className="font-semibold">Mwenya</h3>
        </Link>
      </section>
    </div>
  );
}
