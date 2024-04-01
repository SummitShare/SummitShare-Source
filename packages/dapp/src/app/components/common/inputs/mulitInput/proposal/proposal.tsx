/**
 * ProposalForm Component
 *
 * This component is designed for creating and submitting event proposals. It leverages `react-hook-form` for form
 * management, ensuring efficient handling of form state and validation. The form includes multiple input fields and
 * select dropdowns to capture details about the event, such as name, category, start and end times, location, and more.
 *
 * Features:
 * - Utilizes `react-hook-form` for streamlined form management and validation.
 * - Incorporates custom `Input` and `SelectType` components for a consistent UI.
 * - Dynamically fetches location options from an external API, showcasing asynchronous data loading and state management.
 * - Offers a comprehensive form for capturing all necessary details for an event proposal, ensuring a thorough submission process.
 *
 * The form is structured to capture a wide range of event details, facilitating a detailed and structured proposal process.
 * Upon submission, form data is logged to the console, and the form is reset, ready for another submission.
 *
 * Implementation Notes:
 * - Ensure that paths to the `Input` and `SelectType` components are correct based on your project's directory structure.
 * - The `fetchLocationOptions` function demonstrates asynchronous fetching and state updating, which could be adapted
 *   for other data-fetching needs within your application.
 * - This component could be extended with additional validation, error handling, or submission capabilities as required.
 */

// React and react-hook-form imports
"use client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "../../input/input"; // Ensure this path is correct
import SelectType from "../../../functonal/selectType/selectType";
import { IProposal } from "@/utils/dev/frontEndInterfaces"; // Interface for form data structure


// Dummy options for select components
const TIMEZONE_OPTIONS = ["UTC-5", "UTC", "UTC+1", "UTC+2"];
const CATEGORY_OPTIONS = ["History", "Art"];

const ProposalForm: React.FC = () => {
  const { register, handleSubmit, control, reset } = useForm<IProposal>();
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocationOptions = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((country: any) => country.name.common);
        setLocationOptions(countryNames);
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };

    fetchLocationOptions();
  }, []);

  const onSubmit = (data: IProposal) => {
    console.log(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Event Name" name="event_name" register={register} />
      <Controller
        name="event_timezone"
        control={control}
        render={({ field }) => (
          <SelectType
            options={TIMEZONE_OPTIONS}
            first="Select Timezone"
            type="event_timezone"
            {...field}
          />
        )}
      />
      <Controller
        name="event_location"
        control={control}
        render={({ field }) => (
          <SelectType
            options={locationOptions}
            first="Select Location"
            type="event_location"
            {...field}
          />
        )}
      />
      <Controller
        name="event_category"
        control={control}
        render={({ field }) => (
          <SelectType
            options={CATEGORY_OPTIONS}
            first="Select Category"
            type="event_category"
            {...field}
          />
        )}
      />
      {/* Additional form inputs for event details */}
      {/* Submit button with Tailwind CSS styling */}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default ProposalForm;
