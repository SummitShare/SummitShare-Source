import SignIn from "@/MainComponents/signIn";
import SignUp from "@/MainComponents/signUp";
import { ChartBarIcon, TicketIcon, TvIcon } from "@heroicons/react/24/outline";

function page() {
  return (
    <div className="flex flex-col gap-10 lg:flex-row md:flex-row mt-60 items-center">
      <div className="space-y-5 text-orange-950  lg:text-xl lg:border-r w-fit  p-5">
        <div className="flex gap-5 items-center ">
          <TicketIcon className="w-10 h-10 text-orange-500 " />
          <p>Buy tickets to upcoming Events</p>
        </div>
        <div className="flex gap-5 items-center ">
          <TvIcon className="w-10 h-10 text-orange-500 " />
          <p>Visit our Virtual Museums and art Galleys</p>
        </div>
        <div className="flex gap-5 items-center ">
          <ChartBarIcon className="w-10 h-10 text-orange-500 " />
          <p>Create and Mange your events</p>
        </div>
      </div>
      <SignIn />
    </div>
  );
}

export default page;
