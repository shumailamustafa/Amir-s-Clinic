import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import { HomeSection } from '../components/sections/HomeSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { AppointmentsSection } from '../components/sections/AppointmentsSection';
import { ReviewsSection } from '../components/sections/ReviewsSection';
import { BlogSection } from '../components/sections/BlogSection';
import { ContactSection } from '../components/sections/ContactSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <HomeSection />
      <AboutSection />
      <ServicesSection />
      <AppointmentsSection />
      <ReviewsSection />
      <BlogSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
