export function formatError(error: unknown): string {
  if (error instanceof Error) {
    // Check if it's a Firebase Error (often duck-typed)
    const firebaseError = error as any;
    if (firebaseError.code) {
      return `FirebaseError [${firebaseError.code}]: ${firebaseError.message}\nStack: ${firebaseError.stack}`;
    }
    return `${error.name}: ${error.message}\nStack: ${error.stack}`;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}
