'use client';
import { Button } from '@/components/button/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function Page({ params }: { params: { token: string } }) {
   const router = useRouter();
   const [verificationStatus, setVerificationStatus] = useState<number | null>(
      null
   );
   const [verificationMessage, setVerificationMessage] = useState<string | null>(
      null
   );
   const [resendConfirmation, setResendConfirmation] = useState<string | null>(
      null
   );
   const [loading, setLoading] = useState<boolean>(true);
   const hasFetched = useRef(false);
   const host = process.env.NEXT_PUBLIC_HOST;

   // Email verification logic
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
                  headers: { 'Content-Type': 'application/json' },
               }
            );

            const { message } = await response.json();
            setVerificationMessage(message);
            setVerificationStatus(response.status);
         } catch (error) {
            console.error('Verification request failed:', error);
            setVerificationMessage('An error occurred. Please try again later.');
         } finally {
            setLoading(false);
         }
      };

      verifyEmail();
   }, [params.token, host]);

   // Resend verification email
   const resendVerificationEmail = async () => {
      try {
         const response = await fetch(
            `${host}/api/v1/user/verification/requestVerification?token=${params.token}`,
            {
               method: 'GET',
               headers: { 'Content-Type': 'application/json' },
            }
         );

         if (response.ok) {
            setVerificationMessage('Verification email has been resent!');
            router.push('/verification/email');
         } else {
            setVerificationMessage('Failed to resend email. Please try again.');
         }
      } catch (error) {
         console.error('Resend verification request failed:', error);
         setResendConfirmation('An error occurred. Please try again.');
      } finally {
         // Clear confirmation message after 3 seconds
         setTimeout(() => setResendConfirmation(null), 3000);
      }
   };

   return (
      <div className="relative flex flex-col items-center justify-center px-6 py-10 bg-white h-screen md:w-[50%] md:float-right">
         {/* Navigation */}
         <nav className="absolute top-5 w-full flex justify-between items-center px-5">
            <p className="text-gray-600">
               Step 2<span> of 2</span>
            </p>
            <Link href="/">Exit</Link>
         </nav>

         {/* Main Content */}
         <div className="text-center space-y-4">
            {!loading && (
               <h1
                  className={
                     verificationStatus === 200
                        ? 'text-orange-500'
                        : 'text-red-500'
                  }
               >
                  {verificationStatus === 200 ? 'Woohoo!' : 'Whoops!'}
               </h1>
            )}

            {/* Display verification message */}
            <p>{loading ? 'Verifying your email...' : verificationMessage}</p>

            {/* Display resend confirmation message */}
            {/* {resendConfirmation && (
               <p className="text-green-600 font-semibold">{resendConfirmation}</p>
            )} */}

            {/* Continue Button */}
            {verificationStatus === 200 && !loading && (
               <Button size="medium" onClick={() => router.push('/auth-sign-in')}>
                  Continue
               </Button>
            )}

            {/* Resend Verification Button */}
            {!loading && verificationStatus !== 200 && (
               <Button size="medium" onClick={resendVerificationEmail}>
                  Resend Email
               </Button>
            )}
         </div>
      </div>
   );
}

export default Page;
