"use client";
import FormInput from "@/components/formInput";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
interface props {
  id: number;
  password: string;
}

export default function LogOutOfSessionForm() {
  const [password, setPassword] = useState<props[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<props>({
    defaultValues: {
      password: "",
    },
  });

  const onSubmit: SubmitHandler<props> = (data) => {
    setPassword([
      ...password,
      {
        id: Date.now(),
        password: data.password,
      },
    ]);
    console.log(password);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" w-full h-full flex flex-col items-center justify-center gap-6  "
    >
      <div className="space-y-6 w-full">
        <div className="space-y-2">
          <FormInput
            type="password"
            label={"Password"}
            name="password"
            message="A Password is Required"
            register={register}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-950 text-white  rounded-md  px-5  py-3"
        >
          Log out other sessions
        </button>
      </div>
    </form>
  );
}
