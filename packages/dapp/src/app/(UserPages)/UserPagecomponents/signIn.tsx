"use client";
import { useRouter } from "next/navigation";
import Form from "@/components/reusebaeComponents/form";
import LineInputs from "@/components/reusebaeComponents/LineInput";
import Button from "@/components/reusebaeComponents/button";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { json } from "stream/consumers";



interface fromData {
  email: string;
  password: string;
}

function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleCancel = () => {
    router.push("/Landing");
  };

  const form = useForm<fromData>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = async (data: fromData) => {
    try {

     console.log(data)

     const res = await fetch('/api/test', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
     })
  
    
      
        // After successful login, check session status
      // if (status === "authenticated") {
      //   console.log("Current session:", session);
      //   router.push('/'); // Redirect on successful login
      // } else {
      //   console.error('Session not established');
      // }

      router.push("/AuthTest")
    } catch (error) {
      console.error('Sign in failed:', error);
      // Handle sign-in error, such as showing a notification to the user
    }
  };
  

  return (
    <div className=" ">
      <Form
        bg="white"
        shadow="md"
        title="Hey welcome back!"
        // @ts-ignore
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        description="SignIn to your SummitShare Account"
        inputs={
          <div className="space-y-5">
            <LineInputs
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
              text="Sign in"
              type="submit"
              backGroundColor="bg-orange-500"
              textColor="text-white"
              hover="hover:shadow-lg"
            />
            <Button
              click={handleCancel}
              text="Cancel"
              type="button"
              borderColor=" border border-slate-300"
              textColor="text-slate-500"
              hover=""
            />
          </div>
        }
      />
    </div>
  );
}

export default SignIn;
