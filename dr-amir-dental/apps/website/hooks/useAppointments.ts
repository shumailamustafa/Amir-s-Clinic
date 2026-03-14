'use client';

import { useState, useEffect } from 'react';
import { getBookedSlots } from '@dental/firebase';
import { toast } from 'sonner';
import { useDevErrorStore } from '../stores/devErrorStore';

export function useAppointments(date: string) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addError = useDevErrorStore((s) => s.addError);

  useEffect(() => {
    if (!date) return;

    async function fetchBookedSlots() {
      setLoading(true);
      setError(null);
      const { data, error: firebaseError } = await getBookedSlots(date);
      
      if (firebaseError) {
        setError(firebaseError);
        addError({
          source: 'API',
          message: firebaseError,
        });
        toast.error('Failed to load slots', { description: firebaseError });
      } else {
        setBookedSlots(data || []);
      }
      setLoading(false);
    }

    fetchBookedSlots();
  }, [date, addError]);

  return { bookedSlots, loading, error };
}
