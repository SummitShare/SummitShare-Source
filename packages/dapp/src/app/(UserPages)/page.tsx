import VirtualEventCard from "@/app/(UserPages)/UserPagecomponents/Exhibition";
import AdminSignUpCard from "./UserPagecomponents/AdminSignUpCard";

import ContactUs from "./UserPagecomponents/ContactUsEmail";
import Footer from "./UserPagecomponents/Footer";
import HelpCardList from "./UserPagecomponents/HelpCardList";

import TicketsList from "./UserPagecomponents/TicketList";


import { getClient } from "@/lib/client";

import { gql } from "@apollo/client";
import HeroTwo from "./UserPagecomponents/HeroTwo";

export const revalidate = 0;
const query = gql`
  query {
    exhibitCreateds(where: { name_contains: "Women’s"}) {
      name
      location
      details
      collection {
        id
        baseURI
        name
        symbol
        totalMinted
      }
    }
  }
`;

export default async function Home() {
  const client = getClient();
  const { data } = await client.query({ query });


  return (
    <main className="pt-4 space-y-20">
      <HeroTwo />
      <TicketsList />
      <HelpCardList />
      <VirtualEventCard />
      <AdminSignUpCard />
      <Footer />
    </main>
  );
}
