import Navbar from "../components/portfolio/Navbar";
import HeroSection from "../components/portfolio/HeroSection";
import StatsBar from "../components/portfolio/StatsBar";
import AboutSection from "../components/portfolio/AboutSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import ExperienceSection from "../components/portfolio/ExperienceSection";
import TestimonialsSection from "../components/portfolio/TestimonialsSection";
import ContactSection from "../components/portfolio/ContactSection";
import Footer from "../components/portfolio/Footer";
import { LanguageProvider } from "@/lib/LanguageContext";

export default function Portfolio() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background text-foreground font-inter">
        <Navbar />
        <HeroSection />
        <StatsBar />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </div>
    </LanguageProvider>
  );
}