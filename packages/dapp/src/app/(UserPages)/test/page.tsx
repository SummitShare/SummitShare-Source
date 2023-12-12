import ExhibitLink from "@/components/reusebaeComponents/3DExhibitLink";
import ObjectCards from "@/components/reusebaeComponents/3DObjectCards";
import React from "react";
import CountryFilter from "../UserPagecomponents/Filters/CountryFilter";
import PaymentInfo from "@/components/popUpComponents/PaymentInfo";
import Success from "@/components/popUpComponents/Success";
import Failed from "@/components/popUpComponents/Failed";

function page() {
  return (
    // <div className="space-y-5">
    //   <div className="title-h6-slate">
    //     <p className="text-slate-500 font-light">
    //       Profile/Womens history museums/Headrest
    //     </p>
    //   </div>
    //   <ObjectCards />
    //   {/* <ExhibitLink /> */}
    // </div>
    // <PaymentInfo/>
    // <Success/>
    <Failed/>
  );
}

export default page;
