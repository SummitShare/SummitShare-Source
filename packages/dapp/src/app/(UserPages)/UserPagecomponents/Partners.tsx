import Image from "next/image";

import eth from "public/ethLogo.svg";
import whm from "public/whm.svg";
import bicos from "public/bicos.svg";
export default function Partners() {
  return (
    <div className="gap-">
      <div className=" flex flex-col gap-2 items-center justify-center">
        <p className="title-h3-slate">Our Partners</p>
        <p className="body-text-h4">
          Meet the <span className=" text-orange-500">Companies </span>
          and <span className=" text-orange-500">Organizations</span> Who Trust
          Us
        </p>
        <div className="flex flex-row gap-5 items-center">
          <Image className="w-10 h-10" src={bicos} alt={""} />
          <Image className="w-10 h-10" src={whm} alt={""} />
          <Image className="w-10 h-10" src={eth} alt={""} />
        </div>
      </div>
    </div>
  );
}
