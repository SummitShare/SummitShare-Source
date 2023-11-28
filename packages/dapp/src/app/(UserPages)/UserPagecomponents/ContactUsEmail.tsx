"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import Form from "@/components/reusebaeComponents/form";
import LineInputs from "@/components/reusebaeComponents/LineInput";
import TextArea from "@/components/reusebaeComponents/textArea";
import Button from "@/components/reusebaeComponents/button";
import Partners from "./Partners";

interface fromData {
  email: string;
  message: string;
  subject: string;
}

function ContactUs() {
  const form = useForm<fromData>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = (data: fromData) => {
    console.log("form submitted", data);
  };

  return (
    <div className="w-full flex px-32 ">
      <div className="flex w-full flex-row py-20 px-10 items-center justify-between ">
        <Form
          title="Contact Us"
          // @ts-ignore
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          description="Email us if you have any inquires"
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

              <p className="text-xs text-red-500 font-light">
                {errors.email?.message}
              </p>
              <LineInputs
                length="[350px]"
                label="Subject"
                name="subject"
                type="text"
                id="subject"
                message="Subject name required!"
                register={register}
              />
              <p className="text-xs text-red-500 font-light">
                {errors.subject?.message}
              </p>
              <TextArea
                length="[350px]"
                hight="h-40"
                label="Message"
                name="message"
                id="message"
                message="message name required!"
                register={register}
              />
              <p className="text-xs text-red-500 font-light">
                {errors.message?.message}
              </p>
            </div>
          }
          submit={
            <div className="">
              <Button
                text="Submit"
                type="submit"
                backGroundColor=" bg-gradient-to-r from-orange-500 to-orange-400"
                textColor="text-white"
              ></Button>
            </div>
          }
        />

        <div>
          <Partners />
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
