'use client';

import { useState, useEffect } from 'react';
import { getBookedSlots } from '@dental/firebase';

export function useAppointments(date: string) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!date) return;

    async function fetchBookedSlots() {
      setLoading(true);
      try {
        const slots = await getBookedSlots(date);
        setBookedSlots(slots);
        setError(null);
      } catch (err) {
        console.error('Error fetching booked slots:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch booked slots'));
      } finally {
        setLoading(false);
      }
    }

    fetchBookedSlots();
  }, [date]);

  return { bookedSlots, loading, error };
}
