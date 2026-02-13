import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedListings from "@/components/FeaturedListings";
import MapSection from "@/components/MapSection";
import TeamSection from "@/components/TeamSection";
import ValueHomeSection from "@/components/ValueHomeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import StickyContact from "@/components/StickyContact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="min-h-screen">
        <HeroSection />
        <FeaturedListings />
        <MapSection />
        <TeamSection />
        <TeamSection />
        <TestimonialsSection />
        <ValueHomeSection />
        <StickyContact />
      </div>
    </div>
  );
};

export default Index;
