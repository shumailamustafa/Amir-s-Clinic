'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { Button } from '@dental/ui';
import { OpenClosedBadge } from '../ui/OpenClosedBadge';
import { FloatingTeeth } from '../ui/FloatingTeeth';

import { useClinicStatus } from '../../hooks/useClinicStatus';
import { isClinicOpen } from '@dental/utils';

export function HomeSection() {
  const { config, loading } = useClinicStatus();

  // Determine status from real-time config
  const clinicStatus = config 
    ? isClinicOpen(config.openHours, config.holidayDates, config.holidayMode)
    : { isOpen: true, statusText: 'Loading clinic status...' };

  const scrollToAppointments = () => {
    const el = document.getElementById('appointments');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          />
        </motion.div>

        {/* Animated Clinic Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-[var(--color-primary)]">Dr. Amir</span>
          <br />
          <span className="text-[var(--color-text-primary)]">Dental Care</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Trusted Dentistry for a{' '}
          <span className="text-[var(--color-primary)] font-semibold">
            Lifetime of Smiles
          </span>
        </motion.p>

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
