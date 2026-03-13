'use client';

import { useState, useEffect } from 'react';
import { subscribeToDoctorProfile } from '@dental/firebase';
import type { DoctorProfile } from '@dental/types';

export function useDoctorProfile() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToDoctorProfile((data) => {
        setProfile(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error subscribing to doctor profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to subscribe'));
      setLoading(false);
    }
  }, []);

  return { profile, loading, error };
}
