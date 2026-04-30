'use client';

import { Button } from '@/components/button/Button';
import Inputs from '@/components/inputs/Inputs';
import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import Banner from '@/components/banners/banner';

type WalletAddresses = {
   Ethereum: string;
   Bitcoin: string;
   Solana: string;
};

const walletAddresses: WalletAddresses = {
   Ethereum: '0x3B6b0Ba44Ef20324c99F5A152C2fF19a13369498',
   Bitcoin: 'bc1qfvcrmh6e68tsy8w4n0s0xyefgfuh8dysh9wd4s',
   Solana: '8Kx6RsXtbH3oEyCefPoaFgidfekCcLx4oEJwuSEk53ZV',
};

function Page() {
   const [selectedChain, setSelectedChain] =
      useState<keyof WalletAddresses>('Ethereum');
   const [qrSize, setQrSize] = useState(200);
   const [copySuccess, setCopySuccess] = useState(false);
   const mobileQrContainerRef = useRef<HTMLDivElement>(null);
   const desktopQrContainerRef = useRef<HTMLDivElement>(null);
   useEffect(() => {
      const updateQRSize = () => {
         const mobileContainer = mobileQrContainerRef.current;
         const desktopContainer = desktopQrContainerRef.current;

         if (window.innerWidth < 640 && mobileContainer) {
            // sm breakpoint
            const { width, height } = mobileContainer.getBoundingClientRect();
            setQrSize(Math.min(width, height) - 40);
         } else if (desktopContainer) {
            const { width, height } = desktopContainer.getBoundingClientRect();
            setQrSize(Math.min(width, height) - 40);
         }
      };

      updateQRSize();
      window.addEventListener('resize', updateQRSize);
      return () => window.removeEventListener('resize', updateQRSize);
   }, []);

   const handleChainChange = (
      e: React.ChangeEvent<HTMLSelectElement> | string
   ) => {
      let value: string;
      if (typeof e === 'string') {
         value = e;
      } else if (e && e.target && typeof e.target.value === 'string') {
         value = e.target.value;
      } else {
         console.error('Unexpected input in handleChainChange:', e);
         return;
      }

      if (value in walletAddresses) {
         setSelectedChain(value as keyof WalletAddresses);
      }
   };

   const handleCopy = async () => {
      await navigator.clipboard.writeText(walletAddresses[selectedChain]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
   };

   return (
      <div className="space-y-10 mx-6 lg:mx-[15%] my-40">
         <header className="text-left space-y-2">
            <div className="space-y-4">
               <h2
                  className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight relative 
                        after:content-[''] after:block after:w-24 after:h-1 
                        after:bg-orange-500 after:mt-4"
               >
                  Support The Project
               </h2>
               <p className=" text-lg md:text-xl leading-relaxed text-neutral-700  max-w-2xl">
                  We strive to create meaningful change and experiences. Your
                  generous contribution fuels our mission. By donating, you become
                  an essential part of our creative ecosystem, enabling us to
                  continue pushing boundaries and inspiring change.{' '}
               </p>
            </div>
         </header>

         <div className="md:grid md:grid-cols-2 gap-4">
            <section className="space-y-6 md:flex md:flex-col md:justify-between md:h-full">
               <div className="space-y-6">
                  <Inputs
                     type="select"
                     label="Chain"
                     state="active"
                     options={['Ethereum', 'Bitcoin', 'Solana']}
                     onChange={handleChainChange}
                  />
                  <div
                     ref={mobileQrContainerRef}
                     className="w-full h-[358px] sm:hidden flex justify-center items-center"
                  >
                     <QRCode
                        value={walletAddresses[selectedChain]}
                        size={qrSize}
                     />
                  </div>
               </div>
               <div className="space-y-4">
                  <Inputs
                     type="input"
                     label="Wallet address"
                     state="inactive"
                     value={walletAddresses[selectedChain]}
                     //@ts-ignore
                     readOnly
                  />
                  <Button
                     onClick={handleCopy}
                     {...({ onClick: handleCopy } as any)}
                  >
                     {copySuccess ? 'Copied!' : 'Copy wallet address'}
                  </Button>
               </div>
            </section>
            <div
               ref={desktopQrContainerRef}
               className="w-full h-[358px] hidden sm:flex justify-center items-center"
            >
               <QRCode value={walletAddresses[selectedChain]} size={qrSize} />
            </div>
         </div>
         <p className="text-sm mt-4">
            Read our{' '}
            <a href="/blog/donations-policy" className="text-blue-500 underline">
               donations policy
            </a>{' '}
            for more info.
         </p>
      </div>
   );
}

export default Page;
