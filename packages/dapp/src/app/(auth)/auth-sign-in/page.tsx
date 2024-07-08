'use client';
import Buttons from '@/app/components/button/Butons';
import Inputs from '@/app/components/inputs/Inputs';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { authUserSignIn } from '@/utils/dev/frontEndInterfaces';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function Page() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const onSubmit = useCallback(async () => {
    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (response?.status !== 200) {
      // @ts-ignore
      setStatus(response.status);
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000); // 4 seconds

      return () => clearTimeout(timer);
    }

    setStatus(response.status);
    response.status === 200 && router.push('/');
  }, [email, password, router]);

  useEffect(() => {
    if (status !== null && status !== 200) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000); // 4 seconds

      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="flex flex-col justify-between px-6 py-10 bg-white h-screen md:w-[50%] lg:w-[30%] md:float-right">
      <nav className="w-full flex flex-row justify-end items-center">
        <Link href="/">Exit</Link>
      </nav>
      <section className="space-y-6">
        <header className="text-center space-y-2">
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
              state="active"
              label="Password"
              value={password}
              onChange={(value) => setPassword(value)}
            />
          </section>
        </form>
      </section>

      <section className="relative text-center space-y-6">
        <Buttons type="primary" size="large" onClick={onSubmit}>
          Sign into my account
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
          I don’t have an account{' '}
          <a className="underline" href="/auth-register">
            Register
          </a>
        </p>
        <div
          className={`bg-red-500 border w-[90%] rounded-md p-3 absolute right-5 z-10 transition-transform duration-500 border-red-300 text-center ${
            isVisible ? 'translate-y-0 bottom-5' : 'translate-y-full -bottom-20'
          }`}
        >
          <p className="text-sm text-white font-semibold">wrong password or email</p>
        </div>
      </section>
    </div>
  );
}

export default Page;
