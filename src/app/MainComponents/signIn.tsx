"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function SignIn() {
  const router = useRouter();

  useEffect(() => {
    // This code will run on the client side after the component has mounted.
    const handleSubmit = async (e: FormData) => {
      const UserName = e.get("userName")?.toString();
      const Password = e.get("password")?.toString();

      if (!UserName || !Password) return;

      const signInData = await signIn("credentials", {
        userName: UserName,
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
    <main className="absolute inset-0 flex items-center justify-center bg-slate-50/10">
      <div className="bg-white rounded-xl w-fit h-fit px-6 py-7 shadow-md ">
        <form className="space-y-5">
          <p className="text-xl font-bold">SignIn</p>
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
            <div className="space-y-2  flex flex-col">
              <label htmlFor="" className="text-lg font-semibold text-left">
                password
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
            className="rounded-xl w-[150px] bg-slate-950 text-slate-50 text-base font-medium px-4 py-3"
          >
            SignIn
          </button>
        </form>
      </div>
    </main>
  );
}

export default SignIn;
