export const sendData = async (user_id: string, event_id: string) => {
   const host = process.env.NEXT_PUBLIC_HOST;
   const url = `${host}api/v1/events/data`;
   ////console.log(`host ${host} `)
   try {
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ event_id, user_id }),
      });

      if (!response.ok) {
         ////console.log(`Error: ${response.status} - ${response.statusText}`);
         return null;
      }

      const data = await response.json();
      ////console.log(data);
      return data;
   } catch (error) {
      console.error('Failed to send data:', error);
      return null;
   }
};
