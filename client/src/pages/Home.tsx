/**
 * DPM Marigot – Home Page
 * Design: "Chantier Propre" – Industrial Precision
 * Sections: Navbar → Hero (+ point relais) → Services → Gallery → WhyUs
 *           (+ bandeau partenaires en pied) → Map → Contact → Testimonials → FAQ → Footer
 * + FloatingCTA (barre « Appeler » sous 1024 px)
 *
 * 2026-10-14, notes du RDV DPM : les avis passent sous le formulaire de devis,
 * la section « en trois étapes » (ProcessSection) est retirée — fichier rangé
 * dans _to_delete/process-3-etapes-2026-10-14/ — et le point relais colis quitte
 * la section des avis pour la bannière, à la place des deux photos.
 *
 * 2026-09-21 : le point relais colis, deuxième colonne de l'affiche fournie par
 * le client, entre dans la page. Il a d'abord été un bandeau pleine largeur
 * entre le showroom et les partenaires ; écarté le jour même par Silva, il est
 * devenu une carte incrustée à cheval entre la bannière et les avis.
 * (Jusqu'au 14/10/2026 elle était rendue par TestimonialsSection ; elle est
 * maintenant dans HeroSection.)
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ServicesSection from "@/components/ServicesSection";
import RealisationsGallery from "@/components/RealisationsGallery";
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
      <ServicesSection />
      <RealisationsGallery />
      <WhyUsSection />
      <MapSection />
      <ContactSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
