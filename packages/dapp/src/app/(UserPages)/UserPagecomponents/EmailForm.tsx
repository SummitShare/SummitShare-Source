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
    <div className="space-y-6  ">
      <div className="space-y-2">
        <p className="text-2xl font-poppins font-bold">Join Our News Letter</p>
        <p className="font-opensans text-slate-500">Input yore email to assess all our latast news</p>
      </div>
      
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
  
      
          <div className="flex flex-row gap-2">
            <Button
              text="Submit"
              type="submit"
              backGroundColor="bg-orange-500"
              textColor="text-white"
              hover="hover:shadow-lg"
            />
          </div>
    
  
    </div>
  );
}

export default EmailForm;
