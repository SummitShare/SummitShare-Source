"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "@/MainComponents/signIn";
import SignUp from "@/MainComponents/signUp";
import { usePathname, useRouter } from "next/navigation";

import React from "react";

function LogInTabs() {
  const router = useRouter();
  const path = usePathname();

  const handleClickSignIn = () => {
    router.push("/Landing/auth/signIn");
    console.log(path);
  };
  const handleClickSignUp = () => {
    router.push("/Landing/auth/signUp");
    console.log(path);
  };
  return (
    <div className="fixed inset-0 bg-slate-50 flex justify-center items-start pt-10 z-50">
      <Tabs defaultValue={path} className="">
        <TabsList className=" w-full  ">
          <TabsTrigger
            onClick={handleClickSignUp}
            value="/Landing/auth/signUp"
            className="w-full"
          >
            SignUp
          </TabsTrigger>
          <TabsTrigger
            onClick={handleClickSignIn}
            value="/Landing/auth/signIn"
            className="w-full"
          >
            SignIn
          </TabsTrigger>
        </TabsList>
        <TabsContent value="/Landing/auth/signUp">
          <SignUp />
        </TabsContent>
        <TabsContent value="/Landing/auth/signIn">
          <SignIn />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LogInTabs;
