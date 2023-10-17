import { Icon } from "@radix-ui/react-select";
import React from "react";

interface buttonProps {
  text: string;
  type: "button" | "submit" | "reset";
  click?: ((formData: FormData) => void) | undefined;
  backGroundColor?: string;

  hoverColor?: string;
  focusColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  borderColor?: string;
}

function Button({
  text,
  type,
  click,
  backGroundColor,

  hoverColor,
  focusColor,
  textColor,
  icon,
  borderColor,
}: buttonProps) {
  return (
    <button
      type={type}
      className={`hover:bg-${hoverColor} flex flex-row gap-2 items-center justify-center bg-${backGroundColor} text-${textColor} px-4 py-3 text-sm rounded-xl w-24 border border-${borderColor}`}
    >
      <div> {text}</div>
    </button>
  );
}

export default Button;
