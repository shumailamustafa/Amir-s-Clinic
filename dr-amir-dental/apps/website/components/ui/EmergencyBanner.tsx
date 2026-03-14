'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { subscribeToClinicConfig } from '@dental/firebase';
import { useEffect, useState } from 'react';
import type { ClinicConfig } from '@dental/types';

export function EmergencyBanner() {
  const [config, setConfig] = useState<ClinicConfig | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToClinicConfig((data, error) => {
      if (!error && data) {
        setConfig(data);
      }
    });
    return unsubscribe;
  }, []);

  if (!config || !config.holidayMode || !config.emergencyMessage || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative bg-red-600 text-white z-[60]"
      >
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold sm:text-base leading-tight">
              {config.emergencyMessage}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
