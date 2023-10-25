"use client";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

function DashboardSettings() {
  interface fromData {
    email: string;
    password: string;
  }
  const form = useForm<fromData>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = (data: fromData) => {
    console.log("form submitted", data);
  };
  return (
    <div className="px-6 space-y-20 lg:mx-[250px]">
      {/* Personal Information Section */}
      <section className="mt-24">
        <div className="space-y-2">
          <p className="text-xl font-bold">Personal Information</p>
          <span className="text-xs font-normal">
            Update your account as you wish
          </span>
        </div>
      </section>
      {/* Change Profile Image Section */}
      <section className="space-y-5">
        <div className="flex flex-row gap-4 items-center">
          <div className="bg-gray-100 w-14 h-14 lg:w-[88px] lg:h-[88px] rounded-full">
            <Image className={"rounded-full"} src={""} alt="" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-500">Change Image</p>
            <p className="text-sm font-normal">JPG, GIF, or PNG</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Input for Name */}
          <div className="gap-2 flex flex-col">
            <label className="text-base font-medium" htmlFor="">
              Name
            </label>
            <input
              className="w-[338px] h-[56px] lg:w-[510px] pl-5 rounded-full border caret-slate-500 placeholder:text-sm"
              type="text"
              placeholder="Enter Your Name"
            />
          </div>
          {/* Input for Email */}
          <div className="gap-2 flex flex-col">
            <label className="text-base font-medium" htmlFor="">
              Email
            </label>
            <input
              className="w-[338px] h-[56px] lg:w-[510px] pl-5 rounded-full border caret-slate-500 placeholder:text-sm"
              type="text"
              placeholder="Enter Your Email"
            />
          </div>
          {/* Save Button */}
          <button className="bg-slate-500 rounded-full py-4 px-3 text-base text-white w-[112px] ">
            Save
          </button>
        </div>
      </section>
      {/* Change Password Section */}
      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-xl font-bold">Change Password</p>
          <span className="text-xs font-normal">
            Update your password associated with your account.
          </span>
        </div>
        <div className="space-y-4">
          {/* Input for Current Password */}
          <div className="gap-2 flex flex-col">
            <label className="text-base font-medium" htmlFor="">
              Current Password
            </label>
            <input
              className="w-[338px] h-[56px] lg:w-[510px] pl-5 rounded-full border caret-slate-500 placeholder:text-sm"
              type="text"
              placeholder="Enter password"
            />
          </div>
          {/* Input for New Password */}
          <div className="gap-2 flex flex-col">
            <label className="text-base font-medium" htmlFor="">
              New Password
            </label>
            <input
              className="w-[338px] h-[56px] lg:w-[510px] pl-5 rounded-full border caret-slate-500 placeholder:text-sm"
              type="text"
              placeholder="Enter new password"
            />
          </div>
          {/* Input for Confirm Password */}
          <div className="gap-2 flex flex-col">
            <label className="text-base font-medium" htmlFor="">
              Confirm Password
            </label>
            <input
              className="w-[338px] h-[56px] lg:w-[510px] pl-5 rounded-full border caret-slate-500 placeholder:text-sm"
              type="text"
              placeholder="Confirm new password"
            />
          </div>
          {/* Save Button */}
          <button className="bg-slate-500 rounded-full py-4 px-3 text-white w-[112px] ">
            Save
          </button>
        </div>
      </section>
      {/* Log Out Other Sessions Section */}
      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-xl font-bold">Log Out Other Sessions</p>
          <span className="text-xs font-normal">
            Please enter your password to confirm you would like to log out of
            your other sessions across all of your devices.
          </span>
        </div>
        <div className="gap-2 flex flex-col">
          {/* Input for Your Password */}
          <label className="text-base font-medium" htmlFor="">
            Your Password
          </label>
          <input
            className="w-[338px] h-[56px] lg:w-[510px] pl-5 rounded-full border caret-slate-500 placeholder:text-sm"
            type="text"
            placeholder="Enter your password"
          />
        </div>
        {/* Log Out Button for Other Sessions */}
        <button className="bg-slate-500 rounded-full py-4 px-3 text-white w-[232px] ">
          Log Out Other Sessions
        </button>
      </section>
      {/* Delete Account Section */}
      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-xl font-bold">Delete Account</p>
          <span className="text-xs font-normal">
            You can delete your account here. This action is not reversible. All
            information related to this account will be deleted permanently.
          </span>
        </div>
        {/* Delete Account Button */}
        <button className="bg-red-500 rounded-full py-4 px-3 text-white w-[232px] ">
          Yes, delete my account
        </button>
      </section>
    </div>
  );
}

export default DashboardSettings;
