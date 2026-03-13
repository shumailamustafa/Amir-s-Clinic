import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '../config';
import type { Service } from '@dental/types';

const COLLECTION = 'services';

export async function getServices(visibleOnly = false): Promise<Service[]> {
  let q = query(collection(getDb(), COLLECTION), orderBy('order', 'asc'));
  if (visibleOnly) {
    q = query(
      collection(getDb(), COLLECTION),
      where('isVisible', '==', true),
      orderBy('order', 'asc')
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Service);
}

export function subscribeToServices(
  callback: (services: Service[]) => void,
  visibleOnly = false
): Unsubscribe {
  try {
    let q = query(collection(getDb(), COLLECTION), orderBy('order', 'asc'));
    if (visibleOnly) {
      q = query(
        collection(getDb(), COLLECTION),
        where('isVisible', '==', true),
        orderBy('order', 'asc')
      );
    }
    return onSnapshot(q, (snap) => {
      const services = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Service
      );
      callback(services);
    }, (error) => {
      console.error('[services] Snapshot error:', error);
      callback([]);
    });
  } catch (error) {
    console.error('[services] Failed to subscribe:', error);
    callback([]);
    return () => {};
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  const ref = doc(getDb(), COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Service) : null;
}

export async function createService(
  data: Omit<Service, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(getDb(), COLLECTION), data);
  return ref.id;
}

export async function updateService(
  id: string,
  data: Partial<Service>
): Promise<void> {
  const ref = doc(getDb(), COLLECTION, id);
  await updateDoc(ref, data);
}

export async function deleteService(id: string): Promise<void> {
  const ref = doc(getDb(), COLLECTION, id);
  await deleteDoc(ref);
}

export async function reorderServices(
  orderedIds: string[]
): Promise<void> {
  const promises = orderedIds.map((id, index) =>
    updateDoc(doc(getDb(), COLLECTION, id), { order: index })
  );
  await Promise.all(promises);
}
