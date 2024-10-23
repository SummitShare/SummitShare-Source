// function page() {
//   return (
//     <div className=" w-full flex items-center justify-center fixed inset-0 bg-gray-50 z-20 ">
//       <div className="flex flex-col gap-6 items-center justify-center  ">
//         <h1 className="text-3xl text-gray-950 ">
//           Summit<span className="text-orange-500">Share</span>
//         </h1>
//         <div className=" flex flex-col gap-4 items-center justify-center">
//           <div className=" w-[80%] text-center  md:w-fit">
//             <p className="text-xs text-gray-700">
//               You have been invited by Mariomaguyasjere@gmail.com to join{" "}
//             </p>
//           </div>

//           <h1 className="text-xl font-bold text-gray-950">
//             Jacks crypto party
//           </h1>
//         </div>
//       </div>
//       <div className="space-y-3 ring-1 ring-gray-300 rounded-md py-3 px-4 fixed bottom-5 right-5 left-5  md:right-5 md:left-[60%] ">
//         <p className="text-sm text-gray-700">
//           This invitation is currently valid choose to accept or decline now
//         </p>
//         <div className="flex flex-row gap-2 ">
//           <Link href={"/"}>
//             <button className="ring-1 ring-gray-300 rounded-md px-3 py-2 text-xs">
//               accept
//             </button>
//           </Link>
//           <Link href={"/"}>
//             <button className="ring-1 ring-gray-300 rounded-md px-3 py-2 text-xs">
//               decline
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default page;

'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function Page({ params }: { params: { token: string } }) {
   const router = useRouter();
   const [verificationStatus, setverificationStatus] = useState<number>();
   const [verificationMessage, setVerificationMessage] = useState<number>();
   const hasFetched = useRef(false);

   const handleRequest = async (response: string) => {
      const token = params.token;
      if (!token || hasFetched.current) return;
      hasFetched.current = true;
      try {
         const host = process.env.NEXT_PUBLIC_HOST;
         await fetch(
            `${host}/api/v1/proposal/requests/acceptRequests?token=${token}`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ response, token }),
            }
         );
      } catch (error) {
         console.error('Verification request failed:', error);
      }

      // ////console.log(`token ${token}`)
      // ////console.log(`choice ${response}`)

      router.push('/');
   };

   // const verifyEmail =  () => {

   //   try {
   //   //
   //   // });
   //     // const { status } = response
   //     // const { message } = await response.json()
   //     ////console.log(`token ${dataToken}`)
   //     ////console.log(`choice ${response}`)

   //     // setVerificationMessage(message);
   //     // setverificationStatus(response?.status)

   //   } catch (error) {
   //     console.error('Verification request failed:', error);
   //   }
   // };

   // verifyEmail();

   return (
      <div className=" w-full flex items-center justify-center fixed inset-0 bg-gray-50 z-20 ">
         <div className="flex flex-col gap-6 items-center justify-center  ">
            <h1 className="text-3xl text-gray-950 ">
               Summit<span className="text-orange-500">Share</span>
            </h1>
            <div className=" w-[80%] text-center">
               <p className="text-sm text-gray-700">{verificationMessage}</p>
            </div>
         </div>

         {verificationStatus === 400 ? null : (
            <div className="space-y-3 ring-1 ring-gray-300 rounded-md py-3 px-4 fixed bottom-5 right-5 left-5  md:right-5 md:left-[60%] ">
               <p className="text-sm text-gray-700">
                  {/* {verificationStatus === 200 ?

        " navigate to the home page and start your cultural adventure"
        : "Resend verified eamil note it will expire in 1 hour"} */}

                  {verificationMessage}
               </p>
               <div className="flex flex-row gap-2">
                  <button
                     onClick={() => {
                        handleRequest('Accepted');
                     }}
                     className="ring-1 ring-gray-300 rounded-md px-3 py-2 text-xs"
                  >
                     Accept
                  </button>

                  <button
                     onClick={() => {
                        handleRequest('Rejected');
                     }}
                     className="ring-1 ring-gray-300 rounded-md px-3 py-2 text-xs"
                  >
                     Reject
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

export default Page;
