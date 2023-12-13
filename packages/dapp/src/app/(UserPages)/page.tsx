import VirtualEventCard from "@/app/(UserPages)/UserPagecomponents/Exhibition";
import AdminSignUpCard from "./UserPagecomponents/AdminSignUpCard";
import { getClient } from "@/lib/client";

import { gql } from "@apollo/client";
import HeroTwo from "./UserPagecomponents/HeroTwo";
import UpcomingMuseumExhibitions from "./UserPagecomponents/TicketList";
import UpcomingArtExhibitions from "./UserPagecomponents/UpcomingArtExhibitions";

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
    <main className="py-10 space-y-10">
      <HeroTwo />
      <UpcomingMuseumExhibitions />
      <UpcomingArtExhibitions/>
      <AdminSignUpCard />
      <VirtualEventCard />
    </main>
  );
}
