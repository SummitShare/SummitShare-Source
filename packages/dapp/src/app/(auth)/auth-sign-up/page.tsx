/**
 * This TypeScript file defines a React component for a user registration page. It utilizes Tailwind CSS for styling
 * and React Hook Form for form handling. The page features a visually appealing full-screen background with a form
 * overlay for account creation. The form collects user information like username, email, password, and includes
 * predefined default values for each field. It showcases form validation and submission using React Hook Form's
 * functionalities. This component is structured to import and use custom components like `ButtonOrange` and `Input`
 * for UI elements, and it employs Next.js's `Link` for navigation. The overall purpose of this component is to provide
 * a user-friendly interface for account registration within a web application.
 */

"use client";
import ButtonOrange from "@/app/components/common/button/buttonOrange";
import Input from "@/app/components/common/inputs/input/input";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { authUserProps } from "@/utils/dev/frontEndInterfaces";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "mario jere",
      email: "mariomaguyasjere@gmail.com",
      walletAddress: "0x64d18b130b676C784B8F3Aa6287fc69821A2A01b",
      password: "123456",
    },
  });

  const onSubmit = (data: authUserProps) => {
    console.log(data);
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
            <Input
              type="text"
              label="username"
              name="userName"
              placeholder="username"
              register={register}
              required
            />
            <Input
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
          </div>
          <ButtonOrange text="text-[0.9rem]" width="w-full">
            Create Account
          </ButtonOrange>
        </div>

        <div className="w-full text-center mt-20">
          <Link
            className="text-gray-800 underline text-sm  font-semibold"
            href={`#`}
          >
            Already have an account? Sign in!
          </Link>
        </div>
      </form>
    </main>
  );
};

export default Register;
