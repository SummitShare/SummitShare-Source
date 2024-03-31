/**
 * TextArea Component
 *
 * This component is a customizable text area field designed for use in React applications, particularly in forms
 * that require extended user input, such as comments, descriptions, or any multiline text. It is integrated with
 * `react-hook-form` for efficient form management and validation, enhancing form functionality with custom validation
 * messages and additional descriptive text.
 *
 * Features:
 * - Supports all standard HTML textarea attributes for comprehensive customization.
 * - Optional label for clear identification of the textarea's purpose.
 * - Optional description to provide further context or instructions to the user.
 * - Custom validation messages facilitated through an optional message prop.
 * - Integration with `react-hook-form` for seamless form management and validation.
 *
 * Props:
 * - `label` (optional): Text label associated with the textarea, enhancing form accessibility and usability.
 * - `name` (required): Name attribute of the textarea, essential for form submission and data handling.
 * - `description` (optional): Additional text providing more details or instructions about the textarea content.
 * - `message` (optional): Custom validation message to be used in form validation.
 * - `register`: `react-hook-form`'s register function to connect the textarea to the form for validation and submission.
 *
 * The component employs Tailwind CSS for styling, ensuring a consistent and responsive design that can be easily
 * adjusted to fit the overall look and feel of the application. The use of utility classes provides flexibility
 * in customizing the appearance and behavior of the textarea.
 */

import React from "react";
import { UseFormRegister } from "react-hook-form";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
  description?: string;
  message?: string;
  register: UseFormRegister<any>;
}

function TextArea({
  label,
  name,
  message,
  description,
  register,
  ...props
}: TextAreaProps) {
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
      <textarea
        {...props}
        className={`w-full focus:outline-none ring-1 ring-gray-300 focus:ring-orange-500 rounded-md py-[0.5rem] px-[0.8rem] transition-all placeholder:text-gray-500 placeholder:text-[0.7rem] shadow-sm text-[0.7rem] min-h-[40px] max-h-[80px] text-gray-700 ${
          props.className || ""
        }`}
        {...register(name, { required: message ? true : false })}
      />
    </div>
  );
}

export default TextArea;
