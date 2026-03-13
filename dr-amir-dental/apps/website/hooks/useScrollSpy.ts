'use client';

import { useEffect, useState } from 'react';

const SECTIONS = [
  'home',
  'about',
  'services',
  'appointments',
  'reviews',
  'blog',
  'contact',
] as const;

export type SectionId = (typeof SECTIONS)[number];

export function useScrollSpy(): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: '-20% 0px -70% 0px',
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return activeSection;
}

export { SECTIONS };
