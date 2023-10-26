import { ClockIcon, MapIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function VirtualEventsCard() {
  return (
    <div className="flex flex-row gap-2">
      <div className=" relative bg-slate-950/10 w-[200px] h-[200px] rounded-xl flex flex-col gap-2 shadow-md ">
        <div className=" absolute inset-x-0 bottom-2 flex flex-col  justify-center text-sm text-slate-50 p-2 font-semibold">
          <p>womens history museum</p>
          <p>ETH:000.3234</p>
        </div>
      </div>
    </div>
  );
}
