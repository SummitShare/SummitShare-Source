import { PlusIcon } from "@heroicons/react/24/solid";
import React from "react";

function AddPartnerButton() {
  return (
    <div className="w-10 h-10 rounded-full bg-stone-950 flex items-center justify-center">
      <PlusIcon className="w-6 h-6 text-white " />
    </div>
  );
}

export default AddPartnerButton;
