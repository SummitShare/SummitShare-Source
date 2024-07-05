'use client';
import Buttons from '@/app/components/button/Butons';
import Inputs from '@/app/components/inputs/Inputs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function Page() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState();

  const createUser = async ({
    email,
    password,
    username,
    wallet_address,
  }: any) => {
    // Ensure HOST is read correctly, considering Next.js environment variables need to be prefixed with NEXT_PUBLIC_ if they are to be used on the client-side.
    const host = process.env.NEXT_PUBLIC_HOST;
    console.log(`host ${host} `);

    // Construct the URL with the correct protocol (http or https) and ensure that the HOST variable includes the entire domain.
    const url = `${host}api/v1/signup`;
    console.log(`url ${url} `);

    try {
      const type = 'exhibitor';
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

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        // You could throw an error or handle it in another way depending on your error handling strategy
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      return response.json(); // Assuming the server responds with JSON.
    } catch (error) {
      console.error('Failed to create user:', error);
      // Depending on how you want to handle errors, you might want to re-throw the error or handle it here
      throw error;
    }
  };

  const onSubmit = async (data: any) => {
    const response = await createUser(data);
    console.log(response);
    router.push('/auth-sign-in');
    console.log(data);
  };

  return (
    <div className=" flex flex-col justify-between px-6 py-10 bg-white h-screen md:w-[50%] lg:w-[30%] md:float-right">
      <nav className="w-full flex flex-row justify-between items-center">
        <p className="text-p2-m">
          Step 1<span> of 2</span>
        </p>
        <Link href="/">Exit</Link>
      </nav>
      <section className="space-y-4">
        <header className="text-center space-y-2">
          <h2>Create account</h2>
          <p>Learn about the history you love!</p>
        </header>

        <form action="">
          <section className="space-y-4">
            <Inputs
              type="input"
              state="active"
              label="Username"
              value={username}
              onChange={(value) => setUsername(value)}
            />
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
      <section className="text-center space-y-6">
        <Buttons
          type="primary"
          size="large"
          //@ts-ignore
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
          <a className="underline" href="/`/auth-sign-up">
            Sign in
          </a>
        </p>
      </section>
    </div>
  );
}

export default Page;
