import { buttonProps } from "@/utils/dev/frontEndInterfaces";

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
