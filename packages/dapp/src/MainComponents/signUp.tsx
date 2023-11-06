"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@/reusebaeComponents/button";
import Inputs from "@/reusebaeComponents/inputs";
import Form from "@/reusebaeComponents/form";
import { DevTool } from "@hookform/devtools";
import LineInputs from "@/reusebaeComponents/LineInput";

interface fromData {
  email: string;
  username: string;
  password: string;
}

function SignUp() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/Landing");
  };

  const form = useForm<fromData>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = (data: fromData) => {
    console.log("form submitted", data);
  };

  return (
    <div className=" ">
      <Form
        bg="white"
        shadow="md"
        // @ts-ignore
        onSubmit={handleSubmit(onSubmit)}
        title="Lets get started"
        noValidate
        description="Create your first SummitShare account"
        inputs={
          <div className="space-y-5">
            <LineInputs
              text="Username"
              length="[350px]"
              label="Username"
              name="username"
              type="text"
              id="username"
              message="User name required!"
              register={register}
            />
            <p className="text-xs text-red-500 font-light">
              {errors.username?.message}
            </p>
            <LineInputs
              text="Name@mail.com"
              length="[350px]"
              label="Email"
              name="email"
              type="email"
              id="email"
              message="Email name required!"
              register={register}
            />
            <p className="text-xs text-red-500 font-light">
              {errors.email?.message}
            </p>
            <LineInputs
              text="Password"
              length="[350px]"
              label="Password"
              name="password"
              type="password"
              id="password"
              message="Password name required!"
              register={register}
            />
            <p className="text-xs text-red-500 font-light">
              {errors.password?.message}
            </p>
          </div>
        }
        submit={
          <div className="flex flex-row gap-2">
            <Button
              text="Sign up"
              type="submit"
              backGroundColor="bg-orange-500"
              textColor="text-white"
              hover="hover:bg-orange-950/90"
            />
            <Button
              click={handleCancel}
              text="Cancel"
              type="button"
              borderColor="border border-stone-300"
              textColor="text-stone-500"
              hover=""
            />
          </div>
        }
      />
    </div>
  );
}

export default SignUp;

// const onSubmit = async (e: FormData) => {
//   const Email = e.get("email")?.toString();
//   const Password = e.get("password")?.toString();
//   if (!Email || !Password) return;
//   const res = await fetch("/api/user", {
//     method: "POST",

//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       email: Email,
//       password: Password,
//     }),
//   });
//   if (res.ok) {
//     router.push("/signIn");
//   } else {
//     console.error("Registration failed");
//   }
// };
