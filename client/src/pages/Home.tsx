/**
 * DPM Marigot – Home Page
 * Design: "Chantier Propre" – Industrial Precision
 * Sections: Navbar → Hero → Testimonials → Services → Gallery → Process → WhyUs → Contact → Map → FAQ → Footer
 * + FloatingCTA (mobile bottom bar + WhatsApp)
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ServicesSection from "@/components/ServicesSection";
import RealisationsGallery from "@/components/RealisationsGallery";
import ProcessSection from "@/components/ProcessSection";
import WhyUsSection from "@/components/WhyUsSection";
import ContactSection from "@/components/ContactSection";
import MapSection from "@/components/MapSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TestimonialsSection />
      <ServicesSection />
      <RealisationsGallery />
      <ProcessSection />
      <WhyUsSection />
      <ContactSection />
      <MapSection />
      <FAQSection />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
