import VirtualEventCard from "@/app/(UserPages)/UserPagecomponents/Exhibition";
import AdminSignUpCard from "./UserPagecomponents/AdminSignUpCard";

import ContactUs from "./UserPagecomponents/ContactUsEmail";
import Footer from "./UserPagecomponents/Footer";
import HelpCardList from "./UserPagecomponents/HelpCardList";
import HeroTwo from "./UserPagecomponents/HeroTwo";
import TicketsList from "./UserPagecomponents/TicketList";

export default function Home() {
  return (
    <main className="pt-10 space-y-20">
      <HeroTwo />
      <TicketsList />
      <HelpCardList />
      <VirtualEventCard />
      <AdminSignUpCard />
      <Footer />
    </main>
  );
}
