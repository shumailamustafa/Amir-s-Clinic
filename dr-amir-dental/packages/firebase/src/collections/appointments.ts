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
import { createLogger, formatError } from '@dental/utils';
import { firebaseOperation, type FirebaseResult } from '../errorHandler';

const COLLECTION = 'appointments';
const CONTEXT = 'firebase:appointments';

export async function createAppointment(
  data: Omit<Appointment, 'id'>
): Promise<FirebaseResult<string>> {
  return firebaseOperation('createAppointment', CONTEXT, async () => {
    const ref = await addDoc(collection(getDb(), COLLECTION), data);
    return ref.id;
  });
}

export async function getAppointmentsByDate(
  date: string
): Promise<FirebaseResult<Appointment[]>> {
  return firebaseOperation('getAppointmentsByDate', CONTEXT, async () => {
    // To avoid missing index errors, we query all appointments for the date
    // and sort by timeSlot in memory.
    const q = query(
      collection(getDb(), COLLECTION),
      where('date', '==', date)
    );
    const snap = await getDocs(q);
    const appointments = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment);
    return appointments.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  });
}

export async function getAppointmentsByStatus(
  status: AppointmentStatus
): Promise<FirebaseResult<Appointment[]>> {
  return firebaseOperation('getAppointmentsByStatus', CONTEXT, async () => {
    // To avoid missing index errors, we query all appointments and filter/sort in memory.
    const q = query(
      collection(getDb(), COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as Appointment)
      .filter(a => a.status === status);
  });
}

export async function getAllAppointments(): Promise<FirebaseResult<Appointment[]>> {
  return firebaseOperation('getAllAppointments', CONTEXT, async () => {
    const q = query(
      collection(getDb(), COLLECTION),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment);
  });
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<FirebaseResult<void>> {
  return firebaseOperation('updateAppointmentStatus', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    await updateDoc(ref, { status });
  });
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus
): Promise<FirebaseResult<void>> {
  return firebaseOperation('updatePaymentStatus', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    await updateDoc(ref, { paymentStatus });
  });
}

export async function getBookedSlots(date: string): Promise<FirebaseResult<string[]>> {
  return firebaseOperation('getBookedSlots', CONTEXT, async () => {
    const { data: appointments, error } = await getAppointmentsByDate(date);
    if (error) throw new Error(error);
    return (appointments || [])
      .filter((a) => a.status !== 'cancelled')
      .map((a) => a.timeSlot);
  });
}

export function subscribeToAppointments(
  callback: (appointments: Appointment[], error?: string) => void
): Unsubscribe {
  const logger = createLogger(CONTEXT);
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
    logger.error({ error: formatError(error) }, 'Appointments subscription error');
    callback([], 'Failed to sync appointments');
  });
}
