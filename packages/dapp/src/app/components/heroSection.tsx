"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./button/Button";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";
import { isCountdownComplete } from "@/functonality/countdownTimer";
import { desableButton } from "../(test)/functions/disable";
import Image from "next/image";

interface Airdrop {
  valid: boolean;
  claimed: boolean;
}

function HeroSection() {
  const router = useRouter();
  const { data: session } = useSession();
  const { address } = useAccount();
  const [airDropValues, setAirdropValues] = useState<Airdrop | null>(null);
  const [response, setResponse] = useState<number>();
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [render, setRender] = useState<boolean>(false);
  const [dropping, setDropping] = useState<boolean>(false)

  const userAddress = address;
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;

    async function fetchAirdropPermissions() {
      setLoading(true);
      try {
        const host = process.env.NEXT_PUBLIC_HOST;
        const url = `${host}/api/v1/events/airdrop?user_id=${userId}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch airdrop data: ${res.statusText}`);
        }

        const data = (await res.json()) as Airdrop;
        setAirdropValues(data);

      } catch (error: any) {
        console.error("Error fetching airdrop data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAirdropPermissions();
  }, [userId, render]);

  async function sendAirdropRequest(address: string) {
    try {
      setDropping(true);
      const host = process.env.NEXT_PUBLIC_HOST;
      const url = `${host}/api/v1/events/airdrop`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipient: address, user_id: userId }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setDropping(false);
        throw new Error(responseData.message || `HTTP Error: ${res.status}`);

      } else {
        setResponse(res.status);
        setResponseMessage("Air drop successfully claimed");
        console.log("Airdrop claimed successfully:", responseData);
        setRender((prev) => !prev);
        setDropping(false);
      }



    } catch (error: any) {
      setDropping(false);
      setResponseMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
      console.error("Error claiming airdrop:", error);
    }
  }

  const isAirdropValid = airDropValues?.valid === true && airDropValues?.claimed === false;
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Image
        src="https://s3.tebi.io/summitshare-images/WHM%20Baskets.jpg"
        alt="WHM Baskets"
        fill
        className="object-cover object-left-top"
        sizes="(max-width: 768px) 100vw, 100vw"
        priority
        quality={90}
      />

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative h-full z-[3] container px-4 md:px-[15%]">
        <div className="h-full flex items-end md:items-center pb-16 md:pb-0">
          <div className="w-full md:max-w-2xl">
            {/* Content box */}
            <div className="backdrop-blur-sm bg-white/75 p-8 md:p-10 
                          rounded-xl shadow-2xl border border-white/20">
              <div className="space-y-8">
                {/* Text content */}
                <div className="space-y-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 
                               tracking-tight leading-tight">
                    The Leading Ladies of Zambia
                  </h1>

                  <p className="text-neutral-700 md:text-xl leading-relaxed">
                    Those who walked before us and those to come. Those who wore red
                    clay masks and rested their heads on bended knees. Those who
                    washed the cowry bead and swung the snuff cup. Those who weaved
                    the baskets and wrapped the cloth. Those who fought for peace
                    and danced to the drum.
                  </p>
                </div>

                {/* Buttons - keeping original functionality */}
                <div>
                  {!userAddress ? (
                    <ConnectKitButton.Custom>
                      {({ show }) => (
                        <Button
                        
                          onClick={show}
                          className="transition-all duration-300 ease-in-out
                                   transform hover:-translate-y-0.5"
                        >
                          Purchase Ticket
                        </Button>
                      )}
                    </ConnectKitButton.Custom>
                  ) : (
                    <div className="flex gap-2">
                      <Link href="/cya">
                        <Button
                        
                          className="transition-all duration-300 ease-in-out
                                         transform hover:-translate-y-0.5">
                          Purchase Ticket
                        </Button>
                      </Link>

                      {loading ? (
                        <Button
                        
                          variant="white" disabled className="text-base">
                          Loading...
                        </Button>
                      ) : isAirdropValid && isCountdownComplete() === true ? (
                        <Button
                        

                          disabled={desableButton(response, loading)}
                          className={`transition-all duration-300 ease-in-out
                                    transform hover:-translate-y-0.5
                                    ${loading && "cursor-wait"} 
                                    ${response === 200 && "cursor-not-allowed"}`}
                          onClick={() => sendAirdropRequest(userAddress)}
                          variant="white"
                        >
                          {dropping ? "Sending Funds" : response && response === 200
                            ? responseMessage
                            : "Claim Air Drop"}
                        </Button>
                      ) : (
                        <Link href="/distribution">
                          <Button 
                            variant="white" className="transition-all duration-300 ease-in-out
                                                         transform hover:-translate-y-0.5">
                            Learn More
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;