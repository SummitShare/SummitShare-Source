'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/Button';
import { TextInput } from '@/components/inputs/TextInput';
import { usePasswordVisibility } from '@/utils/methods/auth/usePasswordVisibility';
import { desableButton } from '@/app/(test)/functions/disable';

function ResetPassword({ params }: { params: { token: string } }) {
   const router = useRouter();
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [passwordError, setPasswordError] = useState(false);
   const [confirmPasswordError, setConfirmPasswordError] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
   const [status, setStatus] = useState<number>();
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [successMessage, setSuccessMessage] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
   const { inputType, PasswordToggle } = usePasswordVisibility();

   const resetPassword = async () => {
      // Validate passwords
      if (password !== confirmPassword) {
         setPasswordError(true);
         setConfirmPasswordError(true);
         setErrorMessage('Passwords do not match');
         return;
      }

      if (password.length < 8) {
         setPasswordError(true);
         setErrorMessage('Password must be at least 8 characters');
         return;
      }

      const host = process.env.NEXT_PUBLIC_HOST;
      const url = `${host}/api/v1/user/password/verifyToken?token=${params.token}`;

      setIsLoading(true);
      try {
         const response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               token: params.token,
               password: password,
            }),
         });

         if (response.ok) {
            // Redirect to sign in or show success message
            setSuccessMessage('Password reset successful!');
            setShowSuccessPopup(true);
            setStatus(await response.status);
            // Delay and redirect to sign-in page
            setTimeout(() => {
               router.push('/auth-sign-in');
            }, 3000); // duration of redirect
         } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || 'Failed to reset password');
         }
      } catch (error) {
         console.error('Password reset failed:', error);
         setErrorMessage('Please try again.');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="relative flex flex-col items-center justify-center px-6 py-10 bg-white h-screen md:w-[50%] md:float-right">
         <nav className="absolute top-5 w-full flex justify-end items-center px-5">
            <Link href="/">Exit</Link>
         </nav>

         <section className="space-y-4 md:w-[70%]">
            <header className="text-center space-y-2">
               <h1 className="text-orange-500">Create New Password</h1>
               <p>Enter a strong, unique password</p>
            </header>

            <form action="">
               <section className="space-y-4">
                  <div className="relative">
                     <TextInput
                        type={inputType}
                        label="Password"
                        value={password}
                        onChange={(e) => {
                           setPassword(e.target.value);
                           setPasswordError(false);
                           setErrorMessage('');
                        }}
                     />
                     <PasswordToggle />
                  </div>
                  <div className="relative">
                     <TextInput
                        type={inputType}
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                           setConfirmPassword(e.target.value);
                           setConfirmPasswordError(false);
                           setErrorMessage('');
                        }}
                     />
                     <PasswordToggle />
                  </div>
                  {errorMessage && (
                     <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                  )}
               </section>
            </form>
            <section className="text-center space-y-6">
               <Button
                  disabled={desableButton(status, isLoading)}
                  className={`full ${isLoading && 'cursor-wait'} ${
                     status === 200 && 'cursor-not-allowed'
                  }`}
                  onClick={resetPassword}
               >
                  Reset Password
               </Button>

               <p>
                  Remember your password?{' '}
                  <a className="underline text-orange-500" href="/auth-sign-in">
                     Sign in
                  </a>
               </p>
            </section>
         </section>
      </div>
   );
}

export default ResetPassword;
{
   /* Success Popup */
}
// {showSuccessPopup && (
//    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50 z-50">
//       <div className="bg-white p-6 rounded-md shadow-md text-center space-y-4">
//          <h3 className="text-xl font-semibold text-green-600">
//             {successMessage}
//          </h3>
//          <p>You will be redirected to the sign-in page shortly.</p>
//       </div>
//    </div>
// )}
