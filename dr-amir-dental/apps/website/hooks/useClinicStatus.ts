'use client';

import { useState, useEffect } from 'react';
import { subscribeToClinicConfig } from '@dental/firebase';
import type { ClinicConfig } from '@dental/types';

export function useClinicStatus() {
  const [config, setConfig] = useState<ClinicConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToClinicConfig((data) => {
        setConfig(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error subscribing to clinic config:', err);
      setError(err instanceof Error ? err : new Error('Failed to subscribe to clinic config'));
      setLoading(false);
    }
  }, []);

  return { config, loading, error };
}
