'use client';
import Buttons from '@/app/components/button/Butons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function Page({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<number>();
  const [verificationMessage, setVerificationMessage] = useState<number>();
  const hasFetched = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!params.token || hasFetched.current) return;
      hasFetched.current = true;

      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/user/verification/verifyEmail?token=${params.token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const { status } = response;
        const { message } = await response.json();
        // //console.log(`status ${status}`)
        // //console.log(`message ${message}`)

        setVerificationMessage(message);
        setVerificationStatus(response?.status);
      } catch (error) {
        console.error('Verification request failed:', error);
      }
    };

    verifyEmail();
  }, [params.token]);
  const resendVerificationEmail = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/user/verification/requestVerification?token=${params.token}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        // Handle success
        // //console.log('Verification email resent successfully.');
      } else {
        // Handle failure
        console.error('Failed to resend verification email.');
      }
    } catch (error) {
      console.error('Resend verification request failed:', error);
    }
  };
  return (
    <div className=" flex flex-col items-center justify-between px-6 py-10 bg-white h-screen md:w-[50%] lg:w-[30%] md:float-right ">
      <nav className="w-full flex flex-row justify-between items-center">
        <p>
          {' '}
          Step 2<span> of 2</span>
        </p>
        <Link href="/">Exit</Link>
      </nav>
      <div className="text-center space-y-2">
        <h1> {verificationStatus === 200 ? 'Woohoo!' : 'whoops!'}</h1>
        <p>{verificationMessage}</p>
      </div>
      <img
        src={verificationStatus === 200 ? '/swinging.svg' : '/petting.svg'}
        alt=""
      />
      <div
        className="w-full"
        onClick={() => {
          verificationStatus === 200
            ? router.push('/auth-sign-in')
            : resendVerificationEmail;
        }}
      >
        <Buttons type="primary" size="large">
          {verificationStatus === 200 ? 'Continue' : 'Resend'}
        </Buttons>
      </div>
    </div>
  );
}

export default Page;
