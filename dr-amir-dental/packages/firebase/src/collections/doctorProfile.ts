import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDb } from '../config';
import type { DoctorProfile } from '@dental/types';

const COLLECTION = 'doctorProfile';
const DOC_ID = 'main';

export async function getDoctorProfile(): Promise<DoctorProfile | null> {
  const ref = doc(getDb(), COLLECTION, DOC_ID);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as DoctorProfile) : null;
}

export async function updateDoctorProfile(
  data: Partial<DoctorProfile>
): Promise<void> {
  const ref = doc(getDb(), COLLECTION, DOC_ID);
  await setDoc(ref, data, { merge: true });
}
