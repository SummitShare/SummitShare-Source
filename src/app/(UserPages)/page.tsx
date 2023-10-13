import Events from "../UserPagesComponents/Events";
import Hero from "../UserPagesComponents/Hero";
import Tourism from "../UserPagesComponents/TourismSection";
import VirtualMuseum from "../UserPagesComponents/VirtualEvents";

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
