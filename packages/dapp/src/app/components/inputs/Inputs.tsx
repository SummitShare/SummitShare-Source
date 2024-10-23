'use client';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import * as React from 'react';

export interface InputProps {
   type: 'input' | 'select' | 'textarea' | 'pill';
   label?: string;
   help?: string;
   helpIcon?: React.ReactNode;
   leftIcon?: React.ReactNode;
   rightIcon?: React.ReactNode;
   state: 'success' | 'failure' | 'inactive' | 'active';
   defaultValue?: string;
   value?: any;
   children?: React.ReactNode;
   options?: string[];
   onChange?: (e: any) => void;
   placeholder?: string;
   readOnly?: any;
   isPassword?: boolean; // New prop to indicate if the input is a password field
}

/**
 * SharedProps interface defines the properties that can be passed to the Inputs component.
 * @property {'input' | 'select' | 'textarea' | 'pill'} type - The type of input element to render.
 * @property {string} [label] - The label text for the input.
 * @property {string} [help] - The help text displayed next to the input.
 * @property {ReactNode} [helpIcon] - An icon displayed alongside the help text.
 * @property {ReactNode} [leftIcon] - An icon displayed on the left side of the input.
 * @property {ReactNode} [rightIcon] - An icon displayed on the right side of the input.
 * @property {'success' | 'failure' | 'inactive' | 'active'} state - The state of the input, affecting its styling.
 * @property {string} [defaultValue] - The default value of the input.
 * @property {ReactNode} [children] - Children elements passed to the component.
 * @property {string[]} [options] - Options for the select input type.
 * @property {(value: string) => void} [onChange] - Callback function to handle value changes.
 */

/**
 * Inputs component renders an input element based on the provided type and other properties.
 * @param {InputProps} props - The properties passed to the Inputs component.
 */
