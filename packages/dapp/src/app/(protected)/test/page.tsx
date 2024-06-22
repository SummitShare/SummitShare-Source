'use client'

import Buttons from "@/app/components/common/button/Butons";
import Inputs from "@/app/components/common/inputs/input/Inputs";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const Test = () => {
  return (
    <div className="flex flex-col gap-2 p-2">
  

      <div className="flex flex-col gap-2 p-2">
      <Inputs
          type="select"
          label="Country"
          state="active"
          defaultValue="Select"
          options={['USA', 'Canada', 'Zambia']}
        />
        <Inputs
          type="input"
          label="Fullname"
          help="Enter your full name"
          helpIcon={<InfoCircledIcon />}
          state="active"
          defaultValue="John Doe"
        />
      
        <Inputs
          type="textarea"
          label="Comments"
          state="active"
          defaultValue="Your comments here"
        />
         <Buttons type="primary" size="large" active>
      Sumbit my data
      </Buttons>
     
      </div>
     
    </div>
  );
}

export default Test;
