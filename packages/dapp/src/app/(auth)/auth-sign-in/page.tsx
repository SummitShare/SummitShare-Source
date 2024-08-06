'use client';
import Buttons from '@/app/components/button/Butons';
import Inputs from '@/app/components/inputs/Inputs';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function Page() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const onSubmit = useCallback(async () => {
    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (response) {
      if (response.error) {
        // Handle different error types
        if (response.status === 401) {
          setErrorMessage('Username or email incorrect');
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
        setIsVisible(true);
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 4000);

        return () => clearTimeout(timer);
      } else {
        // Successful login
        router.push('/');
      }
    } else {
      // Handle the case where response is undefined
      setErrorMessage('An error occurred. Please try again.');
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [email, password, router]);

  return (
    <main className="h-screen flex flex-col justify-end items-center bg-[url('https://images.unsplash.com/photo-1606885118474-c8baf907e998?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMGFydHxlbnwwfHwwfHx8MA%3D%3D')] bg-cover bg-center md:flex-row">
      <div className="bg-gray-950/35 fixed inset-0"></div>

      <div className="flex flex-col justify-between px-6 py-10 bg-white h-screen md:w-[50%] lg:w-[30%] md:float-right z-10">
        <nav className="w-full flex flex-row justify-end items-center">
          <Link href="/">Exit</Link>
        </nav>

        <section className="space-y-6">
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
            <h2>Sign in</h2>
            <p>Learn about the history you love!</p>
          </header>

          <form action="" className="space-y-[48px]">
            <section className="space-y-4">
              <Inputs
                type="input"
                state="active"
                label="Email"
                value={email}
                onChange={(value) => setEmail(value)}
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
        </section>

        <section className="relative text-center space-y-6">
          <div onClick={onSubmit} className="w-full">
            <Buttons type="primary" size="large">
              Sign into my account
            </Buttons>
          </div>
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
            I don&apos;t have an account{' '}
            <a className="underline" href="/auth-register">
              Register
            </a>
          </p>
          <div
            className={`bg-red-500 border w-[90%] rounded-md p-3 absolute right-5 z-10 transition-transform duration-500 border-red-300 text-center ${
              isVisible
                ? 'translate-y-0 bottom-5'
                : 'translate-y-full -bottom-20'
            }`}
          >
            <p className="text-sm text-white font-semibold">{errorMessage}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Page;
