'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function Page({ params }: { params: { email: string } }) {
   const mail = decodeURIComponent(params.email as string);

   // ////console.log(mail);

   return (
      <div className=" w-full flex items-center justify-center fixed inset-0 bg-gray-50 z-20 ">
         <div className="flex flex-col gap-6 items-center justify-center  ">
            <h1 className="text-3xl text-gray-950 ">
               Summit<span className="text-orange-500">Share</span>
            </h1>
            <div className=" w-[80%] text-center">
               <p className="text-sm text-gray-700">
                  Your verification link has been sent to {mail}
               </p>
            </div>
         </div>
      </div>
   );
}

export default Page;
