import React from "react";
import Button from "./button";
import Inputs from "./inputs";

interface formProps {
  title: string;
  description: string;
  onSubmit?: (formData: FormData) => void;
  inputs: React.ReactNode;
  submit?: React.ReactNode;
  bg?: string;
  shadow?: string;
}

function Form({
  title,
  description,
  onSubmit,
  inputs,
  submit,
  bg,
  shadow,
}: formProps) {
  return (
    <div
      className={`py-5 px-4 space-y-6 bg-${bg} w-fit h-fit rounded-lg shadow-${shadow}`}
    >
      {/*  @ts-ignore */}
      <form onSubmit={onSubmit} className="space-y-10">
        <div className="text-left space-y-2">
          <p className="title-h3-slate">{title}</p>
          <p className="body-text-h4">{description}</p>
        </div>
        <div>{inputs}</div>
        <div>{submit}</div>
      </form>
    </div>
  );
}

export default Form;
