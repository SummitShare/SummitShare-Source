import React from "react";
import PartnersStatus from "./partnersStatus";

function PartnersStatusSection() {
  return (
    <div className="flex flex-col gap-6 bg-white rounded-[10px] p-6 w-full">
      <div className="flex flex-row justify-between items-end">
        <p className="text-base font-medium">MAG - Partners</p>
        <p className="text-xs text-slate-500">2 of 4 Accepted</p>
      </div>
      <div className="flex flex-col gap-3">
        <PartnersStatus
          image={
            "https://images.unsplash.com/photo-1701519664290-dac9ba60fce6?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          text={"Mario Jere"}
          status={false}
        />
        <PartnersStatus
          image={
            "https://images.unsplash.com/photo-1522878308970-972ec5eedc0d?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          text={"Jain Doe"}
          status={true}
        />
        <PartnersStatus
          image={
            "https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          text={"Mark Cat"}
          status={true}
        />
        <PartnersStatus
          image={
            "https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          text={"Agnes ron"}
          status={false}
        />
      </div>
    </div>
  );
}

export default PartnersStatusSection;
