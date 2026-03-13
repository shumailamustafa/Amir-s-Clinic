'use client';

import React from 'react';
import { Badge } from '@dental/ui';

interface OpenClosedBadgeProps {
  isOpen: boolean;
  statusText: string;
}

export function OpenClosedBadge({ isOpen, statusText }: OpenClosedBadgeProps) {
  return (
    <Badge variant={isOpen ? 'open' : 'closed'} pulse>
      {statusText}
    </Badge>
  );
}
