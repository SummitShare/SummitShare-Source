"use client";
import { useEffect } from "react";
// import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/reusebaeComponents/button";
import Inputs from "@/reusebaeComponents/inputs";
import Form from "@/reusebaeComponents/form";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

interface fromData {
  email: string;
  password: string;
}

function SignIn() {
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
        title="SignIn"
        // @ts-ignore
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        description=" fill in the inputs below to signIn to your account!"
        inputs={
          <div className="space-y-2">
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
            text="SignIn"
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

export default SignIn;
