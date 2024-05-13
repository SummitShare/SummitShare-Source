"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import FormInput from "../../input/formInput";
interface props {
  id: number;
  currentPassword: string;
  newPassword: string;
}

export default function ChangePasswordForm() {
  const [password, setPassword] = useState<props[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<props>({
   
  });

  const onSubmit: SubmitHandler<props> = (data) => {
    setPassword([
      ...password,
      {
        id: Date.now(),
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
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
            label={"CurrentPassword"}
            name="currentPassword"
            message="A currentPassword is Required"
            register={register}
          />
        </div>

        <div className="space-y-2">
          <FormInput
            type="password"
            label={"New password"}
            name="newPassword"
            message="A new password is Required"
            register={register}
          />
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
