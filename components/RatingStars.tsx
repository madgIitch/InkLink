import React from "react";

export function RatingStars({
  value = 0,
  outOf = 5,
  size = 22,
}: {
  value?: number;
  outOf?: number;
  size?: number;
}) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;

  return (
    <div className="flex items-center gap-1" aria-label={`Puntuación ${value} sobre ${outOf}`}>
      {Array.from({ length: outOf }).map((_, i) => {
        const filled = i < full || (i === full && hasHalf);
        return (
          <svg
            key={i}
            className="star"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.6l1.2-6.6-4.8-4.6 6.6-.9L12 2.5z"
              fill={filled ? "#3B82F6" : "none"}
              stroke="#3B82F6"
              strokeWidth="1.8"
            />
          </svg>
        );
      })}
      <span className="ml-2 font-medium text-slate-600">{value.toFixed(1)}</span>
    </div>
  );
}
