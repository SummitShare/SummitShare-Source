"use client";
import { useRouter } from "next/navigation";
import Form from "@/components/reusebaeComponents/form";
import LineInputs from "@/components/reusebaeComponents/LineInput";
import Button from "@/components/reusebaeComponents/button";
import { useForm } from "react-hook-form";

interface fromData {
  email: string;
  password: string;
}

function SignIn() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/Landing");
  };

  const form = useForm<fromData>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = async (data: fromData) => {
    try {
      const response = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csrfToken: await fetch('/api/auth/csrf').then((res) => res.json()).then(data => data.csrfToken), // fetch CSRF token
          email: data.email,
          password: data.password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to sign in');
      }
  
      // Redirect the user after successful login
      router.push('/some-redirect-route'); // Update this with where you want to redirect after login
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
              // @ts-ignore
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
