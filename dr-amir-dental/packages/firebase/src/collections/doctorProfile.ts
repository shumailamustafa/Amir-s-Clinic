import { doc, getDoc, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { getDb } from '../config';
import type { DoctorProfile } from '@dental/types';
import { createLogger, formatError } from '@dental/utils';
import { firebaseOperation, type FirebaseResult } from '../errorHandler';

const COLLECTION = 'doctorProfile';
const DOC_ID = 'main';
const CONTEXT = 'firebase:doctorProfile';

export async function getDoctorProfile(): Promise<FirebaseResult<DoctorProfile | null>> {
  return firebaseOperation('getDoctorProfile', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as DoctorProfile) : null;
  });
}

export async function updateDoctorProfile(
  data: Partial<DoctorProfile>
): Promise<FirebaseResult<void>> {
  return firebaseOperation('updateDoctorProfile', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, DOC_ID);
    await setDoc(ref, data, { merge: true });
  });
}

export function subscribeToDoctorProfile(
  callback: (profile: DoctorProfile | null, error?: string) => void
): Unsubscribe {
  const logger = createLogger(CONTEXT);
  const ref = doc(getDb(), COLLECTION, DOC_ID);

  return onSnapshot(
    ref,
    (snap) => {
      callback(snap.exists() ? (snap.data() as DoctorProfile) : null);
    },
    (error) => {
      logger.error({ error: formatError(error) }, 'DoctorProfile subscription error');
      callback(null, 'Failed to sync doctor profile');
    }
  );
}
