"use client";
import Button from "@/components/reusebaeComponents/button";
import Form from "@/components/reusebaeComponents/form";
import LineInputs from "@/components/reusebaeComponents/LineInput";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface fromData {
  email: string;
  username: string;
  password: string;
}

function SignUp() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/");
  };

  const form = useForm<fromData>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = (data: fromData) => {

    
    fetch("http://localhost:3000/api/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            router.push("/login");
          }
        })
        .catch((err) => {
          console.log(err);
    })
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
              hover="hover:shadow-lg  "
            />
            <Button
              click={handleCancel}
              text="Cancel"
              type="button"
              borderColor=" border border-slate-300"
              textColor="text-slate-500"
              hover=""
            ></Button>
          </div>
        }
      />
    </div>
  );
}

export default SignUp;
