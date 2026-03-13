'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useClinicStatus } from '../../hooks/useClinicStatus';

export function WhatsAppButton() {
  const { config } = useClinicStatus();
  const whatsappNumber = config?.whatsapp?.replace(/[^0-9]/g, '') || '923001234567';
  const message = encodeURIComponent(
    'Hello! I would like to book an appointment at Dr. Amir Dental Care.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
    >
      {/* Tooltip */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-white dark:bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm font-medium px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with us!
      </span>

      {/* Pulsing ring */}
      <span className="absolute inset-0 rounded-full bg-[var(--color-whatsapp-green)] animate-ping opacity-20" />

      {/* Button */}
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-whatsapp-green)] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce-subtle">
        <MessageCircle className="w-7 h-7" />
      </span>
    </motion.a>
  );
}
