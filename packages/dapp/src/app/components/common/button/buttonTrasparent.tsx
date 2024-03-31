import React, { ReactNode } from "react";

interface buttonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  text: string;
  width: string;
}

function ButtonTransparent({ children, width, text }: buttonProps) {
  return (
    <button
      className={`rounded-md  bg-white/35 backdrop-blur-md text-white px-[1rem] py-[0.5rem] font-medium ${text} ${width} `}
    >
      {children}
    </button>
  );
}

export default ButtonTransparent;
