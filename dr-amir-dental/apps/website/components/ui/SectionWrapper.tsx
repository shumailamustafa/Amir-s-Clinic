'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

export const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function SectionWrapper({
  id,
  children,
  className = '',
  fullHeight = false,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      className={`relative ${fullHeight ? 'min-h-screen' : ''} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={sectionVariants}
    >
      {children}
    </motion.section>
  );
}
