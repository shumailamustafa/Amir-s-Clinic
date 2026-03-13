'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Smile,
  Sparkles,
  Shield,
  HeartPulse,
  Scissors,
  CheckCircle2,
  Clock,
  DollarSign,
  X,
  Award,
  Users,
  Zap,
  Heart,
} from 'lucide-react';
import { FloatingTeeth } from '../ui/FloatingTeeth';
import { Button } from '@dental/ui';

// Placeholder services — will come from Firestore
const servicesData = [
  {
    id: '1',
    name: 'Dental Implants',
    description: 'Permanent tooth replacement with titanium implants for a natural-looking smile.',
    icon: Stethoscope,
    procedureSteps: ['Initial consultation & X-ray', 'Implant placement surgery', 'Healing period (3-6 months)', 'Crown attachment'],
    estimatedTime: '3-6 months',
    priceMin: 50000,
    priceMax: 150000,
  },
  {
    id: '2',
    name: 'Root Canal Treatment',
    description: 'Save your natural tooth by removing infected pulp and sealing the canal.',
    icon: HeartPulse,
    procedureSteps: ['Diagnosis & X-ray', 'Local anesthesia', 'Pulp removal & canal shaping', 'Filling & crown placement'],
    estimatedTime: '1-2 visits',
    priceMin: 15000,
    priceMax: 40000,
  },
  {
    id: '3',
    name: 'Teeth Whitening',
    description: 'Professional whitening to brighten your smile by several shades.',
    icon: Sparkles,
    procedureSteps: ['Shade assessment', 'Teeth cleaning', 'Whitening gel application', 'LED light activation'],
    estimatedTime: '60-90 minutes',
    priceMin: 10000,
    priceMax: 25000,
  },
  {
    id: '4',
    name: 'Aesthetic Crowns',
    description: 'Custom-made porcelain crowns that match your natural teeth perfectly.',
    icon: Smile,
    procedureSteps: ['Tooth preparation', 'Impression taking', 'Temporary crown', 'Permanent crown fitting'],
    estimatedTime: '2-3 visits',
    priceMin: 20000,
    priceMax: 50000,
  },
  {
    id: '5',
    name: 'Orthodontics',
    description: 'Straighten your teeth with braces or clear aligners for a confident smile.',
    icon: Shield,
    procedureSteps: ['Consultation & scanning', 'Treatment plan design', 'Braces/aligner fitting', 'Regular adjustments'],
    estimatedTime: '12-24 months',
    priceMin: 80000,
    priceMax: 250000,
  },
  {
    id: '6',
    name: 'Scaling & Cleaning',
    description: 'Professional deep cleaning to remove tartar, plaque, and stains.',
    icon: Scissors,
    procedureSteps: ['Initial examination', 'Ultrasonic scaling', 'Hand scaling', 'Polishing & fluoride'],
    estimatedTime: '30-45 minutes',
    priceMin: 3000,
    priceMax: 8000,
  },
];

const whyChooseUs = [
  { icon: Award, title: 'Expert Care', desc: '15+ years of experience' },
  { icon: Zap, title: 'Modern Tech', desc: 'Latest dental equipment' },
  { icon: Heart, title: 'Gentle Touch', desc: 'Pain-free procedures' },
  { icon: Users, title: 'Happy Patients', desc: '10,000+ treated successfully' },
];

interface SelectedService {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  procedureSteps: string[];
  estimatedTime: string;
  priceMin: number;
  priceMax: number;
}

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);

  return (
    <section id="services" className="relative py-20 bg-[var(--color-surface)] overflow-hidden">
      <FloatingTeeth variant={2} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Our Services
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Comprehensive dental care for every need — from routine checkups to advanced procedures
          </p>
        </motion.div>

        {/* Services Grid — 3 columns, staggered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-[var(--color-bg)] rounded-2xl p-6 border border-[var(--color-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all cursor-pointer group"
              onClick={() => setSelectedService(service)}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-5 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                <service.icon className="w-7 h-7 text-[var(--color-primary)]" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* View Details */}
              <span className="text-sm font-semibold text-[var(--color-primary)] group-hover:underline">
                View Details →
              </span>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--color-bg)] rounded-2xl p-8 border border-[var(--color-border)]"
        >
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)] text-center mb-8">
            Why Choose Us
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <p className="font-semibold text-[var(--color-text-primary)] text-sm">{item.title}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm"
              onClick={() => setSelectedService(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Panel (slides from right) */}
            <motion.div
              className="relative w-full max-w-lg h-full bg-[var(--color-bg)] shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                {/* Service icon + title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <selectedService.icon className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                      {selectedService.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                  {selectedService.description}
                </p>

                {/* Procedure Steps */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
                    Procedure Steps
                  </h4>
                  <div className="space-y-3">
                    {selectedService.procedureSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[var(--color-status-open)] shrink-0 mt-0.5" />
                        <span className="text-[var(--color-text-primary)] text-sm">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Time & Price */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[var(--color-surface)] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">Duration</span>
                    </div>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">
                      {selectedService.estimatedTime}
                    </p>
                  </div>
                  <div className="bg-[var(--color-surface)] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium">Price Range</span>
                    </div>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">
                      Rs. {selectedService.priceMin.toLocaleString()} - {selectedService.priceMax.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Before/After Placeholder */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
                    Before & After
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-[var(--color-surface)] rounded-xl flex items-center justify-center border border-[var(--color-border)]">
                      <span className="text-xs text-[var(--color-text-secondary)]">Before</span>
                    </div>
                    <div className="aspect-square bg-[var(--color-surface)] rounded-xl flex items-center justify-center border border-[var(--color-border)]">
                      <span className="text-xs text-[var(--color-text-secondary)]">After</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setSelectedService(null);
                    document.getElementById('appointments')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Book This Service
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
