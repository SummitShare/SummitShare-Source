'use client'
import Logout from "@/app/components/common/logout/logout";

import { getSession, useSession } from "next-auth/react";
import Link from "next/link";


const Test =  () =>{

const session =  useSession();



    return(
        <div>
   
          <p>{JSON.stringify(session)}</p>
      

<p>
  
</p>


            <nav>
                {session?
                    <Logout/>:<Link href="/auth-sign-in">Login</Link>
                }
                 
            </nav>
        </div>
    );
}
export default Test;