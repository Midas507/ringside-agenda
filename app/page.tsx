import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedShows from "@/components/FeaturedShows";
import ProchainShows from "@/components/ProchainShows";
import MapSection from "@/components/MapSection";
import FederationsSection from "@/components/FederationsSection";
import PromoteurSection from "@/components/PromoteurSection";
import CommunauteSection from "@/components/CommunauteSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <div className="relative">
        <Header />
        <Hero />
        <FeaturedShows />
      </div>
      <ProchainShows />
      <MapSection />
      <FederationsSection />
      <PromoteurSection />
      <CommunauteSection />
      <Footer />
    </main>
  );
}
