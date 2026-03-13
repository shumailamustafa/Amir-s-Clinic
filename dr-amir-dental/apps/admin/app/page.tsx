import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // Middleware will handle auth checks
  redirect('/dashboard');
}
