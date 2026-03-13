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
} from 'firebase/firestore';
import { getDb } from '../config';
import type { BlogPost, BlogStatus } from '@dental/types';

const COLLECTION = 'blogPosts';

export async function createBlogPost(
  data: Omit<BlogPost, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(getDb(), COLLECTION), data);
  return ref.id;
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const q = query(
    collection(getDb(), COLLECTION),
    where('slug', '==', slug)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as BlogPost;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const ref = doc(getDb(), COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as BlogPost) : null;
}

export async function getBlogPosts(
  status?: BlogStatus,
  category?: string
): Promise<BlogPost[]> {
  let q = query(
    collection(getDb(), COLLECTION),
    orderBy('createdAt', 'desc')
  );

  if (status && category) {
    q = query(
      collection(getDb(), COLLECTION),
      where('status', '==', status),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
  } else if (status) {
    q = query(
      collection(getDb(), COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
  } else if (category) {
    q = query(
      collection(getDb(), COLLECTION),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
  }

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost);
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPost>
): Promise<void> {
  const ref = doc(getDb(), COLLECTION, id);
  await updateDoc(ref, data);
}

export async function deleteBlogPost(id: string): Promise<void> {
  const ref = doc(getDb(), COLLECTION, id);
  await deleteDoc(ref);
}
