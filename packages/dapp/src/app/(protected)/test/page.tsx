'use client'
import Buttons from "@/app/components/common/button/Butons";
import Butons from "@/app/components/common/button/Butons";
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
    </div>

    
    );
}
export default Test;