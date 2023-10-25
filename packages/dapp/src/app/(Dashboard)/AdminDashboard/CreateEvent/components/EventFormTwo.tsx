"use client";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { addEventToDatabase } from "@/functonality/createEvent";
import AddPartnerButton from "@/popUpComponents/addPartnerButton";
import RemovePartnerButton from "@/popUpComponents/removePartnerIcon";
import Button from "@/reusebaeComponents/button";
import Form from "@/reusebaeComponents/form";
import Inputs from "@/reusebaeComponents/inputs";

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
              {fields.length >= 4 ? (
                <div></div>
              ) : (
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
              )}

              {/* Partner input fields */}
              {fields.map((partners, index) => (
                <div
                  key={partners.id}
                  className=" flex flex-row gap-2 items-end"
                >
                  {/* Email input */}
                  <Inputs
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
                  <Inputs
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
                  <Inputs
                    text="0%"
                    length="20"
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
                backGroundColor="slate-950"
                textColor="white"
              />
              <Button
                text="Cancel"
                type="button"
                textColor="slate-500"
                borderColor="slate-500"
              />
            </div>
          }
        />
      </div>
    </div>
  );
}

export default EventFormTwo;