const Input: React.FC<InputProps> = ({
   type,
   label,
   help,
   helpIcon,
   leftIcon,
   rightIcon,
   state,
   defaultValue,
   value,
   onChange,
   children,
   options = [],
   isPassword = false,
   ...props
}) => {
   const [internalValue, setInternalValue] = useState(defaultValue || '');
   const [pills, setPills] = useState<string[]>([]);
   const [open, setOpen] = useState(false);
   const selectRef = useRef<HTMLDivElement>(null);
   const [showPassword, setShowPassword] = useState(false);

   useEffect(() => {
      if (value !== undefined) {
         setInternalValue(value);
      }
   }, [value]);

   /**
    * Toggles the open state of the select dropdown.
    */
   const handleSelectClick = () => {
      setOpen(!open);
   };

   /**
    * Handles input changes and invokes the onChange callback if provided.
    * @param {string} value - The new value of the input.
    */
   const handleInput = (value: string) => {
      setInternalValue(value);
      setOpen(false);
      if (onChange) onChange(value);
   };

   // Handles password visibility
   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };

   /**
    * Handles pill input key events.
    * @param {KeyboardEvent<HTMLInputElement>} event - The keyboard event.
    */
   const handlePillInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === ' ' && internalValue.trim()) {
         setPills([...pills, internalValue.trim()]);
         setInternalValue('');
         event.preventDefault();
      }
   };

   /**
    * Removes a pill by index.
    * @param {number} index - The index of the pill to remove.
    */
   const removePill = (index: number) => {
      setPills(pills.filter((_, i) => i !== index));
   };

   /**
    * Closes the select dropdown if a click outside of it is detected.
    * @param {MouseEvent} event - The mouse event.
    */
   const handleClickOutside = (event: MouseEvent) => {
      if (
         selectRef.current &&
         !selectRef.current.contains(event.target as Node)
      ) {
         setOpen(false);
      }
   };

   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   /**
    * Renders the appropriate input element based on the type prop.
    * @returns {JSX.Element} The rendered input element.
    */
   const renderInput = () => {
      const commonClasses = `w-full rounded-[6px] border text-secondary-700 text-p1-r`;
      const stateClasses = {
         success: 'border-green-500 focus:outline-green-500',
         failure: 'border-red-500 focus:outline-red-500',
         inactive:
            'border-secondary-100 bg-secondary-[#EAEDF2] cursor-not-allowed',
         active:
            'border-primary-100 focus:outline-primary-500 hover:border-primary-300',
      };
      const stateClass = stateClasses[state];

      const sharedProps = {
         className: `${commonClasses} ${stateClass} ${
            leftIcon ? 'pl-[32px]' : 'pl-[12px]'
         } ${rightIcon ? 'pr-[32px]' : 'pr-[12px]'} h-[44px]`,
         disabled: state === 'inactive',
         ...props,
      };

      switch (type) {
         case 'input':
            return (
               <div className="relative">
                  <input
                     type={
                        isPassword ? (showPassword ? 'text' : 'password') : 'text'
                     }
                     value={internalValue}
                     onChange={(e) => handleInput(e.target.value)}
                     {...sharedProps}
                     placeholder={defaultValue}
                     className={`${sharedProps.className} ${
                        isPassword ? 'pr-[40px]' : ''
                     }`}
                  />
                  {isPassword && (
                     <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                     >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                     </button>
                  )}
               </div>
            );
         case 'select':
            return (
               <div className="relative space-y-[8px]" ref={selectRef}>
                  <div
                     className={`${sharedProps.className} flex flex-row justify-between items-center cursor-pointer`}
                     onClick={handleSelectClick}
                  >
                     {internalValue || 'Select an option'}
                     <ChevronDownIcon className="w-[20px]" />
                  </div>
                  {open && (
                     <ul className="absolute z-10 w-full max-h-[110px] p-[12px] rounded-[6px] border border-primary-100 text-primary-900 text-p1-r flex flex-col gap-2 bg-white">
                        {options.map((option) => (
                           <li
                              key={option}
                              onClick={() => handleInput(option)}
                              className="cursor-pointer text-p1-r text-primary-900-75"
                           >
                              {option}
                           </li>
                        ))}
                     </ul>
                  )}
               </div>
            );
         case 'textarea':
            return (
               <textarea
                  value={internalValue}
                  onChange={(e) => handleInput(e.target.value)}
                  className={`${commonClasses} ${stateClass} min-h-[100px] p-3`}
                  {...props}
               ></textarea>
            );
         case 'pill':
            return (
               <div className="flex flex-wrap items-center gap-2 p-2 border rounded-[6px]  border-primary-100 focus:outline-primary-500  hover:border-primary-300">
                  {pills.map((pill, index) => (
                     <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 text-white bg-primary-500 rounded-full"
                     >
                        {pill}
                        <button
                           type="button"
                           className="text-white"
                           onClick={() => removePill(index)}
                        >
                           &times;
                        </button>
                     </div>
                  ))}
                  <input
                     type="text"
                     value={internalValue}
                     onChange={(e) => handleInput(e.target.value)}
                     onKeyDown={handlePillInputKeyDown}
                     className="flex-grow border-none focus:ring-0 outline-none text-sm font-normal"
                     {...props}
                  />
               </div>
            );
         default:
            return null;
      }
   };

   return (
      <div className={`w-full input-container space-y-[4px] ${state}`}>
         <div className="w-full p-1 flex flex-row justify-between">
            {label && (
               <label className="text-p2-m text-secondary-900">{label}</label>
            )}
            <div className="flex flex-row gap-[8px] items-center">
               {helpIcon && (
                  <div className="text-secondary-200 flex items-center">
                     {helpIcon}
                  </div>
               )}
               {help && (
                  <div className="text-sm font-normal text-secondary-200">
                     {help}
                  </div>
               )}
            </div>
         </div>
         <div className="relative w-full">
            {leftIcon && (
               <span className="absolute top-3.5 pl-[12px] w-[16px] text-secondary-900">
                  {leftIcon}
               </span>
            )}
            {renderInput()}
            {rightIcon && (
               <span className="absolute top-3.5 right-5 w-[16px] text-secondary-900">
                  {rightIcon}
               </span>
            )}
         </div>
      </div>
   );
};

export default Input;
