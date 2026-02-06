'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/Button';
import { TextInput } from '@/components/inputs/TextInput';
import { NoUndefined } from 'viem/_types/types/utils';

function ForgotPasswordRequest() {
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [status, setStatus] = useState<number>();
   const [feedbackMessage, setFeedbackMessage] = useState<{
      message: string;
      type: 'error' | 'success' | null;
   }>({ message: '', type: null });
   const [isLoading, setIsLoading] = useState(false);

   const sendPasswordResetRequest = async (email: string) => {
      const host = process.env.NEXT_PUBLIC_HOST;
      const url = `${host}/api/v1/user/password/requestToken`;

      try {
         const response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
         });

         setStatus(await response.status);

         if (response.ok) {
            setFeedbackMessage({
               message: 'Password reset link sent to your email.',
               type: 'success',
            });

            return true;
         }

         if (response.status === 404) {
            setFeedbackMessage({
               message: 'No account associated with this email.',
               type: 'error',
            });
            return false;
         }

         setFeedbackMessage({
            message: 'An error occurred. Please try again.',
            type: 'error',
         });
         return false;
      } catch (error) {
         console.error('Failed to send password reset request:', error);
         setFeedbackMessage({
            message: 'Network error. Please try again.',
            type: 'error',
         });
         return false;
      }
   };

   const handleSubmit = async () => {
      if (!email) {
         setFeedbackMessage({
            message: 'Please enter your email.',
            type: 'error',
         });
         return;
      }

      setIsLoading(true);
      const success = await sendPasswordResetRequest(email);
      setIsLoading(false);

      if (success) {
         setTimeout(() => {
            router.push('/verification/forgot-password');
         }, 3000);
      }
   };

   return (
      <div className="relative flex flex-col items-center justify-center px-6 py-10 bg-white h-screen md:w-[50%] md:float-right">
         {/* Navigation */}
         <nav className="absolute top-5 w-full flex justify-end items-center px-5">
            <Link href="/">Exit</Link>
         </nav>

         {/* Content */}
         <section className="space-y-4 md:w-[70%]">
            <header className="text-center space-y-2">
               <h1 className="text-orange-500">Reset Password</h1>
               <p>Enter the email associated with your account</p>
            </header>

            <form className="space-y-6">
               <TextInput
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => {
                     setEmail(e.target.value);
                     setFeedbackMessage({ message: '', type: null });
                  }}
               />

               {/* Feedback Messages */}
               {feedbackMessage.message && (
                  <div
                     className={`text-sm px-4 py-2 rounded-md mt-2 ${
                        feedbackMessage.type === 'error'
                           ? 'bg-red-100 text-red-700'
                           : 'bg-green-100 text-green-700'
                     }`}
                  >
                     {feedbackMessage.message}
                  </div>
               )}

               {/* Action Buttons */}
               <div className="flex flex-col gap-4 items-center">
                  <Button
                     disabled={(status !== undefined && status <= 200) || isLoading}
                     onClick={handleSubmit}
                     className={`${isLoading && 'cursor-wait'} ${
                        status === 200 && 'cursor-not-allowed'
                     }`}
                  >
                     {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                  <p>
                     Remember your password?{' '}
                     <Link
                        className="underline text-orange-500"
                        href="/auth-sign-in"
                     >
                        Sign in
                     </Link>
                  </p>
               </div>
            </form>
         </section>
      </div>
   );
}

export default ForgotPasswordRequest;
