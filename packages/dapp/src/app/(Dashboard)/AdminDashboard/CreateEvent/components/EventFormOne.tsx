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

interface FormData {
  proposal: {
    event_type: string;
    event_name: string;
    event_category: string;
    event_start_time: Date;
    event_end_time: Date;
    event_timezone: string;
    event_location: string;
    description: string;
    contract_address: string;
    symbol: string;
    cost: number;
    total_number_tickets: number;
    eventDate: string;
  };
  emailsArray: string[];
}

interface SubmissionData {
  eventType: string;
  eventName: string;
  eventCategory: string;
  eventStartTime: Date;
  eventEndTime: Date;
  eventTimezone: string;
  eventLocation: string;
  eventDescription: string;
  contractAddress: string;
  symbol: string;
  cost: number;
  totalNumberTickets: number;
  eventDate: string;
  emailsArray: string[];
}

// function transformFormData(formData: FormData): SubmissionData {
//   const {
//     proposal: {
//       event_type,
//       event_name,
//       event_category,
//       event_start_time,
//       event_end_time,
//       event_timezone,
//       event_location,
//       description,
//       contract_address,
//       symbol,
//       cost,
//       total_number_tickets,
//       eventDate,
//     },
//     emailsArray,
//   } = formData;
// const formattedData: SubmissionData = {
//     eventType: event_type,
//     eventName: event_name,
//     eventCategory: event_category,
//     eventStartTime: event_start_time,
//     eventEndTime: event_end_time,
//     eventTimezone: event_timezone,
//     eventLocation: event_location,
//     eventDescription: description,
//     contractAddress: contract_address,
//     symbol: symbol,
//     cost: cost,
//     totalNumberTickets: total_number_tickets,
//     eventDate: eventDate,
//     emailsArray: emailsArray,
//   };

//   return formattedData;
// }




function EventForm()  {
  const eventTypes = [
    { name: "Museum" },
    { name: "Art Gallery" },
    // other event types
  ];

  const timeZone = [
    { name: "CAT" },
    { name: "GMT" },
    { name: "PST" },
    { name: "EAT" },
    { name: "WAT" },
    // other event types
  ];

  const form = useForm<FormData>({

});

  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = (data: response ) => {
    console.log("form submitted", data);
  };
const { fields, append, remove } = useFieldArray({
  control,
  // @ts-ignore
  name: "emailsArray",


});
function transformFormData(formData: FormData): SubmissionData {
  const {
    proposal: {
      event_type,
      event_name,
      event_category,
      event_start_time,
      event_end_time,
      event_timezone,
      event_location,
      description,
      contract_address,
      symbol,
      cost,
      total_number_tickets,
      eventDate,
    },
    emailsArray,
  } = formData;

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
}

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
                  name="event_type"
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
                  name="event_timezone"
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
                    name="event_name"
                    type="text"
                    id="event_name"
                    message="event name required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.event_name?.message}
                  </p>
                  <LineInputs
                    text="Lusaka,Zambia"
                    length="[350px]"
                    label="Event Location"
                    name="event_location"
                    type="text"
                    id="event_location"
                    message="event location required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.event_location?.message}
                  </p>
                  <LineInputs
                    text="$0.00"
                    length="[350px]"
                    label="Ticket Cost"
                    name="cost"
                    type="text"
                    id="cost"
                    message="ticket cost required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.cost?.message}
                  </p>
                  <LineInputs
                    text="Number"
                    length="[350px]"
                    label="   total_number_tickets"
                    name="   total_number_tickets"
                    type="text"
                    id="   total_number_tickets"
                    message="ticketNo required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.   total_number_tickets?.message}
                  </p>
                  <TextArea
                    text="Type..."
                    length="full"
                    label="description"
                    name="description"
                    id="description"
                    message="description required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.description?.message}
                  </p>
                </div>
                <div className="space-y-6">
                  <LineInputs
                    length="[350px]"
                    label="Event Start Time"
                    name="event_start_time"
                    type="time"
                    id="event_start_time"
                    message="time required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.event_start_time?.message}
                  </p>
                  <LineInputs
                    length="[350px]"
                    label="Event End Time"
                    name="event_end_time"
                    type="time"
                    id="event_end_time"
                    message="time required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.event_end_time?.message}
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
                    label="symbol"
                    name="symbol"
                    type="text"
                    id="symbol"
                    message="event symbol required!"
                    register={register}
                  />
                  <p className="text-xs text-red-500 font-light">
                    {errors.symbol?.message}
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
                      emailsArray:"",
              
                    })
                  }
                >
                  <AddPartnerButton />
                </div>

         {fields.map((field, index) => (
  <div key={field.id} className="flex flex-row gap-2 items-end">
     <LineInputs
      text="partner@mail.com"
      length="[350px]"
      label="Email"
      name={`emailsArray.${index}`}
      type="text"
      id={`email-${index}`}
      message="Email required!"
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
              {/* <div className="space-y-6">
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
              </div> */}
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

