'use client';

import { useState, useEffect } from 'react';
import { subscribeToReviews } from '@dental/firebase';
import type { Review } from '@dental/types';

export function useReviews(approvedOnly = true) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToReviews((data) => {
        setReviews(data);
        setLoading(false);
      }, approvedOnly ? 'approved' : undefined);

      return () => unsubscribe();
    } catch (err) {
      console.error('Error subscribing to reviews:', err);
      setError(err instanceof Error ? err : new Error('Failed to subscribe to reviews'));
      setLoading(false);
    }
  }, [approvedOnly]);

  return { reviews, loading, error };
}
