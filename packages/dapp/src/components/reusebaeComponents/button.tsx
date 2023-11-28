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
      className={`px-4 py-2 flex items-center justify-center w-auto h-10 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap ${backGroundColor} ${textColor} border-${borderColor} hover:${hoverColor} ${hover} transition-all`}
      onClick={click}
    >
      <div>{text}</div>
    </button>
  );
}

export default Button;
