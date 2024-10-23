'use client';
import Buttons from '@/app/components/button/Butons';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LoadingDots from '@/app/(main)/exhibit/loadingDots';

function Page({ params }: { params: { token: string } }) {
   const router = useRouter();
   const [verificationStatus, setVerificationStatus] = useState<number>();
   const [verificationMessage, setVerificationMessage] = useState<number>();
   const hasFetched = useRef(false);
   const [resendConfirmation, setResendConfirmation] = useState<string | null>(
      null
   );
   const [loading, setLoading] = useState<boolean>(true);
   const host = process.env.NEXT_PUBLIC_HOST;

   useEffect(() => {
      const verifyEmail = async () => {
         if (!params.token || hasFetched.current) return;
         hasFetched.current = true;

         try {
            setLoading(true);
            const response = await fetch(
               `${host}/api/v1/user/verification/verifyEmail?token=${params.token}`,
               {
                  method: 'GET',
                  headers: {
                     'Content-Type': 'application/json',
                  },
               }
            );
            const { status } = response;
            const { message } = await response.json();
            // ////console.log(`status ${status}`)
            // ////console.log(`message ${message}`)

            setVerificationMessage(message);
            setVerificationStatus(response?.status);

            //console.log("First token received:", params.token)
            //console.log("Second token received:", response)
         } catch (error) {
            console.error('Verification request failed:', error);
         } finally {
            setLoading(false);
         }
      };

      verifyEmail();
   }, [params.token, host]);

   const resendVerificationEmail = async () => {
      try {
         const response = await fetch(
            `${host}/api/v1/user/verification/requestVerification?token=${params.token}`,
            {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               },
            }
         );

         if (response.ok) {
            setResendConfirmation('Email resent!');
            // Clear the confirmation message after 3 seconds
            setTimeout(() => setResendConfirmation(null), 3000);
         } else {
            setResendConfirmation('Failed to resend email. Please try again.');
            setTimeout(() => setResendConfirmation(null), 3000);
         }
      } catch (error) {
         console.error('Resend verification request failed:', error);
         setResendConfirmation('An error occurred. Please try again.');
         setTimeout(() => setResendConfirmation(null), 3000);
      }
   };
   return (
      <main className="h-screen flex flex-col justify-end items-center relative">
         <Image
            src="https://images.unsplash.com/photo-1652383003064-102c52898ccf?q=80&w=2163&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background Image"
            layout="fill"
            className="object-cover bg-center"
         />
         <div className="bg-gray-950/35 fixed inset-0"></div>

         <div className="flex flex-col items-center justify-between px-6 py-10 bg-white h-screen md:w-[50%] lg:w-[30%] md:float-right z-10">
            <nav className="w-full flex flex-row justify-between items-center">
               <p>
                  Step 3<span> of 3</span>
               </p>
               <Link href="/">Exit</Link>
            </nav>
            <div className="text-center space-y-2">
               {loading ? ( // Check if loading is true
                  <LoadingDots /> // Show loading dots while waiting for the response
               ) : (
                  <>
                     <h1>{verificationStatus === 200 ? 'Woohoo!' : 'whoops!'}</h1>
                     <p>{verificationMessage}</p>
                     {resendConfirmation && (
                        <p className="text-green-600 font-semibold">
                           {resendConfirmation}
                        </p>
                     )}
                  </>
               )}
            </div>

            {!loading && ( // Only show this image when loading is finished
               <Image
                  src={
                     verificationStatus === 200 ? '/swinging.svg' : '/petting.svg'
                  }
                  alt="Verification Status Image"
                  width={500}
                  height={500}
               />
            )}
            <div className="w-full">
               <Buttons
                  type="primary"
                  size="large"
                  onClick={
                     verificationStatus === 200
                        ? () => router.push('/auth-sign-in')
                        : resendVerificationEmail
                  }
               >
                  {verificationStatus === 200 ? 'Continue' : 'Resend'}
               </Buttons>
            </div>
         </div>
      </main>
   );
}

export default Page;
