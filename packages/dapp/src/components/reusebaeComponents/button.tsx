import { Icon } from "@radix-ui/react-select";
import React from "react";

interface buttonProps {
  text: string;
  type: "button" | "submit" | "reset";
  click?: () => void;
  backGroundColor?: string;
  hoverColor?: string;
  focusColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  borderColor?: string;
  hover?: string;
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
  hover,
}: buttonProps) {
  return (
    <button
      type={type}
      className={`hover:${hoverColor} body-title-h4 flex flex-row gap-2 items-center justify-center ${backGroundColor} ${textColor} px-4 py-3 rounded-xl w-fit  text-sm font-medium border-${borderColor} ${hover} transition-all `}
      onClick={click}
    >
      <div> {text}</div>
    </button>
  );
}

export default Button;
