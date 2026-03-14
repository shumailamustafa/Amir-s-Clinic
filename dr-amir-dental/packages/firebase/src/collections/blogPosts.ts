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
import type { BlogPost, BlogStatus } from '@dental/types';
import { createLogger, formatError } from '@dental/utils';
import { firebaseOperation, type FirebaseResult } from '../errorHandler';

const COLLECTION = 'blogPosts';
const CONTEXT = 'firebase:blogPosts';

export async function createBlogPost(
  data: Omit<BlogPost, 'id'>
): Promise<FirebaseResult<string>> {
  return firebaseOperation('createBlogPost', CONTEXT, async () => {
    const ref = await addDoc(collection(getDb(), COLLECTION), data);
    return ref.id;
  });
}

export async function getBlogPostBySlug(
  slug: string
): Promise<FirebaseResult<BlogPost | null>> {
  return firebaseOperation('getBlogPostBySlug', CONTEXT, async () => {
    const q = query(
      collection(getDb(), COLLECTION),
      where('slug', '==', slug)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as BlogPost;
  });
}

export async function getBlogPostById(id: string): Promise<FirebaseResult<BlogPost | null>> {
  return firebaseOperation('getBlogPostById', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as BlogPost) : null;
  });
}

export async function getBlogPosts(
  status?: BlogStatus,
  category?: string
): Promise<FirebaseResult<BlogPost[]>> {
  return firebaseOperation('getBlogPosts', CONTEXT, async () => {
    const q = query(collection(getDb(), COLLECTION));
    const snap = await getDocs(q);
    let posts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost));

    if (status) posts = posts.filter(p => p.status === status);
    if (category) posts = posts.filter(p => p.category === category);

    return posts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  });
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPost>
): Promise<FirebaseResult<void>> {
  return firebaseOperation('updateBlogPost', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    await updateDoc(ref, data);
  });
}

export async function deleteBlogPost(id: string): Promise<FirebaseResult<void>> {
  return firebaseOperation('deleteBlogPost', CONTEXT, async () => {
    const ref = doc(getDb(), COLLECTION, id);
    await deleteDoc(ref);
  });
}

export function subscribeToBlogPosts(
  callback: (posts: BlogPost[], error?: string) => void,
  status?: BlogStatus,
  category?: string
): Unsubscribe {
  const logger = createLogger(CONTEXT);
  const q = query(collection(getDb(), COLLECTION));

  return onSnapshot(q, (snap) => {
    let posts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost));

    if (status) posts = posts.filter(p => p.status === status);
    if (category) posts = posts.filter(p => p.category === category);

    posts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    callback(posts);
  }, (error) => {
    logger.error({ error: formatError(error) }, 'BlogPosts subscription error');
    callback([], 'Failed to sync blog posts');
  });
}
