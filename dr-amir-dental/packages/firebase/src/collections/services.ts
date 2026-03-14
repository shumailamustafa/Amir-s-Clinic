import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '../config';
import type { Service } from '@dental/types';
import { createLogger, formatError } from '@dental/utils';
import { firebaseOperation, type FirebaseResult } from '../errorHandler';

const COLLECTION = 'services';
const CONTEXT = 'firebase:services';

export async function getServices(visibleOnly = false): Promise<FirebaseResult<Service[]>> {
  return firebaseOperation('getServices', CONTEXT, async () => {
    // To avoid missing index errors (where + orderBy requires composite index),
    // we query all services ordered by 'order' and filter in memory if needed.
    const q = query(collection(getDb(), COLLECTION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    let services = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Service);
    
    if (visibleOnly) {
      services = services.filter(s => s.isVisible);
    }
    
    return services;
  });
}

export function subscribeToServices(
  callback: (services: Service[], error?: string) => void,
  visibleOnly = false
): Unsubscribe {
  const logger = createLogger(CONTEXT);
  
  // To avoid missing index errors (where + orderBy requires composite index),
  // we subscribe to all services ordered by 'order' and filter in memory if needed.
  // This is safe because the number of services is typically small.
  const q = query(collection(getDb(), COLLECTION), orderBy('order', 'asc'));

  return onSnapshot(q, (snap) => {
    let services = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Service
    );

    if (visibleOnly) {
      services = services.filter(s => s.isVisible);
    }

    callback(services);
  }, (error) => {
    logger.error({ error: formatError(error) }, 'Services subscription error');
    callback([], 'Failed to sync services list');
  });
}

export async function getServiceById(id: string): Promise<FirebaseResult<Service | null>> {
  return firebaseOperation('getServiceById', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Service) : null;
  });
}

export async function createService(
  data: Omit<Service, 'id'>
): Promise<FirebaseResult<string>> {
  return firebaseOperation('createService', CONTEXT, async () => {
    const ref = await addDoc(collection(getDb(), COLLECTION), data);
    return ref.id;
  });
}

export async function updateService(
  id: string,
  data: Partial<Service>
): Promise<FirebaseResult<void>> {
  return firebaseOperation('updateService', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    await updateDoc(ref, data);
  });
}

export async function deleteService(id: string): Promise<FirebaseResult<void>> {
  return firebaseOperation('deleteService', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    await deleteDoc(ref);
  });
}

export async function reorderServices(
  orderedIds: string[]
): Promise<FirebaseResult<void>> {
  return firebaseOperation('reorderServices', CONTEXT, async () => {
    const promises = orderedIds.map((id, index) =>
      updateDoc(doc(getDb(), COLLECTION, id), { order: index })
    );
    await Promise.all(promises);
  });
}
