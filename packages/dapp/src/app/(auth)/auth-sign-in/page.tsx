'use client';
import { Button } from '@/components/button/Button';
import Link from 'next/link';
import React, { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextInput } from '@/components/inputs/TextInput';
import { usePasswordVisibility } from '@/utils/methods/auth/usePasswordVisibility';

function Page() {
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [errorMessage, setErrorMessage] = useState<string>('');
   const [isVisible, setIsVisible] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const { inputType, PasswordToggle } = usePasswordVisibility();
   const [status, setStatus] = useState<number>();
   const router = useRouter();

   const onSubmit = useCallback(async () => {
      setIsLoading(true);
      const response = await signIn('credentials', {
         email,
         password,
         redirect: false,
      });

      if (response) {
         if (response.error) {
            // Handle error response
            if (response.status === 401) {
               setErrorMessage('Incorrect email or password.');
            } else {
               setErrorMessage('An error occurred. Please try again.');
            }
            setIsVisible(true);
            setTimeout(() => setIsVisible(false), 4000);
         } else {
            // Successful login
            router.push('/');
            setStatus(await response.status);
         }
      } else {
         setErrorMessage('An error occurred. Please try again.');
         setIsVisible(true);
         setTimeout(() => setIsVisible(false), 4000);
      }
      setIsLoading(false);
   }, [email, password, router]);

   return (
      <div className="relative flex flex-col items-center justify-center px-6 py-10 bg-white h-screen md:w-[50%] md:float-right">
         {/* Navigation */}
         <nav className="absolute top-5 w-full flex justify-end items-center px-5">
            <Link href="/">Exit</Link>
         </nav>

         {/* Header */}
         <section className="space-y-4 md:w-[70%]">
            <header className="text-center space-y-2">
               <h1 className="text-orange-500">Sign in</h1>
               <p>Learn more about the history you love!</p>
            </header>

            {/* Form */}
            <form className="space-y-6">
               <section className="space-y-4">
                  <TextInput
                     type="email"
                     label="Email"
                     value={email}
                     onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage('');
                     }}
                  />
                  <div className="relative">
                     <TextInput
                        type={inputType}
                        label="Password"
                        value={password}
                        onChange={(e) => {
                           setPassword(e.target.value);
                           setErrorMessage('');
                        }}
                     />
                     <PasswordToggle />
                  </div>
                  {errorMessage && (
                     <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                  )}
               </section>
               <a
                  className="underline text-xs mt-1 hover:text-red-500 transition-all"
                  href="/account/forgot-request"
               >
                  Forgot password?
               </a>
               <Button
                  size="medium"
                  onClick={onSubmit}
                  className={`w-full ${isLoading && 'cursor-wait'} ${
                     status === 200 && 'cursor-not-allowed'
                  }`}
                  disabled={(status !== undefined && status <= 200) || isLoading}
               >
                  {isLoading ? 'Signing in...' : 'Sign into my account'}
               </Button>
            </form>
            <section className=" text-center space-y-6">
               <p>
                  By continuing you accept our standard{' '}
                  <a
                     className="underline  text-blue-600"
                     href="https://hackmd.io/@summitshare-eth/BygXfsxEJl"
                  >
                     terms and conditions
                  </a>{' '}
                  and{' '}
                  <a
                     className="underline text-blue-600"
                     href="https://hackmd.io/@summitshare-eth/BygXfsxEJl"
                  >
                     our privacy policy
                  </a>
                  .
               </p>
               <p>
                  I don&apos;t have an account{' '}
                  <Link
                     className="underline text-orange-600"
                     href="/auth-register"
                  >
                     Register
                  </Link>
               </p>
            </section>
         </section>

         {/* Footer */}
      </div>
   );
}

export default Page;
