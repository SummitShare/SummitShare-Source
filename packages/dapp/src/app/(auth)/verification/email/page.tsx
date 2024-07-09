'use client';
import Buttons from '@/app/components/button/Butons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function Page({ params }: { params: { token: string } }) {
  const router = useRouter();

  return (
    <div className=" flex flex-col items-center gap-[35%] px-6 py-10 bg-white h-screen md:w-[50%] lg:w-[30%] md:float-right ">
      <nav className="w-full flex flex-row justify-between items-center">
        <p>
          {' '}
          Step 2<span> of 3</span>
        </p>
        <Link href="/">Exit</Link>
      </nav>
      <div className="text-center space-y-2">
        <h1>Verify your email</h1>
        <p>Open your mail SummitShare has sent you a verification link</p>
      </div>
    </div>
  );
}

export default Page;
