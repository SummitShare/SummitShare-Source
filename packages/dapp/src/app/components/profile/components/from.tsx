"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import FormInput from "../../input/formInput";
interface props {
  id: number;
  userName: string;
  email: string;
}

export default function ProfileForm() {
  const [accounts, setAccounts] = useState<props[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<props>({
    
  });

  const onSubmit: SubmitHandler<props> = (data) => {
    setAccounts([
      ...accounts,
      {
        id: Date.now(),
        userName: data.userName,
        email: data.email,
      },
    ]);
    console.log(accounts);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" w-full h-full flex flex-col items-center justify-center gap-6  "
    >
      <div className="space-y-6 w-full">
        <div className="space-y-2">
          <FormInput
            type="text"
            placeholder="Mario jere"
            label={"User Name"}
            name="userName"
            message="A User Name is Required"
            register={register}
          />
          <p className="ml-2 text-red-500 text-sm">
            {errors.userName?.message}
          </p>
        </div>

        <div className="space-y-2">
          <FormInput
            type="email"
            label={"Email"}
            placeholder="Email@gmail.com"
            name="email"
            message="A Email is Required"
            register={register}
          />
          <p className="ml-2 text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-gray-50 font-bold  rounded-md  px-6 py-3 "
        >
          Update
        </button>
      </div>
    </form>
  );
}
