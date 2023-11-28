"use client";
import { useRouter } from "next/navigation";
import Form from "@/components/reusebaeComponents/form";
import LineInputs from "@/components/reusebaeComponents/LineInput";
import Button from "@/components/reusebaeComponents/button";
import { useForm } from "react-hook-form";

interface fromData {
  email: string;
  password: string;
}

function EmailForm() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/Landing");
  };

  const form = useForm<fromData>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = (data: fromData) => {
    console.log("form submitted", data);
  };

  return (
    <div className=" ">
      <Form
        title="Hey welcome back!"
        // @ts-ignore
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        description="SignIn to your SummitShare Account"
        inputs={
          <div className="space-y-5">
            <LineInputs
              length="[350px]"
              label="Email"
              name="email"
              type="email"
              id="email"
              message="Email name required!"
              register={register}
            />
          </div>
        }
        submit={
          <div className="flex flex-row gap-2">
            <Button
              text="Submit"
              type="submit"
              backGroundColor="bg-orange-500"
              textColor="text-white"
              hover="hover:shadow-lg"
            />
          </div>
        }
      />
    </div>
  );
}

export default EmailForm;
