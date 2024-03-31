/**
 * SignIn Component
 *
 * This component forms the sign-in page of the application, where users can log in to their accounts. It features
 * a clean and intuitive interface for inputting user credentials such as email and password. The component utilizes
 * `react-hook-form` for form management, ensuring efficient handling of form submission and validation.
 *
 * Features:
 * - Responsive design with an engaging background image for a pleasant user experience.
 * - Utilizes custom Input and ButtonOrange components for consistent styling across the application.
 * - Leveraging `react-hook-form` for form validation, enhancing the form submission process with error handling.
 * - The form's default values are pre-filled for demonstration purposes and should be adjusted according to use.
 *
 * The background overlay improves visibility and text readability, creating an immersive sign-in process. Upon form
 * submission, the user input data is logged, demonstrating how the data can be processed or integrated with authentication
 * services for account access.
 *
 * Implementation Notes:
 * - Modify the default form values to suit the application's needs, typically leaving them empty for user input.
 * - The 'Register' link at the bottom redirects users to the registration page, adjust the href attribute to the correct path.
 * - Ensure proper imports for `ButtonOrange` and `Input` components according to your project structure.
 * - Customize the background image URL and any placeholder text to match the application's theme and context.
 */

"use client";
import ButtonOrange from "@/app/components/common/button/buttonOrange";
import Input from "@/app/components/common/inputs/input/input";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

interface props {
  email: string;
  password: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "mariomaguyasjere@gmail.com",
      password: "123456",
    },
  });

  const onSubmit = (data: props) => {
    console.log(data);
  };

  return (
    <main className="h-screen flex flex-col justify-end items-center bg-[url('https://images.unsplash.com/photo-1606885118474-c8baf907e998?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMGFydHxlbnwwfHwwfHx8MA%3D%3D')] bg-cover bg-center  md:flex-row">
      <div className="bg-gray-950/35 fixed inset-0 "></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col items-center justify-center h-[75%]  w-full gap-6 z-10 p-10 bg-white rounded-t-[48px] md:h-full  md:rounded-l-[32px]   md:rounded-tr-[0px] md:w-[35%] "
      >
        <div className="space-y-6 w-full ">
          <div className="w-full text-center my-6">
            <h1 className="font-bold text-gray-950 text-2xl">Welcome back</h1>
          </div>

          <div className="w-full space-y-3 ">
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
            Sign In
          </ButtonOrange>
        </div>

        <div className="w-full text-center mt-20">
          <Link
            className="text-gray-800 underline text-sm  font-semibold"
            href={`#`}
          >
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </main>
  );
};

export default Register;
