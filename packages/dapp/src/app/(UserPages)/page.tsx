import TicketsList from "@/ComponentsToBeEdited/EventsSection";
import VirtualEventCard from "@/ComponentsToBeEdited/Exhibition";

import HeroTwo from "./UserPagecomponents/HeroTwo";

export default function Home() {
  return (
    <main className="space-y-10">
      <HeroTwo />
      <TicketsList />
      <VirtualEventCard />
    </main>
  );
}
