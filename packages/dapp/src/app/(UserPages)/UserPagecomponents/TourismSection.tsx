import React from "react";
import SelectorCountry from "../../../ComponentsToBeEdited/SelectorCountry";
import SelectorEvents from "../../../ComponentsToBeEdited/SelectorEvent";
import TabsMenu from "../../../ComponentsToBeEdited/TabsMenu";
import TicketCard from "../../../ComponentsToBeEdited/TicketCard";
import TourismCard from "../../../ComponentsToBeEdited/TourismCard";
import TourismEvents from "../../../ComponentsToBeEdited/TourismEvents";

function Tourism() {
  return (
    <div className="space-y-5">
      <div className="space-y-5 w-full ">
        <div className="space-y-2">
          <p className="text-xl font-semibold">Tour Africa's Famous Hot Spot</p>
          <p className="text-sm text-slate-500">
            Lorem ipsum dolor sit amet consectetur. Porttitor bibendum et cras
            interdum faucibus quis tortor sagittis orci. Libero gravida
            parturient ultrices non leo integer senectus urna auctor. Est
            viverra cras se.
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <SelectorCountry />
          <TourismEvents />
        </div>
        <TourismCard />
      </div>
    </div>
  );
}

export default Tourism;
