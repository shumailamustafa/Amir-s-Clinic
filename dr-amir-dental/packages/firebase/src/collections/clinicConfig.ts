import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '../config';
import type { ClinicConfig } from '@dental/types';

const COLLECTION = 'clinicConfig';
const DOC_ID = 'main';

export async function getClinicConfig(): Promise<ClinicConfig | null> {
  const ref = doc(getDb(), COLLECTION, DOC_ID);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as ClinicConfig) : null;
}

export async function updateClinicConfig(
  data: Partial<ClinicConfig>
): Promise<void> {
  const ref = doc(getDb(), COLLECTION, DOC_ID);
  await setDoc(ref, data, { merge: true });
}

export function subscribeToClinicConfig(
  callback: (config: ClinicConfig | null) => void
): Unsubscribe {
  const ref = doc(getDb(), COLLECTION, DOC_ID);
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? (snap.data() as ClinicConfig) : null);
  });
}
