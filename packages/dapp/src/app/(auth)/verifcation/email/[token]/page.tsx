'use client'
import Buttons from "@/app/components/button/Butons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


function Page({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [verificationStatus, setverificationStatus] = useState<number>()
  const [verificationMessage, setVerificationMessage] = useState<number>();
  const hasFetched = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!params.token || hasFetched.current) return;
      hasFetched.current = true;

      try {
        const response = await fetch(`http://localhost:3000/api/v1/user/verification/verifyEmail?token=${params.token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { status } = response
        const { message } = await response.json()
        console.log(`status ${status}`)
        console.log(`message ${message}`)

        setVerificationMessage(message);
        setverificationStatus(response?.status)

      } catch (error) {
        console.error('Verification request failed:', error);
      }
    };

    verifyEmail();

  }, [params.token]);


  {
    verificationStatus === 200 ?


     setTimeout(() => {
       router.push('/auth-sign-in');
     }, 2000) : null
   }





  const resendVerificationEmail = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/verification/requestVerification?token=${params.token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Handle success
        console.log('Verification email resent successfully.');
      } else {
        // Handle failure
        console.error('Failed to resend verification email.');
      }
    } catch (error) {
      console.error('Resend verification request failed:', error);
    }
  };




  return (
    <div className=" flex flex-col justify-between min-h-screen my-[48px] mx-6">
        <nav className="w-full flex flex-row justify-between items-center">
        <p className="text-p2-m">
          Step 1<span> of 3</span>
        </p>
        <p>Exit</p>
      </nav>
      <div className="w-full h-[322px]">

      </div>
      <Buttons type="primary" size="large">Continue</Buttons>

    </div>
  );
}

export default Page;


