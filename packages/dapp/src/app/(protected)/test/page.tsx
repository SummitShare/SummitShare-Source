'use client'
import Buttons from "@/app/components/common/button/Butons";
import Butons from "@/app/components/common/button/Butons";
import Inputs from "@/app/components/common/inputs/input/Inputs";
import { HomeIcon, InfoCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

// import Logout from "@/app/components/common/logout/logout";


// import { getSession, useSession } from "next-auth/react";
// import Link from "next/link";


const Test =  () =>{

// const session =  useSession();



    return(
       <div className="flex flex-col gap-2 p-2">
      <Buttons type="primary" size="large" active>
        Primary Large Active Button
      </Buttons>
      <Buttons type="secondary" size="large" active>
        Secondary Large Button
      </Buttons>
      <Buttons type="primary" size="small" active>
        Primary Small Active Button
      </Buttons>
      <Buttons type="secondary" size="small" active>
        Secondary Small Button
      </Buttons>

    <div>
      <Inputs
        type="input"
        label="Fullname"

        help="Enter your full name"
        helpIcon={<InfoCircledIcon />}
        state="active"
        defaultValue="John Doe"
  
      />
      <Inputs
        type="select"
        label="Country"
        state="active"
        defaultValue="Select"
        options={['USA','Canda','Zambia']}
      >
      </Inputs>
      <Inputs
        type="textarea"
        label="Comments"
        state="active"
        defaultValue="Your comments here"
      />
    </div>
    </div>

    
    );
}
export default Test;