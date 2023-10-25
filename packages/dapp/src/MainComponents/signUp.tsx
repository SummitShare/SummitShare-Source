"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@/reusebaeComponents/button";
import Inputs from "@/reusebaeComponents/inputs";
import Form from "@/reusebaeComponents/form";
import { DevTool } from "@hookform/devtools";

interface fromData {
  email: string;
  username: string;
  password: string;
}

function SignUp() {
  const router = useRouter();

  const form = useForm<fromData>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = (data: fromData) => {
    console.log("form submitted", data);
  };

  return (
    <div className=" ">
      <Form
        // @ts-ignore
        onSubmit={handleSubmit(onSubmit)}
        title="SignUp"
        noValidate
        description=" fill in the inputs below to create your account!"
        inputs={
          <div className="space-y-2">
            <Inputs
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
            <Inputs
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
            <Inputs
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
          <Button
            text="SignUp"
            type="submit"
            backGroundColor="slate-950"
            textColor="white"
          />
        }
      />
      <DevTool control={control} />
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
