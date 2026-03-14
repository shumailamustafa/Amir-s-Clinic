'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { formatError } from '@dental/utils';

// Admin app might not have the same DevErrorStore (PRD only specifies it for website)
// but it's good practice to have global listeners anyway.
export function GlobalErrorHandler() {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      const formatted = formatError(error);

      if (process.env.NODE_ENV === 'development') {
        toast.error('Unhandled Promise Rejection', {
          description: formatted.split('\n')[0],
        });
      }
      console.error('Unhandled Rejection:', error);
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global Error:', event.error || event.message);
    };

    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
