'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
];

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Appointments', href: '#appointments' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-footer-bg)] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 — Clinic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4">
              Dr. Amir Dental Care
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Trusted Dentistry for a Lifetime of Smiles. Providing quality
              dental care with modern techniques and a gentle touch.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+923001234567"
                className="flex items-center gap-3 text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>0300-1234567</span>
              </a>
              <a
                href="mailto:info@dramirdental.com"
                className="flex items-center gap-3 text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>info@dramirdental.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Main Boulevard, Gulberg III, Lahore, Pakistan</span>
              </div>
            </div>
          </motion.div>

          {/* Column 2 — Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 — Hours & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Working Hours</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Mon - Fri: 10:00 AM - 8:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Sat: 10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Sun: Closed</span>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-white mb-3">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Dr. Amir Dental Care. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="/privacy-policy"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-of-service"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
