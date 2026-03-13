import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, hover = false, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-card)] ${
        hover
          ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] cursor-pointer'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
