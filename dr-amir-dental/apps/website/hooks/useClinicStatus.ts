'use client';

import { useState, useEffect } from 'react';
import { subscribeToClinicConfig } from '@dental/firebase';
import type { ClinicConfig } from '@dental/types';

export function useClinicStatus() {
  const [config, setConfig] = useState<ClinicConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToClinicConfig((data, subError) => {
      if (subError) {
        setError(new Error(subError));
      } else {
        setConfig(data);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { config, loading, error };
}
