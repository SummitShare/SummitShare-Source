import { buttonProps } from "@/utils/dev/frontEndInterfaces";

function ButtonOrange({ children, width, text }: buttonProps) {
  return (
    <button
      className={`rounded-md  bg-orange-500 text-white px-[1rem] py-[0.5rem] font-medium ${text} ${width} `}
    >
      {children}
    </button>
  );
}

export default ButtonOrange;
