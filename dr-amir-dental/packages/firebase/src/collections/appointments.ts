import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '../config';
import type { Appointment, AppointmentStatus, PaymentStatus } from '@dental/types';

const COLLECTION = 'appointments';

export async function createAppointment(
  data: Omit<Appointment, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(getDb(), COLLECTION), data);
  return ref.id;
}

export async function getAppointmentsByDate(
  date: string
): Promise<Appointment[]> {
  const q = query(
    collection(getDb(), COLLECTION),
    where('date', '==', date),
    orderBy('timeSlot', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment);
}

export async function getAppointmentsByStatus(
  status: AppointmentStatus
): Promise<Appointment[]> {
  const q = query(
    collection(getDb(), COLLECTION),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment);
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const q = query(
    collection(getDb(), COLLECTION),
    orderBy('date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment);
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  const ref = doc(getDb(), COLLECTION, id);
  await updateDoc(ref, { status });
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus
): Promise<void> {
  const ref = doc(getDb(), COLLECTION, id);
  await updateDoc(ref, { paymentStatus });
}

export async function getBookedSlots(date: string): Promise<string[]> {
  const appointments = await getAppointmentsByDate(date);
  return appointments
    .filter((a) => a.status !== 'cancelled')
    .map((a) => a.timeSlot);
}

export function subscribeToAppointments(
  callback: (appointments: Appointment[]) => void
): Unsubscribe {
  try {
    const q = query(
      collection(getDb(), COLLECTION),
      orderBy('date', 'desc')
    );
    return onSnapshot(q, (snap) => {
      const appointments = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Appointment
      );
      callback(appointments);
    }, (error) => {
      console.error('[appointments] Snapshot error:', error);
      callback([]);
    });
  } catch (error) {
    console.error('[appointments] Failed to subscribe:', error);
    callback([]);
    return () => {};
  }
}
