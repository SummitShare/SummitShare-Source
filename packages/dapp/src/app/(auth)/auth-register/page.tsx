'use client';
import { Button } from '@/components/button/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { TextInput } from '@/components/inputs/TextInput';
import { usePasswordVisibility } from '@/utils/methods/auth/usePasswordVisibility';

function Page() {
   const router = useRouter();

   const { inputType, PasswordToggle } = usePasswordVisibility();

   // State management
   const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
   });
   const [errorMessage, setErrorMessage] = useState<string>('');
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [status, setStatus] = useState<number>();

   // Handle form input changes
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
      setErrorMessage(''); // Clear error messages on change
   };

   // Create user function
   const createUser = async (userData: typeof formData) => {
      const host = process.env.NEXT_PUBLIC_HOST;
      const url = `${host}/api/v1/signup`;

      try {
         const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, type: 'visitor' }),
         });

         setStatus(response.status);
         return response;
      } catch (error) {
         console.error('Failed to create user:', error);
         throw error;
      }
   };

   // Form submission
   const onSubmit = async () => {
      setIsLoading(true);
      try {
         const response = await createUser(formData);
         responseHandler(response.status);
      } catch (error) {
         setErrorMessage('An error occurred. Please try again.');
      } finally {
         setIsLoading(false); // Reset loading state
      }
   };

   // Handle API responses
   const responseHandler = (response: number) => {
      switch (response) {
         case 400:
            setErrorMessage('No email or password sent');
            break;
         case 409:
            setErrorMessage('User already exists or username in use');
            break;
         case 201:
            router.push('/verification/email');
            break;
         default:
            setErrorMessage(
               'Something went wrong please contact support@summitshare.co'
            );
      }
   };

   return (
      <div className="relative flex flex-col items-center justify-center px-6 py-10 bg-white h-screen md:w-[50%] md:float-right">
         <nav className="absolute top-5 w-full flex flex-row justify-between items-center px-5">
            <p className="">
               Step 1<span> of 2</span>
            </p>
            <Link href="/">Exit</Link>
         </nav>

         <section className="space-y-4 md:w-[70%]">
            <header className="text-center space-y-2">
               <h1 className="text-orange-500">Create account</h1>
               <p>Learn more about the history you love</p>
            </header>

            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit();
               }}
               className="space-y-6"
            >
               <section className="space-y-4">
                  <TextInput
                     type="text"
                     label="Username"
                     name="username"
                     value={formData.username}
                     onChange={handleChange}
                  />
                  <TextInput
                     type="email"
                     label="Email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                  />
                  <div className="relative">
                     <TextInput
                        type={inputType}
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                     />
                     <PasswordToggle />
                     {errorMessage && (
                        <p className="text-red-500 text-sm mt-2">
                           {errorMessage}
                        </p>
                     )}
                  </div>
               </section>

               <section className="text-center space-y-6">
                  <Button
                     size="medium"
                     type="submit"
                     className={`w-full ${isLoading && 'cursor-wait'} ${
                        status === 200 && 'cursor-not-allowed'
                     }`}
                     disabled={
                        (status !== undefined && status <= 200) || isLoading
                     } // Disable button when loading
                  >
                     {isLoading ? 'Creating account...' : 'Create my account'}
                  </Button>
                  <p>
                     By continuing you accept our standard{' '}
                     <a
                        className="underline text-blue-700"
                        href="https://hackmd.io/@summitshare-eth/BygXfsxEJl"
                     >
                        terms and conditions
                     </a>
                     {''}
                     and{' '}
                     <a
                        className="underline text-blue-700"
                        href="https://hackmd.io/@summitshare-eth/BygXfsxEJl"
                     >
                        our privacy policy
                     </a>
                     .
                  </p>
                  <p>
                     Already have an account?{' '}
                     <a
                        className="underline text-orange-600"
                        href="/auth-sign-in"
                     >
                        Sign in
                     </a>
                  </p>
               </section>
            </form>
         </section>
      </div>
   );
}

export default Page;
