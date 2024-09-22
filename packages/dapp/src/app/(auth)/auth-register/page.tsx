'use client';
import Buttons from '@/app/components/button/Butons';
import Inputs from '@/app/components/inputs/Inputs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

function Page() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<number>();
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const createUser = async ({ email, password, username }: any) => {
    const host = process.env.NEXT_PUBLIC_HOST;
    const url = `${host}/api/v1/signup`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
          type: 'visitor',
        }),
      });

      setStatus(response.status);
      return response;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await createUser(data);
      if (response.status === 409) {
        const errorData = await response.json();
        setErrorMessage('Username or email already exists');
        setUsernameError(true);
        setEmailError(true);
      } else if (response.ok) {
        router.push('/verification/email');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <main className="h-screen flex flex-col justify-end items-center bg-[url('https://images.unsplash.com/photo-1621419203897-20b66b98d495?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center md:flex-row">
      <div className="bg-gray-950/35 fixed inset-0"></div>

      <div className="flex flex-col justify-between px-6 py-10 bg-white h-screen md:w-[50%] lg:w-[30%] md:float-right z-10">
        <nav className="w-full flex flex-row justify-between items-center">
          <p className="text-p2-m">
            Step 1<span> of 2</span>
          </p>
          <Link href="/">Exit</Link>
        </nav>

        <section className="space-y-4">
          <header className="text-center space-y-2">
            <div className="relative mx-auto h-12 w-12">
              <Image
                src="https://summitshare3.s3.eu-north-1.amazonaws.com/IMG_3157.PNG"
                alt="Logo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'contain' }}
              />
            </div>

            <h2>Create account</h2>

            <p>Learn about the history you love!</p>
          </header>

          <form action="">
            <section className="space-y-4">
              <Inputs
                type="input"
                //@ts-ignore
                state={usernameError ? 'error' : 'active'}
                label="Username"
                value={username}
                onChange={(value) => {
                  setUsername(value);
                  setUsernameError(false);
                  setErrorMessage('');
                }}
              />
              <Inputs
                type="input"
                //@ts-ignore
                state={emailError ? 'error' : 'active'}
                label="Email"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  setEmailError(false);
                  setErrorMessage('');
                }}
              />
              <Inputs
                type="input"
                label="Password"
                state="active"
                isPassword={true}
                value={password}
                onChange={(value) => setPassword(value)}
              />
            </section>
          </form>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </section>
        <section className="text-center space-y-6">
          <Buttons
            type="primary"
            size="large"
            onClick={() => onSubmit({ email, password, username })}
          >
            Create my account
          </Buttons>
          <p>
            By continuing you accept our standard{' '}
            <a className="underline" href="">
              terms and conditions
            </a>{' '}
            and{' '}
            <a className="underline" href="">
              our privacy policy
            </a>
            .
          </p>
          <p>
            Already have an account?{' '}
            <a className="underline" href="/auth-sign-in">
              Sign in
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Page;
