"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Button from "@/reusebaeComponents/button";
import Inputs from "@/reusebaeComponents/inputs";
import Form from "@/reusebaeComponents/form";

function SignUp() {
  const router = useRouter();

  const onSubmit = async (e: FormData) => {
    const Email = e.get("email")?.toString();
    const Password = e.get("password")?.toString();
    if (!Email || !Password) return;
    const res = await fetch("/api/user", {
      method: "POST",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: Email,
        password: Password,
      }),
    });
    if (res.ok) {
      router.push("/signIn");
    } else {
      console.error("Registration failed");
    }
  };

  return (
    <div>
      <Form
        title="SignUp"
        action={onSubmit}
        description=" fill in the inputs below to create your account!"
        inputs={
          <div className="space-y-2">
            <Inputs
              text="Name@mail.com"
              length="[350px]"
              label="Email"
              name="email"
              type="email"
            />
            <Inputs
              text="Password"
              length="[350px]"
              label="Password"
              name="password"
              type="password"
            />
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
    </div>
  );
}

export default SignUp;
