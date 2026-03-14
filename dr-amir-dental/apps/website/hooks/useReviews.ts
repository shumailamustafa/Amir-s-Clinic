'use client';

import { useState, useEffect } from 'react';
import { subscribeToReviews } from '@dental/firebase';
import type { Review } from '@dental/types';

export function useReviews(approvedOnly = true) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToReviews((data, subError) => {
      if (subError) {
        setError(new Error(subError));
      } else {
        setReviews(data);
        setError(null);
      }
      setLoading(false);
    }, approvedOnly ? 'approved' : undefined);

    return () => unsubscribe();
  }, [approvedOnly]);

  return { reviews, loading, error };
}
