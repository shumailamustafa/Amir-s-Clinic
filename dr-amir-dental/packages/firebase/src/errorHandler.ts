import { createLogger, formatError } from '@dental/utils';

export interface FirebaseResult<T> {
  data: T | null;
  error: string | null;
}

const ERROR_MAPPINGS: Record<string, string> = {
  'permission-denied': 'You do not have permission for this action',
  'not-found': 'The requested data was not found',
  'already-exists': 'This record already exists',
  'unavailable': 'Service temporarily unavailable. Try again.',
  'unauthenticated': 'Please log in to continue',
  'resource-exhausted': 'Too many requests. Please wait a moment.',
  'deadline-exceeded': 'Request timed out. Check your connection.',
};

export async function firebaseOperation<T>(
  operationName: string,
  context: string,
  operation: () => Promise<T>
): Promise<FirebaseResult<T>> {
  const logger = createLogger(context);

  try {
    const data = await operation();
    return { data, error: null };
  } catch (error: any) {
    const code = error.code as string;
    const humanMessage = ERROR_MAPPINGS[code] || `An unexpected error occurred: ${code || error.message}`;
    
    logger.error({ 
      operationName, 
      code,
      originalError: error.message 
    }, `Failed ${operationName}: ${formatError(error)}`);

    return { data: null, error: humanMessage };
  }
}
