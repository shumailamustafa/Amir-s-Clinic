'use client';

import React from 'react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onRate?: (rating: number) => void;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
};

export function StarRating({
  rating,
  maxStars = 5,
  interactive = false,
  size = 'md',
  onRate,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState(0);

  return (
    <div className="inline-flex items-center gap-0.5" role="group" aria-label={`Rating: ${rating} out of ${maxStars}`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= (hovered || rating);
        const isHalfFilled = !isFilled && starIndex - 0.5 <= rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(starIndex)}
            onMouseEnter={() => interactive && setHovered(starIndex)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            aria-label={`${starIndex} star${starIndex > 1 ? 's' : ''}`}
          >
            <svg
              className={`${sizeClasses[size]} transition-colors duration-200`}
              viewBox="0 0 24 24"
              fill={isFilled ? 'var(--color-star-gold)' : isHalfFilled ? 'url(#halfGrad)' : 'none'}
              stroke="var(--color-star-gold)"
              strokeWidth="1.5"
            >
              {isHalfFilled && (
                <defs>
                  <linearGradient id="halfGrad">
                    <stop offset="50%" stopColor="var(--color-star-gold)" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
