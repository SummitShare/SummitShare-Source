"use client";
import AddPartnerButton from "@/components/reusebaeComponents/addPartnerButton";
import Button from "@/components/reusebaeComponents/button";
import Form from "@/components/reusebaeComponents/form";
import Inputs from "@/components/reusebaeComponents/inputs";
import RemovePartnerButton from "@/components/reusebaeComponents/removePartnerIcon";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

// Define initial data structure for a partner
interface fromData {
  Admin: {
    email: string;
  }[];
}

function AddAdminForm() {
  const form = useForm<fromData>({
    defaultValues: {
      Admin: [{ email: "" }],
    },
  });
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    name: "Admin",
    control,
  });

  const onSubmit = (data: fromData) => {
    console.log("form submitted", data);
  };

  // Render the component
  return (
    <div>
      <div className="absolute lg:top-[30px] top-[60px] right-[-55px] lg:-left-[400px]">
        <Form
          title="Add Admin"
          // @ts-ignore
          onSubmit={handleSubmit(onSubmit)}
          bg="bg-white"
          shadow="md"
          noValidate
          description="Add new admins email to give them access ro this account"
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
                    })
                  }
                >
                  <AddPartnerButton />
                </div>
              )}

              {/* Partner input fields */}
              {fields.map((admin, index) => (
                <div key={admin.id} className=" flex flex-row gap-2 items-end">
                  {/* Email input */}
                  <Inputs
                    text="Admin@mail.com"
                    length="[300px]"
                    label="Email"
                    name={`Admin.${index}.email`}
                    type="text"
                    id="email"
                    message="Add email"
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
                text="Add"
                type="submit"
                backGroundColor="slate-950"
                textColor="white"
              />
            </div>
          }
        />
      </div>
    </div>
  );
}

export default AddAdminForm;
