"use client";
import { useRouter } from "next/navigation";
import React from "react";

function SignUp() {
  const router = useRouter();

  const onSubmit = async (e: FormData) => {
    const userName = e.get("userName")?.toString();
    const Email = e.get("email")?.toString();
    const Password = e.get("password")?.toString();
    if (!userName || !Email || !Password) return;
    const res = await fetch("/api/user", {
      method: "POST",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: userName,
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
    <main className="absolute inset-0 flex items-center justify-center bg-slate-50/10">
      <div className="bg-white rounded-xl w-fit h-fit px-6 py-7 shadow-md ">
        <form action={onSubmit} className="space-y-5">
          <p className="text-xl font-bold">SignUp</p>
          <div className="space-y-5">
            <div className="space-y-2 flex flex-col">
              <label htmlFor="" className="text-lg font-semibold text-left">
                Name
              </label>
              <input
                type="text"
                placeholder="Type your Name"
                className="rounded-xl w-[350px] pl-6 border p-3"
                name="userName"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor=""
                className="text-lg font-semibold text-left flex flex-col "
              >
                Email
              </label>
              <input
                type="text"
                placeholder="Type your Email"
                className="rounded-xl w-[350px] pl-6 border p-3"
                name="email"
              />
            </div>
            <div className="space-y-2  flex flex-col">
              <label htmlFor="" className="text-lg font-semibold text-left">
                Password
              </label>
              <input
                type="text"
                placeholder="Type your password"
                className="rounded-xl w-[350px] pl-6 border p-3"
                name="password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl w-[150px] bg-slate-950 text-slate-50 text-base font-medium px-4 py-3 "
          >
            SignUp
          </button>
        </form>
      </div>
    </main>
  );
}

export default SignUp;
