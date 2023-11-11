import VirtualEventCard from "@/app/(UserPages)/UserPagecomponents/Exhibition";
import HeroTwo from "./UserPagecomponents/HeroTwo";
import TicketsList from "./UserPagecomponents/TicketList";

export default function Home() {
  return (
    <main className="space-y-10">
      <HeroTwo />
      <TicketsList />
      <VirtualEventCard />
    </main>
  );
}
