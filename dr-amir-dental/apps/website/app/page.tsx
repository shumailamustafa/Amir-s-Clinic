import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { FloatingTeeth } from '../components/ui/FloatingTeeth';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      {/* Home Section */}
      <SectionWrapper id="home" fullHeight>
        <FloatingTeeth variant={0} />
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-primary)] mb-4">
              Dr. Amir Dental Care
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-8">
              Trusted Dentistry for a Lifetime of Smiles
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Full hero section coming in Phase 4
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* About Section */}
      <SectionWrapper id="about" className="py-20 px-4">
        <FloatingTeeth variant={1} />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">About</h2>
          <p className="text-[var(--color-text-secondary)]">Coming in Phase 4</p>
        </div>
      </SectionWrapper>

      {/* Services Section */}
      <SectionWrapper id="services" className="py-20 px-4 bg-[var(--color-surface)]">
        <FloatingTeeth variant={2} />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Services</h2>
          <p className="text-[var(--color-text-secondary)]">Coming in Phase 4</p>
        </div>
      </SectionWrapper>

      {/* Appointments Section */}
      <SectionWrapper id="appointments" className="py-20 px-4">
        <FloatingTeeth variant={3} />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Appointments</h2>
          <p className="text-[var(--color-text-secondary)]">Coming in Phase 4</p>
        </div>
      </SectionWrapper>

      {/* Reviews Section */}
      <SectionWrapper id="reviews" className="py-20 px-4 bg-[var(--color-surface)]">
        <FloatingTeeth variant={4} />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Reviews</h2>
          <p className="text-[var(--color-text-secondary)]">Coming in Phase 4</p>
        </div>
      </SectionWrapper>

      {/* Blog Section */}
      <SectionWrapper id="blog" className="py-20 px-4">
        <FloatingTeeth variant={5} />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Blog</h2>
          <p className="text-[var(--color-text-secondary)]">Coming in Phase 4</p>
        </div>
      </SectionWrapper>

      {/* Contact Section */}
      <SectionWrapper id="contact" className="py-20 px-4 bg-[var(--color-surface)]">
        <FloatingTeeth variant={6} />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Contact</h2>
          <p className="text-[var(--color-text-secondary)]">Coming in Phase 4</p>
        </div>
      </SectionWrapper>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
