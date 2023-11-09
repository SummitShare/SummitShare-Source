import ExhibitLink from "@/reusebaeComponents/3DExhibitLink";
import ObjectCards from "@/reusebaeComponents/3DObjectCards";
import React from "react";
import CountryFilter from "../UserPagecomponents/Filters/CountryFilter";

function page() {
  return (
    <div>
      <ObjectCards />
      <ExhibitLink />
    </div>
  );
}

export default page;
