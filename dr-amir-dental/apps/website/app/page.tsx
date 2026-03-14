import { HomeSection } from '../components/sections/HomeSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { AppointmentsSection } from '../components/sections/AppointmentsSection';
import { ReviewsSection } from '../components/sections/ReviewsSection';
import { BlogSection } from '../components/sections/BlogSection';
import { ContactSection } from '../components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <HomeSection />
      <AboutSection />
      <ServicesSection />
      <AppointmentsSection />
      <ReviewsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
