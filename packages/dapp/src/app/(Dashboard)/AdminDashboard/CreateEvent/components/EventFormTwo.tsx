"use client";
import AddPartnerButton from "@/components/reusebaeComponents/addPartnerButton";
import Button from "@/components/reusebaeComponents/button";
import Form from "@/components/reusebaeComponents/form";
import LineInputs from "@/components/reusebaeComponents/LineInput";
import RemovePartnerButton from "@/components/reusebaeComponents/removePartnerIcon";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

// Define initial data structure for a partner
interface fromData {
  partners: {
    email: string;
    walletAddress: string;
    split: string;
  }[];
}

function EventFormTwo() {
  const form = useForm<fromData>({
    defaultValues: {
      partners: [{ email: "", walletAddress: "", split: "" }],
    },
  });
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    name: "partners",
    control,
  });

  const onSubmit = (data: fromData) => {
    console.log("form submitted", data);
  };

  // Render the component
  return (
    <div>
      <div>
        <Form
          title="Create a new event"
          // @ts-ignore
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          description="Fill in the inputs below to create a new event!"
          inputs={
            <div className="space-y-5 ">
              {/* Add partner button */}

              <div
                className="w-fit h-fit"
                onClick={() =>
                  append({
                    email: "",
                    walletAddress: "",
                    split: "",
                  })
                }
              >
                <AddPartnerButton />
              </div>

              {/* Partner input fields */}
              {fields.map((partners, index) => (
                <div
                  key={partners.id}
                  className=" flex flex-row gap-2 items-end"
                >
                  {/* Email input */}
                  <LineInputs
                    text="partner@mail.com"
                    length="[350px]"
                    label="Email"
                    name={`partners.${index}.email`} // Fixed name attribute
                    type="text"
                    id="email"
                    message="email required!"
                    register={register}
                  />

                  {/* Wallet Address input */}
                  <LineInputs
                    text="Wallet Address(ERC20)"
                    length="[400px]"
                    label="Wallet Address"
                    name={`partners.${index}.walletAddress`}
                    type="text"
                    id="walletAddress"
                    message="walletAddress required!"
                    register={register}
                  />

                  {/* Split input */}
                  <LineInputs
                    text="0%"
                    length="24"
                    label="Split"
                    name={`partners.${index}.split`}
                    type="text"
                    id="split"
                    message="split required!"
                    register={register}
                  />

                  {/* Remove partner button */}
                  {fields.length > 1 && (
                    <div className="pb-[2px]" onClick={() => remove(index)}>
                      <RemovePartnerButton />
                    </div>
                  )}
                </div>
              ))}
            </div>
          }
          submit={
            <div className="flex flex-row gap-2">
              {/* Next and Cancel buttons */}
              <Button
                text="Submit"
                type="submit"
                backGroundColor="bg-amber-500"
                textColor="text-white"
              />
            </div>
          }
        />
      </div>
    </div>
  );
}

export default EventFormTwo;
