import { doc, getDoc, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { getDb } from '../config';
import type { DoctorProfile } from '@dental/types';

const COLLECTION = 'doctorProfile';
const DOC_ID = 'main';

export async function getDoctorProfile(): Promise<DoctorProfile | null> {
  try {
    const ref = doc(getDb(), COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as DoctorProfile) : null;
  } catch (error) {
    console.error('[doctorProfile] Failed to get:', error);
    return null;
  }
}

export async function updateDoctorProfile(
  data: Partial<DoctorProfile>
): Promise<void> {
  const ref = doc(getDb(), COLLECTION, DOC_ID);
  await setDoc(ref, data, { merge: true });
}

export function subscribeToDoctorProfile(
  callback: (profile: DoctorProfile | null) => void
): Unsubscribe {
  try {
    const ref = doc(getDb(), COLLECTION, DOC_ID);
    return onSnapshot(
      ref,
      (snap) => {
        callback(snap.exists() ? (snap.data() as DoctorProfile) : null);
      },
      (error) => {
        console.error('[doctorProfile] Snapshot error:', error);
        callback(null);
      }
    );
  } catch (error) {
    console.error('[doctorProfile] Failed to subscribe:', error);
    callback(null);
    return () => {};
  }
}
