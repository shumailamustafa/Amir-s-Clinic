'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  Award,
  Languages,
  MapPin,
  Clock,
  Image as ImageIcon,
} from 'lucide-react';
import { FloatingTeeth } from '../ui/FloatingTeeth';
import { childVariants } from '../ui/SectionWrapper';

type SubTab = 'doctor' | 'clinic';

// Placeholder data — will come from Firestore later
const doctorData = {
  name: 'Dr. Amir',
  title: 'BDS, FCPS — Dental Surgeon',
  bio: 'With over 15 years of experience in modern dentistry, Dr. Amir is dedicated to providing the highest quality dental care using state-of-the-art technology and techniques.',
  profileImageUrl: '',
  education: [
    { institution: 'King Edward Medical University', degree: 'BDS', year: '2005' },
    { institution: 'College of Physicians & Surgeons Pakistan', degree: 'FCPS Operative Dentistry', year: '2010' },
    { institution: 'Royal College of Surgeons', degree: 'Advanced Implantology', year: '2015' },
  ],
  experience: [
    { place: 'Mayo Hospital Lahore', role: 'Dental Surgeon', duration: '2005-2010' },
    { place: 'Private Practice', role: 'Clinic Director', duration: '2010-Present' },
  ],
  skills: [
    { name: 'Dental Implants', percentage: 95 },
    { name: 'Root Canal Treatment', percentage: 98 },
    { name: 'Cosmetic Dentistry', percentage: 90 },
    { name: 'Orthodontics', percentage: 85 },
    { name: 'Oral Surgery', percentage: 92 },
  ],
  achievements: [
    { title: '10,000+ Patients', icon: '👥' },
    { title: '15+ Years', icon: '📅' },
    { title: 'Best Dentist 2023', icon: '🏆' },
    { title: '4.8 Rating', icon: '⭐' },
  ],
  languages: ['English', 'Urdu', 'Punjabi'],
};

const clinicData = {
  gallery: ['/clinic-1.jpg', '/clinic-2.jpg', '/clinic-3.jpg', '/clinic-4.jpg'],
  address: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
  mapCoordinates: { lat: 31.5204, lng: 74.3587 },
  workingHours: {
    monday: { open: '10:00', close: '20:00', isOpen: true },
    tuesday: { open: '10:00', close: '20:00', isOpen: true },
    wednesday: { open: '10:00', close: '20:00', isOpen: true },
    thursday: { open: '10:00', close: '20:00', isOpen: true },
    friday: { open: '10:00', close: '20:00', isOpen: true },
    saturday: { open: '10:00', close: '16:00', isOpen: true },
    sunday: { open: '', close: '', isOpen: false },
  },
};

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<SubTab>('doctor');

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <FloatingTeeth variant={1} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            About Us
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Meet the doctor behind the smiles and explore our modern clinic
          </p>
        </motion.div>

        {/* Sub-Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-[var(--color-surface)] rounded-xl p-1.5">
            {(['doctor', 'clinic'] as SubTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="about-tab-indicator"
                    className="absolute inset-0 bg-[var(--color-primary)] rounded-lg"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === 'doctor' ? 'About Doctor' : 'About Clinic'}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'doctor' ? (
            <motion.div
              key="doctor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DoctorTab />
            </motion.div>
          ) : (
            <motion.div
              key="clinic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ClinicTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function DoctorTab() {
  return (
    <div className="space-y-16">
      {/* Doctor Profile Header */}
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Profile Photo */}
        <motion.div
          variants={childVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="shrink-0"
        >
          <div className="w-48 h-48 rounded-full border-4 border-[var(--color-primary)] p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary)]">
              <span className="text-6xl">👨‍⚕️</span>
            </div>
          </div>
        </motion.div>

        {/* Doctor Info */}
        <motion.div
          variants={childVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center lg:text-left"
        >
          <h3 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            {doctorData.name}
          </h3>
          <p className="text-[var(--color-primary)] font-semibold mb-4">
            {doctorData.title}
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
            {doctorData.bio}
          </p>
        </motion.div>
      </div>

      {/* Education Timeline */}
      <motion.div
        variants={childVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[var(--color-primary)]" />
          Education
        </h4>
        <div className="relative pl-8 border-l-2 border-[var(--color-primary)]/30 space-y-8">
          {doctorData.education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-bg)]" />
              <div className="bg-[var(--color-surface)] rounded-xl p-4">
                <p className="text-sm text-[var(--color-primary)] font-semibold">{edu.year}</p>
                <p className="font-bold text-[var(--color-text-primary)]">{edu.degree}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{edu.institution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Skills Progress Bars */}
      <motion.div
        variants={childVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-[var(--color-primary)]" />
          Expertise
        </h4>
        <div className="space-y-5 max-w-xl">
          {doctorData.skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {skill.name}
                </span>
                <span className="text-sm font-semibold text-[var(--color-primary)]">
                  {skill.percentage}%
                </span>
              </div>
              <div className="h-2.5 bg-[var(--color-surface)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-button-hover)] rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.15, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Experience & Achievements Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Experience */}
        <motion.div
          variants={childVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[var(--color-primary)]" />
            Experience
          </h4>
          <div className="space-y-4">
            {doctorData.experience.map((exp, index) => (
              <div
                key={index}
                className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]"
              >
                <p className="font-bold text-[var(--color-text-primary)]">{exp.role}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{exp.place}</p>
                <p className="text-xs text-[var(--color-primary)] mt-1">{exp.duration}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          variants={childVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--color-primary)]" />
            Achievements
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {doctorData.achievements.map((ach, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--color-surface)] rounded-xl p-4 text-center border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors"
              >
                <span className="text-2xl block mb-2">{ach.icon}</span>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{ach.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Languages */}
      <motion.div
        variants={childVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <Languages className="w-5 h-5 text-[var(--color-primary)]" />
          Languages
        </h4>
        <div className="flex gap-3">
          {doctorData.languages.map((lang) => (
            <span
              key={lang}
              className="px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm font-medium"
            >
              {lang}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ClinicTab() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  return (
    <div className="space-y-16">
      {/* Gallery */}
      <motion.div
        variants={childVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[var(--color-primary)]" />
          Our Clinic
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {clinicData.gallery.map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="aspect-square bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary)]/50 transition-all cursor-pointer hover:shadow-lg overflow-hidden"
            >
              <span className="text-[var(--color-text-secondary)] text-sm">Clinic Photo {index + 1}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Address + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          variants={childVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
            Location
          </h4>
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <p className="text-[var(--color-text-primary)] font-medium mb-4">
              {clinicData.address}
            </p>
            {/* Google Maps Embed Placeholder */}
            <div className="aspect-video bg-[var(--color-border)] rounded-lg flex items-center justify-center">
              <span className="text-[var(--color-text-secondary)] text-sm">
                Google Maps (requires API key)
              </span>
            </div>
          </div>
        </motion.div>

        {/* Working Hours (admin-controlled) */}
        <motion.div
          variants={childVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-primary)]" />
            Working Hours
          </h4>
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full">
              <tbody>
                {days.map((day, index) => {
                  const hours = clinicData.workingHours[day];
                  return (
                    <motion.tr
                      key={day}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-[var(--color-border)] last:border-0"
                    >
                      <td className="px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] capitalize">
                        {day}
                      </td>
                      <td className="px-6 py-3 text-sm text-right">
                        {hours.isOpen ? (
                          <span className="text-[var(--color-status-open)] font-medium">
                            {hours.open} - {hours.close}
                          </span>
                        ) : (
                          <span className="text-[var(--color-status-closed)] font-medium">
                            Closed
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
