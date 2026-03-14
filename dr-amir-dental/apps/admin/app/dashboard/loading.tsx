export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded-lg" />
          <div className="h-4 w-72 bg-[var(--color-surface)] rounded" />
        </div>
        <div className="h-10 w-32 bg-[var(--color-surface)] rounded-lg" />
      </div>
      
      <div className="space-y-4">
        <div className="h-64 w-full bg-[var(--color-surface)] rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-32 bg-[var(--color-surface)] rounded-xl" />
          <div className="h-32 bg-[var(--color-surface)] rounded-xl" />
          <div className="h-32 bg-[var(--color-surface)] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
