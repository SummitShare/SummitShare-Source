import React from "react";
import { useForm, UseFormRegister } from "react-hook-form";

interface InputProps {
  text?: string;
  length: string;
  label?: string;
  name?: string;
  value?: any;
  type?: string;
  id?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  register: UseFormRegister<any>;
  message: string;
}

export default function Inputs({
  text,
  length,
  label,
  name,
  type,
  id,
  onChange,
  onClick,
  register,
  message,
}: InputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="font-semibold flex flex-col text-slate-950"
      >
        {label}
      </label>
      <input
        className={`w-${length} h-10 rounded-xl border focus:border-slate-950 pl-4 pr-2`}
        type={type}
        placeholder={text}
        id={id}
        // @ts-ignore
        {...register(name, { required: message })}
      />
    </div>
  );
}
