import React from "react";
import Button from "./button";
import Inputs from "./inputs";

interface formProps {
  title: string;
  description: string;
  action?: ((formData: FormData) => void) | undefined;
  inputs: React.ReactNode;
  submit?: React.ReactNode;
}

function Form({ title, description, action, inputs, submit }: formProps) {
  return (
    <div className="py-5 px-4 space-y-6 bg-white w-fit h-fit rounded-lg shadow-md">
      <form action={action} className="space-y-5">
        <div className="text-left space-y-2">
          <p className="font-bold text-xl text-slate-950">{title}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div>{inputs}</div>
        <div>{submit}</div>
      </form>
    </div>
  );
}

export default Form;
