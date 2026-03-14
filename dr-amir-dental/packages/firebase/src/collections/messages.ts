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
import type { Message, MessageStatus } from '@dental/types';
import { createLogger, formatError } from '@dental/utils';
import { firebaseOperation, type FirebaseResult } from '../errorHandler';

const COLLECTION = 'messages';
const CONTEXT = 'firebase:messages';

export async function createMessage(
  data: Omit<Message, 'id'>
): Promise<FirebaseResult<string>> {
  return firebaseOperation('createMessage', CONTEXT, async () => {
    const ref = await addDoc(collection(getDb(), COLLECTION), data);
    return ref.id;
  });
}

export async function getMessages(
  status?: MessageStatus
): Promise<FirebaseResult<Message[]>> {
  return firebaseOperation('getMessages', CONTEXT, async () => {
    let q = query(
      collection(getDb(), COLLECTION),
      orderBy('createdAt', 'desc')
    );
    if (status) {
      q = query(
        collection(getDb(), COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Message);
  });
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus
): Promise<FirebaseResult<void>> {
  return firebaseOperation('updateMessageStatus', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    await updateDoc(ref, { status });
  });
}

export function subscribeToMessages(
  callback: (messages: Message[], error?: string) => void
): Unsubscribe {
  const logger = createLogger(CONTEXT);
  const q = query(
    collection(getDb(), COLLECTION),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Message
    );
    callback(messages);
  }, (error) => {
    logger.error({ error: formatError(error) }, 'Messages subscription error');
    callback([], 'Failed to sync inbox messages');
  });
}
