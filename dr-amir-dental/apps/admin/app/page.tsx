import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">
          Admin Panel
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Dr. Amir Dental Care — Management Dashboard
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:bg-[var(--color-button-hover)] transition-colors"
        >
          Go to Login
        </Link>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          Foundation setup complete — login & dashboard coming in Phase 5
        </p>
      </div>
    </main>
  );
}
