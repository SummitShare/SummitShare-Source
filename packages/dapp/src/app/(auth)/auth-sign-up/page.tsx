/**
 * This TypeScript file defines a React component for a user registration page. It utilizes Tailwind CSS for styling
 * and React Hook Form for form handling. The page features a visually appealing full-screen background with a form
 * overlay for account creation. The form collects user information like username, email, password, and includes
 * predefined default values for each field. It showcases form validation and submission using React Hook Form's
 * functionalities. This component is structured to import and use custom components like `ButtonOrange` and `Input`
 * for UI elements, and it employs Next.js's `Link` for navigation. The overall purpose of this component is to provide
 * a user-friendly interface for account registration within a web application.
 */

'use client';

import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { authUserProps } from '@/utils/dev/frontEndInterfaces';
import { useRouter } from 'next/navigation';

const Register = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'mariomaguyasjere@gmail.com',
      type: 'visitor',
      password: '12345678',
    },
  });

  const createUser = async ({ email, password, username }: any) => {
    // Ensure HOST is read correctly, considering Next.js environment variables need to be prefixed with NEXT_PUBLIC_ if they are to be used on the client-side.
    const host = process.env.NEXT_PUBLIC_HOST;
    //console.log(`host ${host} `)

    // Construct the URL with the correct protocol (http or https) and ensure that the HOST variable includes the entire domain.
    const url = `${host}api/v1/signup`;
    //console.log(`url ${url} `)

    try {
      const type = 'visitor';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, type }),
      });

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        // You could throw an error or handle it in another way depending on your error handling strategy
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      {
        response.status === 201
          ? router.push(`/verifcation/sign-up/${email}`)
          : alert('error');
      }

      return response.json(); // Assuming the server responds with JSON.
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const onSubmit = async (data: any) => {
    const response = await createUser(data);
    //console.log(response.status);
  };

  return (
    <main className="h-screen flex flex-col justify-end items-center bg-[url('https://images.unsplash.com/photo-1606885118474-c8baf907e998?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMGFydHxlbnwwfHwwfHx8MA%3D%3D')] bg-cover bg-center  md:flex-row">
      <div className="bg-gray-950/35 fixed inset-0 "></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col items-center justify-center h-[75%]  w-full gap-6 z-10 p-10 bg-white rounded-t-[48px] md:h-full  md:rounded-l-[32px] md:rounded-tr-[0px]  md:w-[35%] "
      >
        <div className="space-y-6 w-full">
          <div className="w-full text-center my-6">
            <h1 className="font-bold text-gray-950 text-2xl">Create Account</h1>
          </div>

          <div className="w-full space-y-3 ">
            {/* <Input
              type="email"
              label="email"
              name="email"
              placeholder="email@example.com"
              register={register}
              required
            />
            <Input
              type="password"
              label="password"
              name="password"
              register={register}
              required
            />
         
          <ButtonOrange text="text-[0.9rem]" width="w-full">
            Create Account
          </ButtonOrange> */}
          </div>
        </div>

        <div className="w-full text-center mt-20">
          <p className="text-gray-800 underline text-sm  font-semibold">
            Already have an account?
            <Link className="underline" href={`/auth-sign-up`}>
              Sign in!
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default Register;
