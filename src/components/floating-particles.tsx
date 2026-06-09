import { useEffect, useState } from "react";

const SYMBOLS = ["✦", "⋆", "♡", "✶", "✧", "❀", "✿", "☆"];

export function FloatingParticles({ count = 22 }: { count?: number }) {
  const [particles, setParticles] = useState<Array<{ s: string; left: number; size: number; delay: number; dur: number; o: number }>>([]);

  useEffect(() => {
    const arr = Array.from({ length: count }).map(() => ({
      s: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      left: Math.random() * 100,
      size: 12 + Math.random() * 22,
      delay: Math.random() * 12,
      dur: 14 + Math.random() * 18,
      o: 0.4 + Math.random() * 0.5,
    }));
    setParticles(arr);
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-40px",
            fontSize: p.size,
            opacity: p.o,
            color: i % 2 === 0 ? "oklch(0.78 0.15 340)" : "oklch(0.75 0.13 300)",
            animation: `float-up ${p.dur}s linear ${p.delay}s infinite`,
            filter: "drop-shadow(0 0 6px oklch(0.85 0.12 330 / 0.6))",
          }}
        >
          {p.s}
        </span>
      ))}
    </div>
  );
}
