"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Form from "@/reusebaeComponents/form";
import Button from "@/reusebaeComponents/button";

interface FormData {
  coverPhoto: FileList;
  galleryImages: FileList;
}

function FileUploadForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    null
  );
  const [galleryImagesPreview, setGalleryImagesPreview] = useState<string[]>(
    []
  );

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Handle form submission with the uploaded files (data.coverPhoto and data.galleryImages)
    console.log("Submitted Data:", data);
  };

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
      <Form
        title="File Upload Form"
        description="Upload a cover photo and up to 4 gallery images"
        // @ts-ignore
        onSubmit={handleSubmit(onSubmit)}
        inputs={
          <div className="flex flex-row gap-10">
            <div>
              <Controller
                name="coverPhoto"
                control={control}
                render={({ field }) => (
                  <>
                    <div
                      className={`relative rounded-xl w-[450px] h-[450px] flex justify-center items-center overflow-hidden ${
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
                          className="w-[440px] h-[440px] rounded-xl"
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
                      className={`relative rounded-xl  w-[450px] h-[450px] flex justify-center items-center ${
                        galleryImagesPreview.length === 0
                          ? "border  border-dashed border-stone-500 "
                          : "border  border-dashed border-amber-500 "
                      }`}
                    >
                      {galleryImagesPreview.length === 0 ? (
                        <p className="text-slate-500/50">Gallery Images</p>
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
                      <div className="grid grid-cols-2 grid-rows-2 gap-2">
                        {galleryImagesPreview.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Gallery Image Preview ${index}`}
                            className="w-[215px] h-[215px] rounded-xl"
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
      ></Form>
    </div>
  );
}

export default FileUploadForm;
