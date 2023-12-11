"use client";
import AddPartnerButton from "@/components/reusebaeComponents/addPartnerButton";
import Button from "@/components/reusebaeComponents/button";
import Form from "@/components/reusebaeComponents/form";
import LineInputs from "@/components/reusebaeComponents/LineInput";
import RemovePartnerButton from "@/components/reusebaeComponents/removePartnerIcon";
import SelectComponent from "@/components/reusebaeComponents/selectComponent";


import TextArea from "@/components/reusebaeComponents/textArea";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

interface fromData {
  eventName: string;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  ticketCost: string;
  ticketNo: string;
  discretion: string;
  eventDate: string;
  Symbol: string;
  partners: {
    email: string;
    walletAddress: string;
    split: string;
  }[];
  coverPhoto: FileList;
  galleryImages: FileList;
  eventType: string;
  timeZone: string;
}

function EventForm() {
  const eventTypes = [
    { name: "museum" },
    { name: "Art Gallery" },
    // other event types
  ];

  const timeZone = [
    { name: "GTA" },
    { name: "ETA" },
    // other event types
  ];

  const form = useForm<fromData>({
    defaultValues: {
      partners: [
        {
          email: "",
          walletAddress: "",
          split: "",
        },
      ],
    },
  });

  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = (data: fromData) => {
    console.log("form submitted", data);
  };
  const { fields, append, remove } = useFieldArray({
    name: "partners",
    control,
  });

  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null
  );
  const [galleryImagesPreview, setGalleryImagesPreview] = useState<string[]>(
    []
  );

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setCoverPhotoPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const imagePreviews: string[] = [];
      // Limit the number of displayed gallery images to 4
      Array.from(e.target.files)
        .slice(0, 4)
        .forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target) {
              imagePreviews.push(e.target.result as string);
              setGalleryImagesPreview([...imagePreviews]);
            }
          };
          reader.readAsDataURL(file);
        });
    }
  };

  return (
    <div>
      <div>
        <Form
          title="Create a new event"
          // @ts-ignore
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          description=" fill in the inputs below to create a new event!"
          inputs={
            <div className="flex flex-col gap-6">
              <div className="flex flex-row justify-between w-full">
                {" "}
                <Controller
                  name="eventType"
                  control={control}
                  render={({ field }) => (
                    <SelectComponent
                      options={eventTypes}
                      placeholder="Choose an Event"
                      width="w-64"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="timeZone"
                  control={control}
                  render={({ field }) => (
                    <SelectComponent
                      options={timeZone}
                      placeholder="Choose a Time Zone"
                      width="w-64"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <p className="text-3xl text-blue-950 font-bold">
                  Event details
                </p>
                <p className="text-slate-500">
                  Provide the following information about your event
                </p>
              </div>
              <div className="flex flex-row gap-8 ">
                <div className="space-y-6">
                  <LineInputs
                    text="The world museum"
                    length="[350px]"
                    label="Event Name"
                    name="eventName"
                    type="text"
                    id="eventName"
                    message="event name required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.eventName?.message}
                  </p>
                  <LineInputs
                    text="Lusaka,Zambia"
                    length="[350px]"
                    label="Event Location"
                    name="eventLocation"
                    type="text"
                    id="eventLocation"
                    message="event location required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.eventLocation?.message}
                  </p>
                  <LineInputs
                    text="0000.000Eth"
                    length="[350px]"
                    label="Ticket Cost"
                    name="ticketCost"
                    type="text"
                    id="ticketCost"
                    message="ticket cost required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.ticketCost?.message}
                  </p>
                  <LineInputs
                    text="Number"
                    length="[350px]"
                    label="Ticket N.o"
                    name="ticketNo"
                    type="text"
                    id="ticketNo"
                    message="ticketNo required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.ticketNo?.message}
                  </p>
                  <TextArea
                    text="Type..."
                    length="full"
                    label="Discretion"
                    name="discretion"
                    id="discretion"
                    message="discretion required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.discretion?.message}
                  </p>
                </div>
                <div className="space-y-6">
                  <LineInputs
                    length="[350px]"
                    label="Event Start Time"
                    name="eventStartTime"
                    type="time"
                    id="eventStartTime"
                    message="time required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.eventStartTime?.message}
                  </p>
                  <LineInputs
                    length="[350px]"
                    label="Event End Time"
                    name="eventEndTime"
                    type="time"
                    id="eventEndTime"
                    message="time required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.eventEndTime?.message}
                  </p>
                  <LineInputs
                    length="[350px]"
                    label="Event Date"
                    name="eventDate"
                    type="date"
                    id="eventDate"
                    message="event date required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.eventDate?.message}
                  </p>
                  <LineInputs
                    text="Lusaka,Zambia"
                    length="[350px]"
                    label="Symbol"
                    name="Symbol"
                    type="text"
                    id="Symbol"
                    message="event Symbol required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.Symbol?.message}
                  </p>
                </div>
              </div>
              <div className="space-y-5 ">
                <div className="space-y-2">
                  <p className="text-3xl text-blue-950 font-bold">Partners</p>
                  <p className="text-slate-500">
                    Provide your Partners email addresses
                  </p>
                </div>
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
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-3xl text-blue-950 font-bold">Images</p>
                  <p className="text-slate-500">
                    Provide a cover photo and up to 4 galley images to give
                    users a feel of what you have to offer
                  </p>
                </div>
                <div className="space-y-6">
                  <div>
                    <Controller
                      name="coverPhoto"
                      control={control}
                      render={({ field }) => (
                        <>
                          <div
                            className={`relative rounded-xl w-full h-[300px] flex justify-center items-center overflow-hidden p-[10px] ${
                              coverPhotoPreview === null
                                ? "border  border-dashed border-stone-500 "
                                : "border  border-dashed border-amber-500 "
                            }`}
                          >
                            {coverPhotoPreview ? null : (
                              <p className="text-slate-500/50">Cover Photo</p>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                field.onChange(e.target.files);
                                handleCoverPhotoChange(e);
                              }}
                              className="absolute inset-0 opacity-0 w-full h-full"
                            />
                            {coverPhotoPreview && (
                              <img
                                src={coverPhotoPreview}
                                alt="Cover Photo Preview"
                                className="w-full h-full rounded-xl"
                              />
                            )}
                          </div>
                        </>
                      )}
                    />
                    {errors.coverPhoto && (
                      <p className="text-red-500">Cover photo is required.</p>
                    )}
                  </div>

                  <div>
                    <Controller
                      name="galleryImages"
                      control={control}
                      render={({ field }) => (
                        <>
                          <div
                            className={`relative rounded-xl  w-full h-[270px] flex justify-center items-center p-[10px] ${
                              galleryImagesPreview.length === 0
                                ? "border  border-dashed border-stone-500 "
                                : "border  border-dashed border-amber-500 "
                            }`}
                          >
                            {galleryImagesPreview.length === 0 ? (
                              <p className="text-slate-500/50">
                                Gallery Images
                              </p>
                            ) : null}

                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                field.onChange(e.target.files);
                                handleGalleryImagesChange(e);
                              }}
                              className="absolute inset-0 opacity-0 w-full h-full"
                            />
                            <div className="grid grid-cols-4 gap-2">
                              {galleryImagesPreview.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Gallery Image Preview ${index}`}
                                  className="w-full h-[250px] rounded-xl"
                                />
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    />
                    {errors.galleryImages && (
                      <p className="text-red-500">
                        At least one gallery image is required.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          }
          submit={
            <div className="flex flex-row gap-2">
              <Button
                text="Submit"
                type="submit"
                backGroundColor="bg-orange-500"
                textColor="text-white"
              />
            </div>
          }
        />
      </div>
    </div>
  );
}

export default EventForm;

