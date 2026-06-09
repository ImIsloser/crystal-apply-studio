import { motion } from "framer-motion";

/** Decorative crystal/gem emblem used as the hero focal point. */
export function CrystalGem({ size = 96 }: { size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="gem-float relative inline-flex"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 100 110" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gemTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="oklch(0.95 0.04 330)" />
            <stop offset="1" stopColor="oklch(0.82 0.12 320)" />
          </linearGradient>
          <linearGradient id="gemLeft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="oklch(0.78 0.18 350)" />
            <stop offset="1" stopColor="oklch(0.6 0.2 335)" />
          </linearGradient>
          <linearGradient id="gemRight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="oklch(0.74 0.16 310)" />
            <stop offset="1" stopColor="oklch(0.56 0.19 300)" />
          </linearGradient>
          <linearGradient id="gemMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.88 0.1 330)" />
            <stop offset="1" stopColor="oklch(0.66 0.2 330)" />
          </linearGradient>
          <filter id="gemGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#gemGlow)">
          {/* crown */}
          <polygon points="22,34 50,34 36,12" fill="url(#gemTop)" opacity="0.95" />
          <polygon points="50,34 78,34 64,12" fill="url(#gemTop)" opacity="0.85" />
          <polygon points="36,12 64,12 50,34" fill="url(#gemMid)" />
          <polygon points="22,34 36,12 50,34" fill="url(#gemTop)" opacity="0.9" />
          <polygon points="50,34 64,12 78,34" fill="url(#gemTop)" opacity="0.8" />
          {/* body */}
          <polygon points="22,34 78,34 50,98" fill="url(#gemMid)" />
          <polygon points="22,34 50,34 50,98" fill="url(#gemLeft)" />
          <polygon points="50,34 78,34 50,98" fill="url(#gemRight)" />
          {/* facet highlight */}
          <polygon points="36,34 50,34 50,72" fill="oklch(1 0 0 / 0.35)" />
        </g>
        {/* sparkle accents */}
        <g fill="oklch(1 0 0 / 0.9)">
          <circle cx="84" cy="22" r="1.6" />
          <circle cx="16" cy="46" r="1.3" />
          <circle cx="70" cy="58" r="1.1" />
        </g>
      </svg>
    </motion.div>
  );
}
