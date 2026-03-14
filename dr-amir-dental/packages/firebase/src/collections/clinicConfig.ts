import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '../config';
import type { ClinicConfig } from '@dental/types';
import { createLogger, formatError } from '@dental/utils';
import { firebaseOperation, type FirebaseResult } from '../errorHandler';

const COLLECTION = 'clinicConfig';
const DOC_ID = 'main';
const CONTEXT = 'firebase:clinicConfig';

export async function getClinicConfig(): Promise<FirebaseResult<ClinicConfig | null>> {
  return firebaseOperation('getClinicConfig', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as ClinicConfig) : null;
  });
}

export async function updateClinicConfig(
  data: Partial<ClinicConfig>
): Promise<FirebaseResult<void>> {
  return firebaseOperation('updateClinicConfig', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, DOC_ID);
    await setDoc(ref, data, { merge: true });
  });
}

export function subscribeToClinicConfig(
  callback: (config: ClinicConfig | null, error?: string) => void
): Unsubscribe {
  const logger = createLogger(CONTEXT);
  const ref = doc(getDb(), COLLECTION, DOC_ID);

  return onSnapshot(
    ref,
    (snap) => {
      callback(snap.exists() ? (snap.data() as ClinicConfig) : null);
    },
    (error) => {
      logger.error({ error: formatError(error) }, 'ClinicConfig subscription error');
      callback(null, 'Failed to sync hospital settings');
    }
  );
}
