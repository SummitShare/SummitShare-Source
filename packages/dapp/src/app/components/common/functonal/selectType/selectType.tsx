/**
 * SelectType Component
 *
 * This component is a custom select dropdown designed for React applications, aiming to provide a more flexible
 * and stylized alternative to the native HTML select element. It's built to integrate with Redux for state management,
 * making it ideal for forms where the selection triggers a global state update. The `SelectType` component supports
 * various types of selections such as event types, event countries, time zones, categories, and locations, making it
 * highly versatile for different use cases.
 *
 * Features:
 * - Customizable options list provided via props.
 * - Integrates with Redux for dispatching actions based on the selection.
 * - Provides a callback mechanism through `onChange` prop for additional custom handling.
 * - Utilizes `@heroicons/react` for dropdown icons, enhancing the visual appeal.
 *
 * Props extend `React.SelectHTMLAttributes<HTMLSelectElement>`, allowing for the inclusion of native select attributes
 * for further customization. The component also requires the following custom props:
 * - `options`: Array of string options to be displayed in the dropdown.
 * - `first`: A string value for the initial display and selection.
 * - `type`: A string indicating the type of selection, which determines the Redux action dispatched upon selection.
 *
 * Usage involves providing the necessary options and a selection type. When an option is selected, the corresponding
 * Redux action for the provided type is dispatched to update the global state. Additionally, the `onChange` event
 * handler can be used for local form handling.
 */

"use client"; // Directive for React Server Components to ensure client-side execution

import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  setEventCountryType,
  setEventType,
  setEvent_category,
  setEvent_location,
  setEvent_timezone,
  setEvent_Type
} from '@/redux/features/select-slice';
import { AppDispatch } from '@/redux/store';
import { SelectComponentProps } from '@/utils/dev/frontEndInterfaces';

const SelectType = React.memo(({ options, first, type, ...selectProps }: SelectComponentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(first);

  const handleTypeOpen = useCallback(() => {
    setIsTypeOpen(prev => !prev);
  }, []);

  const handleEventTypeChange = useCallback((option: string) => {
    setSelectedValue(option);
    setIsTypeOpen(false);

    switch (type) {
      case "eventCountryType":
        dispatch(setEventCountryType(option));
        break;
      case "eventType":
        dispatch(setEventType(option));
        break;
      case "event_timezone":
        dispatch(setEvent_timezone(option));
        break;
      case "event_category":
        dispatch(setEvent_category(option));
        break;
      case "event_location":
        dispatch(setEvent_location(option));
        break;
      case "event_type":
        dispatch(setEvent_Type(option));
        break;
      default:
        console.warn("Unhandled select type:", type);
    }

    if (selectProps.onChange) {
      const event = { target: { value: option, name: selectProps.name } };
      selectProps.onChange(event as any);
    }
  }, [dispatch, type, selectProps.onChange, selectProps.name]);

  return (
    <div className="relative space-y-2 w-full">
      <button onClick={handleTypeOpen} className="w-full rounded-md flex justify-between items-center gap-2 h-10 ring-1 ring-neutral-300 px-3 bg-white text-[0.8rem]">
        <p className="text-neutral-950">{selectedValue}</p>
        <ChevronDownIcon className="w-3 h-3 text-neutral-700" />
      </button>
      {isTypeOpen && (
        <ul className="absolute w-full h-[200px] rounded-md flex flex-col items-start gap-1 p-2 z-30 bg-white ring-1 ring-neutral-300 shadow-sm overflow-y-scroll">
          {options.map((option, index) => (
            <li key={index} onClick={() => handleEventTypeChange(option)} className="hover:bg-neutral-50 w-full px-2 py-2 rounded-[4px] cursor-pointer text-neutral-950">
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default SelectType;
