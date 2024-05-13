import React from "react";
import { UseFormRegister } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  message: string;
  register: UseFormRegister<any>;
}

function FormInput({ label, name, message, register, ...props }: InputProps) {
  return (
    <div className="space-y-2 w-full h-fit ">
      <label className="  px-2 text-base focus:text-orange-500 text-slate-950 font-semibold">
        {label}
      </label>
      <input
        {...props} // Spread the rest of the input props here
        className={`w-full h-10 focus:outline-none ring-1 ring-gray-300  focus:ring-orange-500 rounded-md px-4 text-sm transition-all input-autofill placeholder:text-gray-500 ${
          props.className || ""
        }`}
        {...register(name, { required: message })}
      />
    </div>
  );
}

export default FormInput;
