import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  type Unsubscribe,
  onSnapshot,
} from 'firebase/firestore';
import { getDb } from '../config';
import type { Review, ReviewStatus } from '@dental/types';
import { createLogger, formatError } from '@dental/utils';
import { firebaseOperation, type FirebaseResult } from '../errorHandler';

const COLLECTION = 'reviews';
const CONTEXT = 'firebase:reviews';

export async function createReview(data: Omit<Review, 'id'>): Promise<FirebaseResult<string>> {
  return firebaseOperation('createReview', CONTEXT, async () => {
    const ref = await addDoc(collection(getDb(), COLLECTION), data);
    return ref.id;
  });
}

export async function getReviewsByStatus(
  status: ReviewStatus
): Promise<FirebaseResult<Review[]>> {
  return firebaseOperation('getReviewsByStatus', CONTEXT, async () => {
    const q = query(collection(getDb(), COLLECTION));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Review))
      .filter(r => r.status === status)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });
}

export async function getAllReviews(): Promise<FirebaseResult<Review[]>> {
  return firebaseOperation('getAllReviews', CONTEXT, async () => {
    const q = query(collection(getDb(), COLLECTION));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Review))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatus
): Promise<FirebaseResult<void>> {
  return firebaseOperation('updateReviewStatus', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    await updateDoc(ref, { status });
  });
}

export async function addAdminReply(
  id: string,
  adminReply: string
): Promise<FirebaseResult<void>> {
  return firebaseOperation('addAdminReply', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    await updateDoc(ref, { adminReply });
  });
}

export function subscribeToReviews(
  callback: (reviews: Review[], error?: string) => void,
  status?: ReviewStatus
): Unsubscribe {
  const logger = createLogger(CONTEXT);
  
  const q = query(collection(getDb(), COLLECTION));

  return onSnapshot(q, (snap) => {
    let reviews = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Review
    );

    // Filter by status in memory
    if (status) {
      reviews = reviews.filter(r => r.status === status);
    }

    // Sort by createdAt desc in memory
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    callback(reviews);
  }, (error) => {
    logger.error({ error: formatError(error) }, 'Reviews subscription error');
    callback([], 'Failed to sync reviews');
  });
}
