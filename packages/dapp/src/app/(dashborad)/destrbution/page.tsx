import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'

function page() {
  const session = useSession();
  const exhibitId = '0xe405b9c97656336ab949401bcd41ca3f50114725';
  const host = process.env.NEXT_PUBLIC_HOST;
  const user_id = session.data?.user.id 
  const sendData = async () => {
  const url = `${host}api/v1/event/data`;
    try {
     const response = await fetch(url, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({exhibitId,user_id})
      });

      if (!response.ok) {
       console.log(`Error: ${response.status} - ${response.statusText}`);
      }
      return console.log(response.json());
    } catch (error) {
      console.error("Failed to send data:", error);
      
    }
  }
  
  useEffect(() => {
    if (user_id) {
      sendData();
    }
  }, [user_id]);


  return (
    <div>
      <p>hello</p>
    </div>
  )
}

export default page
