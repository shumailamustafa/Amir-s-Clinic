'use client';

import { useState, useEffect } from 'react';
import { subscribeToServices } from '@dental/firebase';
import type { Service } from '@dental/types';

export function useServices(visibleOnly = true) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToServices((data) => {
        setServices(data);
        setLoading(false);
      }, visibleOnly);

      return () => unsubscribe();
    } catch (err) {
      console.error('Error subscribing to services:', err);
      setError(err instanceof Error ? err : new Error('Failed to subscribe to services'));
      setLoading(false);
    }
  }, [visibleOnly]);

  return { services, loading, error };
}
