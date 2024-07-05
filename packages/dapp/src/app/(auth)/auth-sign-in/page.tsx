'use client';
import Buttons from '@/app/components/button/Butons';
import Inputs from '@/app/components/inputs/Inputs';
import React, { useState } from 'react';
import Link from 'next/link';
import { authUserSignIn } from '@/utils/dev/frontEndInterfaces';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function Page() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const router = useRouter();

  const onSubmit = async () => {
    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    console.log(response?.status);
    const status = response?.status;
    {
      status == 200 ? router.push('/') : alert('wrong email password');
    }
  };

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
              onChange={(value) => setEmail}
            />
            <Inputs
              type="input"
              state="active"
              label="Password"
              value={password}
              onChange={(value) => setPassword}
            />
          </section>
        </form>
      </section>

      <section className="text-center space-y-6">
        <div onClick={() => onSubmit()} className="w-full">
          
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
          I don’t have an account{' '}
          <a className="underline" href="/auth-sign-in">
            Register
          </a>
        </p>
      </section>
    </div>
  );
}

export default Page;
