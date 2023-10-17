"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/reusebaeComponents/button";
import Inputs from "@/reusebaeComponents/inputs";
import Form from "@/reusebaeComponents/form";

function SignIn() {
  const router = useRouter();

  useEffect(() => {
    // This code will run on the client side after the component has mounted.
    const handleSubmit = async (e: FormData) => {
      const Email = e.get("email")?.toString();
      const Password = e.get("password")?.toString();

      if (!Email || !Password) return;

      const signInData = await signIn("credentials", {
        Email: Email,
        password: Password,
        redirect: false,
      });
      if (signInData?.error) {
        console.log(signInData);
      } else {
        router.refresh();
        router.push("/admin");
      }
    };

    // Call the handleSubmit function when the form is submitted
    document.querySelector("form")?.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent the default form submission
      handleSubmit(new FormData(e.target as HTMLFormElement));
    });
  }, [router]);

  return (
    <div>
      <Form
        title="SignIn"
        description=" fill in the inputs below to signIn to your account!"
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
            text="SignIn"
            type="submit"
            backGroundColor="slate-950"
            textColor="white"
          />
        }
      />
    </div>
  );
}

export default SignIn;
