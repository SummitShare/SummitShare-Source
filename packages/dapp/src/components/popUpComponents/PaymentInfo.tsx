import React from "react";
import Button from "../reusebaeComponents/button";

function PaymentInfo() {
  const PaymentData = [
    { name: "Event Name", value: "womens history museum", id: 1 },
    { name: "Event Time", value: "1:30PM", id: 2 },
    { name: "Event Date", value: "11/13/2023", id: 3 },
    { name: "Event Location", value: "Lusaka,Zambia", id: 4 },
    { name: "Event Price", value: "000,235Eth", id: 5 },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950/20 z-50 ">
      <div className="w-[350px] h-fit rounded-xl space-y-6  bg-slate-50 shadow-md px-5 py-4">
        <div className="text-base text-blue-950 space-y-2">
          <p className="font-bold text-blue-950 text-2xl">Buy Ticket</p>
          <p className="text-slate-500">
            View all the payment details below
          </p>
        </div>
        <div className="space-y-6">
      
          <div className="space-y-2">
            {PaymentData.map((details) => (
              <div key={details.id} className="flex flex-row justify-between">
                <p className="text-base text-bold text-slate-700">{`${details.name}:`}</p>
                <p className="text-base text-slate-500">{details.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row gap-2">
       <Button
       
       text="Purchuse"
       type="submit"
       backGroundColor="bg-orange-500"
       hover="hover:shadow-lg"
       textColor="text-white font-semibold"
       />
          <Button
       
       text="Cancle"
       type="button"
       hover="hover:shadow-lg"
       textColor="text-red-500 font-semibold"
       borderColor=" border border-red-500"
       />
         
        </div>
      </div>
    </div>
  );
}

export default PaymentInfo;
