import { buttonProps } from "@/utils/dev/frontEndInterfaces";

function ButtonBlack({ children, width, text, click }: buttonProps) {
  return (
    <button
      className={`rounded-md  bg-gray-900 text-white px-[1rem] py-[0.5rem] font-medium ${text} ${width}
       `}
      onClick={click}
    >
      {children}
    </button>
  );
}

export default ButtonBlack;
