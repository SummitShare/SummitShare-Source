'use client'
import Buttons from "@/app/components/common/button/Butons";
import Butons from "@/app/components/common/button/Butons";
// import Logout from "@/app/components/common/logout/logout";


// import { getSession, useSession } from "next-auth/react";
// import Link from "next/link";


const Test =  () =>{

// const session =  useSession();



    return(
        <div className="px-2">
   
          {/* <p>{JSON.stringify(session)}</p> */}

          <div>
      <Buttons type="primary" size="large" active>
        Primary Large Active Button
      </Buttons>
      <Buttons type="secondary" size="large">
        Secondary Large Button
      </Buttons>
      <Buttons type="primary" size="small" active>
        Primary Small Active Button
      </Buttons>
      <Buttons type="secondary" size="small">
        Secondary Small Button
      </Buttons>
    </div>

      

<p>
  
</p>


            <nav>
                {/* {session?
                    <Logout/>:<Link href="/auth-sign-in">Login</Link>
                } */}
                 
            </nav>
        </div>
    );
}
export default Test;