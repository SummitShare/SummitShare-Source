import Events from "./UserPagecomponents/Events";
import Hero from "./UserPagecomponents/Hero";
import Tourism from "./UserPagecomponents/TourismSection";
import VirtualMuseum from "./UserPagecomponents/VirtualEvents";

export default function Home() {
  return (
    <main className="space-y-10">
      <Hero />
      <Events />
      <Tourism />
      <VirtualMuseum />
    </main>
  );
}
