import { ExhibitionData } from "@/app/(UserPages)/UserPagecomponents/Exhibition";
import { ClockIcon, MapIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface VirtualEventCardProps {
  event: ExhibitionData;
}
const VirtualEventsCard: React.FC<VirtualEventCardProps> = ({ event }) => {
  return (
    <Link
      href={""}
      className="relative w-[200px] h-[200px] rounded-xl flex flex-col gap-2 shadow-md cursor-pointer group"
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
      <Image
        width={100}
        height={100}
        src={event.image}
        alt=""
        className="w-full h-full rounded-xl object-cover"
      />
      <div className="absolute inset-x-0 bottom-2 flex flex-col justify-center body-text-h5  p-2 space-y-2">
        <p className="text-white text-sm font-semibold ">{event.name}</p>
        <div className="flex flex-row gap-2">
          <button
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-xs h-fit w-fit rounded-xl px-3 py-1 text-white font-normal "
            type="button"
          >
            Buy
          </button>
          <div className=" flex items-center justify-center font-normal  text-xs  text-orange-950 bg-orange-50 rounded-full px-2 py-1 w-fit ">
            {event.price}
          </div>
        </div>
      </div>
    </Link>
  );
};
export default VirtualEventsCard;
