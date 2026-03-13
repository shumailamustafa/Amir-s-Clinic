'use client';

import { useState, useEffect } from 'react';
import { subscribeToBlogPosts } from '@dental/firebase';
import type { BlogPost } from '@dental/types';

export function useBlog(publishedOnly = true) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToBlogPosts((data: BlogPost[]) => {
        setPosts(data);
        setLoading(false);
      }, publishedOnly ? 'published' : undefined);

      return () => unsubscribe();
    } catch (err) {
      console.error('Error subscribing to blog posts:', err);
      setError(err instanceof Error ? err : new Error('Failed to subscribe to blog posts'));
      setLoading(false);
    }
  }, [publishedOnly]);

  return { posts, loading, error };
}
