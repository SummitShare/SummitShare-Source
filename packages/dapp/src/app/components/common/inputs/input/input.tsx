/**
 * Input Component
 *
 * This component is a reusable input field designed to be used with forms in React applications. It integrates
 * seamlessly with `react-hook-form` for form state management and validation. The component is highly customizable,
 * supporting all standard HTML input attributes, and extends functionality with additional props for labeling,
 * descriptions, and custom validation messages.
 *
 * Features:
 * - Optional labeling for clear identification of the input field's purpose.
 * - An optional description to provide further guidance or information about the expected input.
 * - Integration with `react-hook-form` through the `register` function prop, facilitating easy form control and validation.
 * - Customizable through standard input attributes and additional props for enhanced usability.
 *
 * Props:
 * - `label` (optional): A text label for the input field.
 * - `name` (required): The name attribute of the input field, crucial for form submission and validation.
 * - `description` (optional): Additional information about the input field, rendered as a small paragraph below the label.
 * - `message` (optional): Custom validation message that can be displayed based on form validation state.
 * - `register`: The `react-hook-form` register function to "register" the input in the form for validation and submission.
 * - `need` (optional): A boolean indicating if the input field is necessary for form submission, influencing validation rules.
 *
 * The component utilizes Tailwind CSS for styling, providing a consistent and modern look and feel. It is designed
 * to be flexible and easily integrated into various form layouts, enhancing form user experience with clear labeling
 * and descriptions.
 */

// React and react-hook-form imports
import React from "react";
import { InputProps } from "@/utils/dev/frontEndInterfaces";

function Input({
  label,
  name,
  message,
  description,
  register,
  need,
  ...props
}: InputProps) {
  return (
    <div className="space-y-[0.2rem] w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-[0.8rem] text-gray-900 font-semibold"
        >
          {label}
        </label>
      )}
      {description && (
        <p className="text-gray-700 text-[0.7rem]">{description}</p>
      )}
      <input
        {...props}
        className={`w-full h-10 focus:outline-none ring-1 ring-gray-300 focus:ring-orange-500 rounded-md py-[0.5rem] px-[0.8rem] transition-all input-autofill placeholder:text-gray-500 placeholder:text-[0.7rem] shadow-sm text-[0.7rem] text-gray-700 ${
          props.className || ""
        }`}
        {...register(name)}
      />
    </div>
  );
}

export default Input;
