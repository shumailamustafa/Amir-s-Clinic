'use client';

import { useState, useEffect } from 'react';
import { subscribeToBlogPosts } from '@dental/firebase';
import type { BlogPost } from '@dental/types';

export function useBlog(publishedOnly = true) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToBlogPosts((data, subError) => {
      if (subError) {
        setError(new Error(subError));
      } else {
        setPosts(data);
        setError(null);
      }
      setLoading(false);
    }, publishedOnly ? 'published' : undefined);

    return () => unsubscribe();
  }, [publishedOnly]);

  return { posts, loading, error };
}
