"use client";
import Button from "@/reusebaeComponents/button";
import Form from "@/reusebaeComponents/form";
import LineInputs from "@/reusebaeComponents/LineInput";
import TextArea from "@/reusebaeComponents/textArea";
import React from "react";
import { useForm } from "react-hook-form";
import Partners from "./LandingPartners";
import { DevTool } from "@hookform/devtools";

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
    <div className="lg:grid lg:grid-cols-2  items-center justify-center w-screen h-screen py-20 px-10 ">
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
          <div className="font-bold">
            <Button
              text="Submit"
              type="submit"
              backGroundColor="bg-orange-500"
              textColor="text-white"
              hover="hover:bg-orange-500/90"
            />
          </div>
        }
      />

      <DevTool control={control} />
      <div>
        <Partners />
      </div>
    </div>
  );
}

export default ContactUs;
