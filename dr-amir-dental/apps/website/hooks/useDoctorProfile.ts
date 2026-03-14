'use client';

import { useState, useEffect } from 'react';
import { subscribeToDoctorProfile } from '@dental/firebase';
import type { DoctorProfile } from '@dental/types';

export function useDoctorProfile() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToDoctorProfile((data, subError) => {
      if (subError) {
        setError(new Error(subError));
      } else {
        setProfile(data);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { profile, loading, error };
}
