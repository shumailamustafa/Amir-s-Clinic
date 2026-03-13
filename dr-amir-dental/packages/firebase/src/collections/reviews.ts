import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  type Unsubscribe,
  onSnapshot,
} from 'firebase/firestore';
import { getDb } from '../config';
import type { Review, ReviewStatus } from '@dental/types';

const COLLECTION = 'reviews';

export async function createReview(data: Omit<Review, 'id'>): Promise<string> {
  const ref = await addDoc(collection(getDb(), COLLECTION), data);
  return ref.id;
}

export async function getReviewsByStatus(
  status: ReviewStatus
): Promise<Review[]> {
  const q = query(
    collection(getDb(), COLLECTION),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
}

export async function getAllReviews(): Promise<Review[]> {
  const q = query(
    collection(getDb(), COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatus
): Promise<void> {
  const ref = doc(getDb(), COLLECTION, id);
  await updateDoc(ref, { status });
}

export async function addAdminReply(
  id: string,
  adminReply: string
): Promise<void> {
  const ref = doc(getDb(), COLLECTION, id);
  await updateDoc(ref, { adminReply });
}

export function subscribeToReviews(
  callback: (reviews: Review[]) => void,
  status?: ReviewStatus
): Unsubscribe {
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
  return onSnapshot(q, (snap) => {
    const reviews = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Review
    );
    callback(reviews);
  });
}
