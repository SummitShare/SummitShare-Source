import { buttonProps } from "@/utils/dev/frontEndInterfaces";

function ButtonWhite({ children, width, text }: buttonProps) {
  return (
    <button
      className={`rounded-md  bg-white text-black px-[1rem] py-[0.5rem] font-medium ${text} ${width} `}
    >
      {children}
    </button>
  );
}

export default ButtonWhite;