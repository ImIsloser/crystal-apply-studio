import { motion } from "framer-motion";

/** Decorative crystal/gem emblem used as the hero focal point. */
export function CrystalGem({ size = 104 }: { size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="gem-float relative inline-flex"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 120 118" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gemBody" x1="0.25" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="oklch(0.93 0.06 332)" />
            <stop offset="0.5" stopColor="oklch(0.78 0.16 335)" />
            <stop offset="1" stopColor="oklch(0.58 0.21 318)" />
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
          {/* full gem silhouette (symmetric) */}
          <polygon
            points="42,18 78,18 106,48 60,106 14,48"
            fill="url(#gemBody)"
            stroke="oklch(1 0 0 / 0.45)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* --- facet shading (symmetric, subtle) --- */}
          {/* table (top flat) lighter */}
          <polygon points="42,18 78,18 90,48 30,48" fill="oklch(1 0 0 / 0.16)" />
          {/* table shine */}
          <polygon points="45,21 75,21 70,33 50,33" fill="oklch(1 0 0 / 0.4)" />
          {/* crown side wings */}
          <polygon points="14,48 30,48 42,18" fill="oklch(1 0 0 / 0.08)" />
          <polygon points="106,48 90,48 78,18" fill="oklch(1 0 0 / 0.08)" />
          {/* pavilion outer facets (darker, both sides equal) */}
          <polygon points="14,48 42,48 60,106" fill="oklch(0.38 0.13 318 / 0.28)" />
          <polygon points="106,48 78,48 60,106" fill="oklch(0.38 0.13 318 / 0.28)" />
          {/* pavilion center facet (lighter) */}
          <polygon points="42,48 78,48 60,106" fill="oklch(1 0 0 / 0.07)" />

          {/* --- facet outlines for crispness --- */}
          <g stroke="oklch(1 0 0 / 0.32)" strokeWidth="0.9" fill="none" strokeLinecap="round">
            <line x1="14" y1="48" x2="106" y2="48" />
            <line x1="30" y1="48" x2="42" y2="18" />
            <line x1="90" y1="48" x2="78" y2="18" />
            <line x1="42" y1="48" x2="60" y2="106" />
            <line x1="78" y1="48" x2="60" y2="106" />
            <line x1="42" y1="18" x2="30" y2="48" />
            <line x1="78" y1="18" x2="90" y2="48" />
          </g>
        </g>
      </svg>
    </motion.div>
  );
}
