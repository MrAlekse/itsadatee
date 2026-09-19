import React, { useMemo } from 'react';

/**
 * Floating decorative romantic hearts and sparkles drifting smoothly in the background.
 */
export default function FloatingHearts({ count = 20 }) {
  // Generate random stable particles
  const particles = useMemo(() => {
    const symbols = ['💗', '💖', '✨', '🌸', '💕', '🤍', '⭐'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: `${(i * (100 / count) + Math.random() * 4) % 100}%`,
      animationDuration: `${7 + (i % 6) * 2.5}s`,
      animationDelay: `${(i * 0.4) % 5}s`,
      fontSize: `${14 + (i % 5) * 6}px`,
      opacity: 0.15 + ((i % 4) * 0.08),
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none animate-float-up"
          style={{
            left: p.left,
            bottom: '-40px',
            fontSize: p.fontSize,
            opacity: p.opacity,
            animation: `floatUp ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        >
          {p.symbol}
        </span>
      ))}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: var(--particle-opacity, 0.3);
          }
          85% {
            opacity: var(--particle-opacity, 0.3);
          }
          100% {
            transform: translateY(-110vh) rotate(360deg) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
