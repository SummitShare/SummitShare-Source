import { useForm, UseFormRegister } from "react-hook-form";

interface InputProps {
  text?: string;
  length: string;
  label?: string;
  name?: string;
  value?: any;
  type?: string;
  id?: string;
  hight?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  register: UseFormRegister<any>;
  message: string;
  py?: string;
  px?: string;
}

export default function LineInputs({
  text,
  length,
  label,
  name,
  type,
  id,
  onChange,
  onClick,
  register,
  message,
  hight,
  py,
  px,
}: InputProps) {
  return (
    <div className="space-y-2 relative">
      <input
        className={`w-${length} ${hight ||
          `h-10`} border focus:border-orange-500  cursor-text focus:outline-none  bg-white peer py-2 px-3 rounded-md ${px ||
          `px-3`}  ${py || `py-2`} `}
        type={type}
        id={id}
        // @ts-ignore
        {...register(name, { required: message })}
      />

      <label
        htmlFor={id}
        className=" absolute top-0 body-text-h3 flex flex-col text-slate-600 peer-focus:-top-5 peer-focus:text-sm peer-focus:transition-all left-2 peer-focus:text-orange-500 bg-white px-2"
      >
        {label}
      </label>
    </div>
  );
}
