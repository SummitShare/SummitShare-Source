'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import React, { ReactNode, useState, useRef, useEffect } from 'react';

/**
 * SharedProps interface defines the properties that can be passed to the Inputs component.
 * @property {'input' | 'select' | 'textarea'} type - The type of input element to render.
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
interface SharedProps {
  type: 'input' | 'select' | 'textarea';
  label?: string;
  help?: string;
  helpIcon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  state: 'success' | 'failure' | 'inactive' | 'active';
  defaultValue?: string;
  children?: ReactNode;
  options?: string[];
  onChange?: (value: string) => void;
}

/**
 * Inputs component renders an input element based on the provided type and other properties.
 * @param {SharedProps} props - The properties passed to the Inputs component.
 */
const Inputs: React.FC<SharedProps> = ({
  type,
  label,
  help,
  helpIcon,
  leftIcon,
  rightIcon,
  state,
  defaultValue,
  children,
  options = [],
  onChange,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue || '');
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

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
    setValue(value);
    setOpen(false);
    if (onChange) onChange(value);
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
    const commonClasses = `w-full rounded-[6px] border text-primary-900 text-p1-r transition-all duration-300 ease-in-out`;
    const stateClasses = {
      success: 'border-green-500 focus:outline-green-500',
      failure: 'border-red-500 focus:outline-red-500',
      inactive: 'border-gray-300 bg-gray-100 cursor-not-allowed',
      active:
        'border-primary-100 focus:outline-primary-100 hover:border-primary-300',
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
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            {...sharedProps}
          />
        );
      case 'select':
        return (
          <div className="relative space-y-[8px]" ref={selectRef}>
            <div
              className={`${sharedProps.className} flex flex-row justify-between items-center cursor-pointer`}
              onClick={handleSelectClick}
            >
              {value || 'Select an option'}
              <ChevronDownIcon className="w-[20px]" />
            </div>
            {open && (
              <ul className="absolute z-10 w-full max-h-[110px] p-[12px] rounded-[6px] border border-primary-100 text-primary-900 text-p1-r flex flex-col gap-2 bg-white overflow-y-scroll">
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
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`${commonClasses} ${stateClass} min-h-[100px] p-3`}
            {...props}
          ></textarea>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full input-container space-y-[4px] ${state}`}>
      <div className="w-full p-1 flex flex-row justify-between">
        {label && <label className="text-p2-m text-primary-900">{label}</label>}
        <div className="flex flex-row gap-[8px]">
          {helpIcon && (
            <div className="text-primary-100 flex items-center">{helpIcon}</div>
          )}
          {help && <div className="text-p2-r text-primary-100">{help}</div>}
        </div>
      </div>
      <div className="relative w-full">
        {leftIcon && (
          <span className="absolute top-3.5 pl-[12px] w-[16px] text-primary-900">
            {leftIcon}
          </span>
        )}
        {renderInput()}
        {rightIcon && (
          <span className="absolute top-3.5 right-5 w-[16px] text-primary-900">
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Inputs;
