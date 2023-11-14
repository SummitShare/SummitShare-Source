"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePathname, useRouter } from "next/navigation";
import SignIn from "./signIn";
import SignUp from "./signUp";

function SignUpSignInTabs() {
  const router = useRouter();
  const path = usePathname();

  const handleClickSignIn = () => {
    router.push("/auth/signIn");
    console.log(path);
  };
  const handleClickSignUp = () => {
    router.push("/auth/signUp");
    console.log(path);
  };
  return (
    <div className="fixed inset-0 bg-slate-50 flex justify-center items-start pt-10 z-50">
      <Tabs defaultValue={path} className="">
        <TabsList className=" w-full  ">
          <TabsTrigger
            onClick={handleClickSignUp}
            value="/auth/signUp"
            className="w-full"
          >
            SignUp
          </TabsTrigger>
          <TabsTrigger
            onClick={handleClickSignIn}
            value="/auth/signIn"
            className="w-full"
          >
            SignIn
          </TabsTrigger>
        </TabsList>
        <TabsContent value="/auth/signUp">
          <SignUp />
        </TabsContent>
        <TabsContent value="/auth/signIn">
          <SignIn />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SignUpSignInTabs;
