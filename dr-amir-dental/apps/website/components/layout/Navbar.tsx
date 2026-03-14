'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, Phone } from 'lucide-react';
import { useScrollSpy, SECTIONS, type SectionId } from '../../hooks/useScrollSpy';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useClinicStatus } from '../../hooks/useClinicStatus';

const NAV_LABELS: Record<SectionId, string> = {
  home: 'Home',
  about: 'About',
  services: 'Services',
  appointments: 'Appointments',
  reviews: 'Reviews',
  blog: 'Blog',
  contact: 'Contact',
};

export function Navbar() {
  const activeSection = useScrollSpy();
  const { config } = useClinicStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const phone = config?.phone || '0300-1234567';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: SectionId) => {
    // If mobile menu is open, handle closing and scrolling differently
    if (isMobileMenuOpen) {
      // Small delay to allow menu closing animation to start/finish
      // or at least not block the scroll compute
      setIsMobileMenuOpen(false);
      
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // Wait for menu close animation roughly
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // navbar height
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--color-nav-bg)]/95 backdrop-blur-md shadow-lg border-b border-[var(--color-border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              Dr. Amir
            </span>
            <span className="text-sm font-medium text-[var(--color-text-secondary)] hidden sm:block">
              Dental Care
            </span>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {SECTIONS.map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="relative px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
              >
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    activeSection === id
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {NAV_LABELS[id]}
                </span>
                {activeSection === id && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--color-primary)] rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Side: Phone + Theme Toggle + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Phone number (desktop only) */}
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="hidden xl:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-full hover:bg-[var(--color-primary)]/20 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>

            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[var(--color-nav-bg)] border-t border-[var(--color-border)] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {SECTIONS.map((id, index) => (
                <motion.button
                  key={id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                    activeSection === id
                      ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  {NAV_LABELS[id]}
                </motion.button>
              ))}

              {/* Mobile phone link */}
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 px-4 py-3 text-base font-medium text-[var(--color-primary)]"
              >
                <Phone className="w-5 h-5" />
                <span>{phone}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
