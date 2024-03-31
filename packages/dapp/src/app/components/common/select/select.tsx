/**
 * Select Component
 *
 * This component renders a custom select dropdown menu, allowing users to choose from a provided list of options.
 * It features a simple, intuitive interface with a dropdown button and a list of selectable options that appear upon interaction.
 * The selected option is displayed on the button, and users can toggle the visibility of the options list.
 *
 * Props:
 * - `options`: An array of string values representing the selectable options.
 * - `placeholder` (optional): A string to display when no option is selected. Defaults to the `first` prop if not provided.
 * - `width` (optional): A string specifying the width of the component, allowing for custom width settings via Tailwind CSS classes.
 * - `first`: The initial value or placeholder to display in the select field.
 *
 * Features:
 * - Customizable through props, allowing for varied implementations depending on the need.
 * - Utilizes state to manage the visibility of the dropdown list and the currently selected value.
 * - Designed with accessibility and usability in mind, providing a clear visual indication of the current selection and available options.
 *
 * The component's design aims to offer a flexible and user-friendly alternative to native HTML select elements,
 * enhancing the aesthetic consistency across web applications. It is particularly useful in forms and settings where
 * a custom look and feel are desired.
 */

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface SelectComponentProps {
  options: string[];
  placeholder?: string;
  width?: string;
  first: string;
}

export default function Select({
  options,
  placeholder,
  first,
}: SelectComponentProps) {
  // Initialize the placeholder with the value of the first prop if not explicitly provided
  placeholder = placeholder || first;
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [value, setValue] = useState<string>(first);

  // Toggles the dropdown menu
  const handleTypeOpen = () => {
    setIsTypeOpen(!isTypeOpen);
  };

  // Updates the component state with the selected option
  const handleEventTypeChange = (option: string) => {
    setValue(option);
    setIsTypeOpen(false);
  };

  return (
    <div className={"relative space-y-2 w-full"}>
      {/* Dropdown button displaying the currently selected value or the placeholder */}
      <button
        onClick={handleTypeOpen}
        className="w-full rounded-md flex flex-row justify-between items-center gap-2 h-10 ring-1 ring-neutral-300 px-3 bg-white text-[0.8rem]"
      >
        <p className="text-neutral-950">{value}</p>
        <ChevronDownIcon className="w-3 h-3 text-neutral-700" />
      </button>
      {/* Dropdown list of options */}
      {isTypeOpen && (
        <ul className="absolute w-full h-fit rounded-md flex flex-col items-start gap-1 p-2 z-30 bg-white ring-1 ring-neutral-300 shadow-sm">
          {options.map((option, index) => (
            <li
              onClick={() => handleEventTypeChange(option)}
              className="hover:bg-neutral-50 w-full px-2 py-2 rounded-[4px] cursor-pointer text-neutral-950"
              key={index}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
