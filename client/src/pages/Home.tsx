/**
 * DPM Marigot – Home Page
 * Design: "Chantier Propre" – Industrial Precision
 * Sections: Navbar → Hero → Testimonials → Services → Gallery → Process → WhyUs
 *           (+ bandeau partenaires en pied) → Map → Contact → FAQ → Footer
 * + FloatingCTA (mobile bottom bar + WhatsApp)
 *
 * 2026-09-21 : le point relais colis, deuxième colonne de l'affiche fournie par
 * le client, entre dans la page. Il a d'abord été un bandeau pleine largeur
 * entre le showroom et les partenaires ; écarté le jour même par Silva, il est
 * devenu une carte incrustée à cheval entre la bannière et les avis.
 * Elle n'apparaît pas dans cette liste parce qu'elle n'est pas une section :
 * elle est rendue par TestimonialsSection, qui lui sert d'ancrage — la bannière
 * porte `overflow-hidden` et l'aurait rognée. Voir PointRelaisCard.tsx.
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
      <MapSection />
      <ContactSection />
      <FAQSection />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
