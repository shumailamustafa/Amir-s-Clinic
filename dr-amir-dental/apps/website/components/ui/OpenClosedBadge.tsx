'use client';

import React from 'react';
import { Badge } from '@dental/ui';

interface OpenClosedBadgeProps {
  isOpen: boolean;
  statusText: string;
  loading?: boolean;
}

export function OpenClosedBadge({ isOpen, statusText, loading }: OpenClosedBadgeProps) {
  if (loading) {
    return (
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] animate-pulse shadow-sm">
        <div className="w-2 h-2 rounded-full bg-[var(--color-text-secondary)]/30 mr-2" />
        <div className="h-4 w-32 bg-[var(--color-text-secondary)]/20 rounded" />
      </div>
    );
  }

  return (
    <Badge variant={isOpen ? 'open' : 'closed'} pulse>
      {statusText}
    </Badge>
  );
}
