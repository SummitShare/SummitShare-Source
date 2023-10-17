"use client";
import { addEventToDatabase } from "@/app/functonality/createEvent";
import AddPartnerButton from "@/app/popUpComponents/addPartnerButton";
import RemovePartnerButton from "@/app/popUpComponents/removePartnerIcon";
import Button from "@/app/reusebaeComponents/button";
import Form from "@/app/reusebaeComponents/form";
import Inputs from "@/app/reusebaeComponents/inputs";
import Link from "next/link";
import { useState } from "react";

// Define initial data structure for a partner
const data = {
  partner: {
    email: "",
    walletAddress: "",
    split: "",
  },
};

function EventFormTwo() {
  // Initialize state for partner inputs
  const [partnerInput, setPartnerInput] = useState([data]);
  console.log(partnerInput);
  // Function to add a new partner input field
  const handleAddPartner = () => {
    partnerInput.push(data);
    setPartnerInput([...partnerInput]);
  };

  // Function to remove a partner input field
  const handleRemovePartner = (index: number) => {
    const partner = [...partnerInput];
    partner.splice(index, 1);
    setPartnerInput(partner);
  };

  // Function to handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const newPartnerData = [...partnerInput];
    newPartnerData[index].partner[name] = value;
    setPartnerInput(newPartnerData);
  };

  // Render the component
  return (
    <div className="w-full h-full flex justify-center items-center fixed bg-gray-500/75">
      <div>
        <Form
          title="Create a new event"
          description="Fill in the inputs below to create a new event!"
          inputs={
            <div className="space-y-5 ">
              {/* Add partner button */}
              {partnerInput.length >= 4 ? (
                <div></div>
              ) : (
                <div className="w-fit h-fit" onClick={handleAddPartner}>
                  <AddPartnerButton />
                </div>
              )}

              {/* Partner input fields */}
              {partnerInput.map((partners, index) => (
                <div key={index} className=" flex flex-row gap-2 items-end">
                  {/* Email input */}
                  <Inputs
                    text="partner@mail.com"
                    length="[350px]"
                    label="Email"
                    name="email" // Fixed name attribute
                    type="text"
                    id="partnerEmail"
                    value={partners.partner.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e, index)
                    }
                  />
                  {/* Wallet Address input */}
                  <Inputs
                    text="Wallet Address(ERC20)"
                    length="[400px]"
                    label="Wallet Address"
                    name="walletAddress"
                    type="text"
                    value={partners.partner.walletAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e, index)
                    }
                  />
                  {/* Split input */}
                  <Inputs
                    text="0%"
                    length="20"
                    label="Split"
                    name="split"
                    type="text"
                    value={partners.partner.split}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e, index)
                    }
                  />
                  {/* Remove partner button */}
                  {partnerInput.length > 1 && (
                    <div
                      className="pb-[2px]"
                      onClick={() => handleRemovePartner(index)}
                    >
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
                text="Next"
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
