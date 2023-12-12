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
      className={`px-[23px] py-[14px] flex items-center justify-center w-auto h-fit  rounded-xl whitespace-nowrap ${backGroundColor} ${textColor} border-${borderColor} hover:${hoverColor} ${hover} transition-all`}
      onClick={click}
    >
      <div>{text}</div>
    </button>
  );
}

export default Button;
