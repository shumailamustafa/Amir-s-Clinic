'use client';

import { useState, useEffect } from 'react';
import { subscribeToServices } from '@dental/firebase';
import type { Service } from '@dental/types';
import { useDevErrorStore } from '../stores/devErrorStore';
import { toast } from 'sonner';

export function useServices(visibleOnly = true) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addError = useDevErrorStore((s) => s.addError);

  useEffect(() => {
    const unsubscribe = subscribeToServices((data, subError) => {
      if (subError) {
        setError(subError);
        addError({
          message: subError,
          source: 'Firebase',
        });
      } else {
        setServices(data);
        setError(null);
      }
      setLoading(false);
    }, visibleOnly);

    return () => unsubscribe();
  }, [visibleOnly, addError]);

  return { services, loading, error };
}
