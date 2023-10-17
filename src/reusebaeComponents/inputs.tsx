import React from "react";
import { inputProps } from "../../../types";

export default function Inputs({
  text,
  length,
  label,
  name,
  value,
  type,
  onChange,
  onClick,
}: inputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor=""
        className=" font-semibold  flex flex-col text-slate-950 "
      >
        {label}
      </label>
      <input
        className={`w-${length} h-10 rounded-xl border focus:border-slate-950 pl-4 pr-2 `}
        placeholder={text}
        name={name}
        type={type}
        onChange={onChange}
        onClick={onClick}
      />
    </div>
  );
}
