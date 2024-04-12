'use client'
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
    <div className=" w-full flex items-center justify-center fixed inset-0 bg-gray-50 z-20 ">
      <div className="flex flex-col gap-6 items-center justify-center  ">
        <h1 className="text-3xl text-gray-950 ">
          Summit<span className="text-orange-500">Share</span>
        </h1>
        <div className=" w-[80%] text-center">
          <p className="text-sm text-gray-700">
            {verificationMessage}
          </p>

        </div>
      </div>

      {verificationStatus === 200 ?
        null
        : <div className="space-y-3 ring-1 ring-gray-300 rounded-md py-3 px-4 fixed bottom-5 right-5 left-5  md:right-5 md:left-[60%] ">
          <p className="text-sm text-gray-700">
            {/* {verificationStatus === 200 ?

        " navigate to the home page and start your cultural adventure"
        : "Resend verified eamil note it will expire in 1 hour"} */}

            {verificationMessage}
          </p>
          <div>


            <button onClick={resendVerificationEmail} className="ring-1 ring-gray-300 rounded-md px-3 py-2 text-xs">Resend Email</button>


          </div>
        </div>
      }


    </div>
  );
}

export default Page;


