import React from "react";

function PaymentInfo() {
  const PaymentData = [
    { name: "Event Name", value: "womens history museum", id: 1 },
    { name: "Event Time", value: "1:30PM", id: 2 },
    { name: "Event Date", value: "11/13/2023", id: 3 },
    { name: "Event Location", value: "Lusaka,Zambia", id: 4 },
    { name: "Event Price", value: "000,235Eth", id: 5 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/10 ">
      <div className="w-[350px] h-fit rounded-xl space-y-5  bg-slate-50 shadow-md px-5 py-4">
        <div className="text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-950 text-xl">Buy Ticket</p>
          <p className="text-xs text-slate-500">
            View all the payment details below
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-base font-semibold text-slate-950">
            Event Details
          </p>
          <div className="space-y-2">
            {PaymentData.map((details) => (
              <div key={details.id} className="flex flex-row justify-between">
                <p className="text-sm text-slate-700">{details.name}</p>
                <p className="text-xs text-slate-500">{details.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <button className="bg-slate-950 text-white rounded-xl px-4 py-2 text-xs">
            Purchase
          </button>
          <button className="border border-slate-400 text-slate-400 rounded-xl px-4 py-3 text-xs">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentInfo;
