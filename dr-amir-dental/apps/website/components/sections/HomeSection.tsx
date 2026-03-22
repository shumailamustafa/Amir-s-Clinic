'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { Button } from '@dental/ui';
import { OpenClosedBadge } from '../ui/OpenClosedBadge';
import { FloatingTeeth } from '../ui/FloatingTeeth';

import { useClinicStatus } from '../../hooks/useClinicStatus';
import { isClinicOpen } from '@dental/utils';

export function HomeSection() {
  const { config, loading } = useClinicStatus();

  // Auto-seed if config is missing
  useEffect(() => {
    if (!loading && !config) {
      console.log('Clinic config missing, attempting to seed...');
      // Dynamic import to avoid circular dependencies or heavy initial load
      import('@dental/firebase').then(({ seedClinicConfig }) => {
        seedClinicConfig().catch(err => console.error('Failed to seed:', err));
      }).catch(err => console.error('Failed to load firebase module:', err));
    }
  }, [loading, config]);

  // Determine status from real-time config
  const clinicStatus = config
    ? isClinicOpen(config.openHours, config.holidayDates, config.holidayMode, config.emergencyMessage)
    : { isOpen: false, statusText: 'Status unavailable' };

  const scrollToAppointments = () => {
    const el = document.getElementById('appointments');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const phrases = [
    'Lifetime of Smiles',
    'Healthy, Brighter Teeth',
    'Confidence in Every Smile',
    'Modern Dental Wellness'
  ];
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [phrases.length]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-surface)]"
    >
      {/* Floating dental background */}
      <FloatingTeeth variant={0} />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-bg)]/80 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        {/* Open/Closed Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <OpenClosedBadge
            isOpen={clinicStatus.isOpen}
            statusText={clinicStatus.statusText}
            loading={loading}
          />
        </motion.div>

        {/* Animated Clinic Name */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-[var(--color-primary)]">Dr. Aamir Mustafa</span>
          <br />
          <span className="text-[var(--color-text-primary)]">Dental Care</span>
        </motion.h1>

        {/* Tagline */}
        <div className="text-base sm:text-xl md:text-2xl text-[var(--color-text-secondary)] mb-10 max-w-4xl mx-auto leading-relaxed flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4">
          <span className="whitespace-nowrap">Trusted Dentistry for a</span>
          <div className="relative inline-flex min-w-[200px] sm:min-w-[300px] h-[1.2em] items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentPhrase}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-[var(--color-primary)] font-bold whitespace-nowrap absolute left-0"
              >
                {phrases[currentPhrase]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Button
            size="lg"
            onClick={scrollToAppointments}
            className="group text-lg px-10 py-4 shadow-lg hover:shadow-xl"
          >
            <CalendarDays className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Book an Appointment
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[var(--color-text-secondary)]"
          >
            <ChevronDown className="w-6 h-6 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
