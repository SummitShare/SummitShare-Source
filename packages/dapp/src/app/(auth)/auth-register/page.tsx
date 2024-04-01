/**
 * Register Component
 *
 * This component forms the registration page of the application, where users can create a new account. It is designed with
 * a user-friendly interface that collects essential information like username, email, wallet address, and password. The
 * component uses `react-hook-form` for form management, ensuring validation and smooth handling of form submissions.
 *
 * Features:
 * - Responsive design with a visually appealing background image.
 * - Utilizes custom Input and Button components for a consistent styling across the application.
 * - Form validation is handled by `react-hook-form`, providing feedback for required fields.
 * - The form's default values are pre-filled for demonstration purposes but should be removed or modified in production.
 *
 * The background sets a creative tone for the registration process, while the overlay improves text visibility. After submitting
 * the form, user input data is logged, showcasing how the data can be processed or sent to an API for account creation.
 *
 * Implementation Notes:
 * - Replace the default form values with empty strings or appropriate defaults for your application context.
 * - The 'wallet address' input presumes users will link a cryptocurrency wallet, adjust according to your application's needs.
 * - Ensure `ButtonOrange` and `Input` components are properly imported from your project's component library.
 * - The background image URL and any placeholder text should be customized to fit the theme and purpose of your application.
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
              type="text"
              label="wallet address"
              name="walletAddress"
              placeholder="TRC(20)"
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
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </main>
  );
};

export default Register;
