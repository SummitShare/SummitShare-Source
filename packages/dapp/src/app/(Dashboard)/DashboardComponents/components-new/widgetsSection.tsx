import React from "react";
import Widget from "./widget";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

function WidgetsSection() {
  return (
    <section className="flex flex-row gap-5 no-scrollbar w-full">
      <Widget
        icon={<CalendarDaysIcon className="w-6 h-6 text-white" />}
        text={"Upcoming Events"}
        value={"12"}
        percentage={"11.01"}
      />
      <Widget
        icon={<CalendarDaysIcon className="w-6 h-6 text-white" />}
        text={"Solid Tickets"}
        value={"124"}
        percentage={"11.01"}
      />
      <Widget
        icon={<CalendarDaysIcon className="w-6 h-6 text-white" />}
        text={"Total Earning"}
        value={"$1400"}
        percentage={"11.01"}
      />
    </section>
  );
}

export default WidgetsSection;
