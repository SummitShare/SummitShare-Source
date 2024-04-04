'use client'
import Link from "next/link";
import { useEffect, useState } from "react";


 function page({ params }: { params: { token: string } }) {


  const [verificationStatus, setVerificationStatus] = useState<number>();
  useEffect(() => {
    const verifyEmail = async () => {
      if (!params.token) return;
      try {
        const response = await fetch(`http://localhost:3000/api/v1/user/verification/verifyEmail?token=${params.token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        setVerificationStatus(response.status);
      } catch (error) {
        console.error('Verification request failed:', error);
      }
    };

    verifyEmail();
  },[params.token]);



  console.log(verificationStatus)

  // switch (response.status) {
  //   case 200:

  //     return 
  //   case 400:

  //     return;
  //   case 401:

  //     return;
  //   case 403:

  //     return;

  //   default:
  //     break;
  // }

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
          {verificationStatus === 200 ? <p className="text-sm text-gray-700">

            Your email has been verified successful welcome to our community
          </p> : <p className="text-sm text-red-700">  Sorry youre verified email has expired please selcet resend email and click the new email link <link rel="stylesheet" href="" /></p>}

        </div>
      </div>
      <div className="space-y-3 ring-1 ring-gray-300 rounded-md py-3 px-4 fixed bottom-5 right-5 left-5  md:right-5 md:left-[60%] ">
        <p className="text-sm text-gray-700">
          {verificationStatus === 200 ?

            " navigate to the home page and start your cultural adventure"
            : "Resend verified eamil note it will expire in 1 hour"}


        </p>
        <div>

          {verificationStatus === 200 ?
            <Link href={"/auth-sign-in"}>
              <button className="ring-1 ring-gray-300 rounded-md px-3 py-2 text-xs">navigate</button>
            </Link>

            :
            <button  onClick={()=>resendVerificationEmail} className="ring-1 ring-gray-300 rounded-md px-3 py-2 text-xs">navigate</button>
          
          }
        </div>
      </div>
    </div>
  );
}

export default page;


