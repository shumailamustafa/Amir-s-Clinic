'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useDevErrorStore } from '../../stores/devErrorStore';
import { formatError } from '@dental/utils';

export function GlobalErrorHandler() {
  const addError = useDevErrorStore((s) => s.addError);

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      const formatted = formatError(error);

      if (process.env.NODE_ENV === 'development') {
        addError({
          source: 'Unknown', // Could be Firebase if caught here, but usually 'API' or 'Unknown'
          message: formatted,
          stack: error instanceof Error ? error.stack : undefined,
        });
        toast.error('Unhandled Promise Rejection', {
          description: formatted.split('\n')[0],
          duration: 5000,
        });
      }
      
      console.error('Unhandled Rejection:', error);
    };

    const handleError = (event: ErrorEvent) => {
      const error = event.error || event.message;
      const formatted = formatError(error);

      if (process.env.NODE_ENV === 'development') {
        addError({
          source: 'Component',
          message: formatted,
          stack: error instanceof Error ? error.stack : undefined,
        });
      }

      console.error('Global Error:', error);
    };

    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleError);
    };
  }, [addError]);

  return null;
}
