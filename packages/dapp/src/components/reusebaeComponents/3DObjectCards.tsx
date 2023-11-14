import { EyeIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/outline";
import React from "react";

const ObjectCards = () => {
  return (
    <div className="flex flex-row gap-5 h-fit w-fit items-center">
      <div className="space-y-5">
        <div className="rounded-xl bg-gradient-to-tr from-orange-500 to-orange-300 w-[500px] h-[500px]"></div>
        {/* <div className="flex flex-row gap-6 w-full ">
          <div className="flex flex-row gap-2 body-text-h3 items-center  ">
            <EyeIcon className="w-6 h-6 text-green-500 " />
            <p className="text-green-950 ">100 Views</p>
          </div>
          <div className="flex flex-row gap-2 body-text-h3 items-center group transition-all duration-100 cursor-pointer ">
            <HeartIcon
              className={`w-5 h-5 text-red-500 group-hover:fill-red-500 `}
            />
            <p className="text-red-950 group-hover:text-red-500">
              13 favorites
            </p>
          </div>
          <div className="flex flex-row gap-2 body-text-h3 items-center group   transition-all duration-100 cursor-pointer">
            <ShareIcon
              className={`w-5 h-5 text-blue-500 group-hover:fill-blue-500 `}
            />
            <p className="text-blue-950 group-hover:text-blue-500 ">
              Share Exhibit
            </p>
          </div>
        </div> */}
      </div>

      <div className="relative space-y-5 overflow-auto h-[550px]">
        <div className="  w-[700px] h-fit space-y-5 px-3 py-5">
          <div className="sticky top-0 flex flex-row items-center justify-start w-fit gap-2 w-full bg-white ">
            <div className="w-6 h-6 rounded-full bg-orange-500"></div>
            <p className="title-h2-orange ">Womens history museum</p>
          </div>
          <div className="space-y-2">
            <p className="title-h3-orange  ">The Headrest</p>
            <p className="body-text-h4">
              Made from one block of wood, with a support on top that has a
              depression to hold the neck of a sleeping person. The head rest
              has decorations made by chipping out pieces of wood, completely
              cut out of wood pieces and also engravings in the wood. The
              headrest is supported by two pieces of wood that are shaped like
              two half kneeling legs. Base of the head rests burnt in black as a
              way of treating the wood.
            </p>
          </div>
        </div>
        <div className="w-[700px] h-fit space-y-2 px-3 py-5">
          <p className=" title-h3-orange ">Biography</p>

          <p className=" body-text-h5  ">Julia Chikamoneka</p>
          <p className=" title-h6-slate">
            The fierce activist and pioneer of freedom from colonial rule
          </p>
          <p className=" body-text-h5  ">(1910 - 1986)</p>
          <p className="body-text-h4 ">
            Julia Mulenga ‘Chikamoneka’ was born Mary Nsofwa Lombe between 1904
            and 1910 in Kasama Northern Zambi. She was the daughter of Mulenga
            Lombe son of Chief Chitimukulu-Ponde, who served as an African
            sergeant during the First world war. The exposure to the welfare
            associations introduced Julia to politics and she quit her job and
            opened a food stall near Kabwata where she mobilized fellow women
            marketeers into organized protests groups for the NRAC which later
            became known as the African National Congress (ANC). She used her
            position in the market where she interacted with many women of all
            walks of life to effectively recruit them to join ANC and encourage
            them to attend rallies. She went around at night ringing a
            stone-filled tin as a call to upcoming political events rallies. She
            also took up a leading role in planning protest marches and
            organizing boycotts of shops that discriminated based on race. Julia
            Chikamoneka’s led protests had such profound effects and ultimately
            led to the independence of Zambia in 1964.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ObjectCards;
