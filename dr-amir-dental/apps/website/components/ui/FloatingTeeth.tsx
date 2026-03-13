'use client';

import React from 'react';

// SVG dental icons as inline components for zero external dependencies
const ToothIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4C24 4 18 8 16 16C14 24 12 32 16 40C20 48 22 56 24 60C26 62 28 60 28 56C28 48 30 40 32 36C34 40 36 48 36 56C36 60 38 62 40 60C42 56 44 48 48 40C52 32 50 24 48 16C46 8 40 4 32 4Z" />
  </svg>
);

const MolarIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8C14 8 10 14 10 22C10 30 12 36 16 44C18 50 20 56 22 58C24 60 26 58 26 54L28 40C28 38 30 38 30 40L30 46C30 48 32 48 32 46L32 40C32 38 34 38 34 40L36 54C36 58 38 60 40 58C42 56 44 50 46 44C50 36 52 30 52 22C52 14 48 8 42 8C38 8 36 12 32 12C28 12 26 8 20 8Z" />
  </svg>
);

const ToothbrushIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="28" y="4" width="8" height="32" rx="4" />
    <rect x="26" y="36" width="12" height="4" rx="2" />
    <rect x="24" y="40" width="16" height="20" rx="3" />
    <circle cx="28" cy="46" r="2" opacity="0.5" />
    <circle cx="36" cy="46" r="2" opacity="0.5" />
    <circle cx="28" cy="52" r="2" opacity="0.5" />
    <circle cx="36" cy="52" r="2" opacity="0.5" />
  </svg>
);

const MirrorIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="20" r="14" opacity="0.7" />
    <circle cx="32" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    <rect x="30" y="34" width="4" height="26" rx="2" />
  </svg>
);

const BracesIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="26" width="48" height="12" rx="6" opacity="0.6" />
    <rect x="14" y="28" width="8" height="8" rx="2" opacity="0.8" />
    <rect x="28" y="28" width="8" height="8" rx="2" opacity="0.8" />
    <rect x="42" y="28" width="8" height="8" rx="2" opacity="0.8" />
    <line x1="18" y1="32" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    <line x1="36" y1="32" x2="46" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
  </svg>
);

const DENTAL_ICONS = [ToothIcon, MolarIcon, ToothbrushIcon, MirrorIcon, BracesIcon];

interface FloatingItem {
  IconComponent: React.ComponentType<{ className?: string }>;
  style: React.CSSProperties;
  animationClass: string;
}

function generateFloatingItems(variant: number = 0): FloatingItem[] {
  // Each section variant gets a slightly different arrangement
  const positions = [
    { top: '5%', left: '8%', size: 28 },
    { top: '12%', right: '12%', size: 24 },
    { top: '35%', left: '3%', size: 32 },
    { top: '55%', right: '5%', size: 20 },
    { top: '70%', left: '10%', size: 26 },
    { top: '20%', right: '20%', size: 22 },
    { top: '85%', right: '15%', size: 30 },
    { top: '45%', left: '15%', size: 18 },
    { top: '65%', right: '25%', size: 24 },
    { top: '90%', left: '20%', size: 20 },
  ];

  return positions.map((pos, index) => {
    const iconIndex = (index + variant) % DENTAL_ICONS.length;
    const animations = ['animate-float', 'animate-float-slow', 'animate-float-reverse'];
    const animIndex = (index + variant) % animations.length;

    const { size, ...position } = pos;

    return {
      IconComponent: DENTAL_ICONS[iconIndex],
      style: {
        ...position,
        width: `${size}px`,
        height: `${size}px`,
        position: 'absolute' as const,
        animationDelay: `${(index * 0.8 + variant * 0.3).toFixed(1)}s`,
      },
      animationClass: animations[animIndex],
    };
  });
}

interface FloatingTeethProps {
  variant?: number;
  className?: string;
}

export function FloatingTeeth({ variant = 0, className = '' }: FloatingTeethProps) {
  const items = generateFloatingItems(variant);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={item.style}
          className={`text-[var(--color-primary)] opacity-[var(--floating-teeth-opacity)] ${item.animationClass}`}
        >
          <item.IconComponent className="w-full h-full" />
        </div>
      ))}
    </div>
  );
}
