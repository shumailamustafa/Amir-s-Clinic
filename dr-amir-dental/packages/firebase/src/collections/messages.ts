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

const COLLECTION = 'messages';

export async function createMessage(
  data: Omit<Message, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(getDb(), COLLECTION), data);
  return ref.id;
}

export async function getMessages(
  status?: MessageStatus
): Promise<Message[]> {
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
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus
): Promise<void> {
  const ref = doc(getDb(), COLLECTION, id);
  await updateDoc(ref, { status });
}

export function subscribeToMessages(
  callback: (messages: Message[]) => void
): Unsubscribe {
  try {
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
      console.error('[messages] Snapshot error:', error);
      callback([]);
    });
  } catch (error) {
    console.error('[messages] Failed to subscribe:', error);
    callback([]);
    return () => {};
  }
}
