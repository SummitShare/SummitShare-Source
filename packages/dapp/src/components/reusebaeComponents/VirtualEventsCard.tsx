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
      <div className="absolute inset-x-0 bottom-2 flex flex-col justify-center text-sm p-2 font-semibold space-y-2">
        <p className="text-white">{event.name}</p>
        <div className=" font-normal  text-xs  text-green-700 bg-green-50 rounded-full px-2 py-1 w-fit ">
          {event.price}
        </div>
      </div>
    </Link>
  );
};
export default VirtualEventsCard;
