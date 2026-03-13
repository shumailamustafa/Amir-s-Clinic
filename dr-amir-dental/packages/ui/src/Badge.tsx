import React from 'react';

interface BadgeProps {
  variant: 'open' | 'closed' | 'pending' | 'approved' | 'rejected' | 'info' | 'success';
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

const variantClasses = {
  open: 'bg-[var(--color-status-open)]/15 text-[var(--color-status-open)] border-[var(--color-status-open)]/30',
  closed: 'bg-[var(--color-status-closed)]/15 text-[var(--color-status-closed)] border-[var(--color-status-closed)]/30',
  pending: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  approved: 'bg-[var(--color-status-open)]/15 text-[var(--color-status-open)] border-[var(--color-status-open)]/30',
  rejected: 'bg-[var(--color-status-closed)]/15 text-[var(--color-status-closed)] border-[var(--color-status-closed)]/30',
  info: 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/30',
  success: 'bg-[var(--color-status-open)]/15 text-[var(--color-status-open)] border-[var(--color-status-open)]/30',
};

export function Badge({ variant, children, pulse = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full border ${variantClasses[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === 'open' ? 'bg-[var(--color-status-open)]' : 'bg-[var(--color-status-closed)]'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              variant === 'open' ? 'bg-[var(--color-status-open)]' : 'bg-[var(--color-status-closed)]'
            }`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
