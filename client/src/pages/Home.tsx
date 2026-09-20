/**
 * DPM Marigot – Home Page
 * Design: "Chantier Propre" – Industrial Precision
 * Sections: Navbar → Hero → Testimonials → Services → Gallery → Process → WhyUs
 *           → RelaisColis → Partenaires → Contact → Map → FAQ → Footer
 * + FloatingCTA (mobile bottom bar + WhatsApp)
 *
 * 2026-09-21 : RelaisColisBand s'intercale entre le showroom et les partenaires.
 * L'affiche du client (assets/partenaires et services.png) a deux colonnes,
 * « Nos Partenaires » et « Nos Services » ; le site ne portait que la première.
 * Les deux barres étiquetées se suivent maintenant, après la section qui parle
 * du lieu — on vient au showroom, on y trouve les collections ET son colis, et
 * l'argument assurance tombe juste avant la demande de devis, comme avant.
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ServicesSection from "@/components/ServicesSection";
import RealisationsGallery from "@/components/RealisationsGallery";
import ProcessSection from "@/components/ProcessSection";
import WhyUsSection from "@/components/WhyUsSection";
import RelaisColisBand from "@/components/RelaisColisBand";
import PartenairesBand from "@/components/PartenairesBand";
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
      <RelaisColisBand />
      <PartenairesBand />
      <ContactSection />
      <MapSection />
      <FAQSection />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
