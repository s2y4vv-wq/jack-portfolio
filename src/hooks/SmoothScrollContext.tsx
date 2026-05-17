import { createContext, useContext } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

interface SmoothScrollContextType {
  /** Spring-smoothed page scroll progress (0–1) — kirifuda SmoothWheel equivalent */
  progress: MotionValue<number>;
}

const SmoothScrollContext = createContext<SmoothScrollContextType | null>(null);

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error('useSmoothScroll must be used within SmoothScrollProvider');
  return ctx;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Track full page scroll
  const { scrollYProgress } = useScroll();

  // Kirifuda-style spring deceleration (SmoothWheel equivalent)
  const progress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 35,
    mass: 0.3,
    restDelta: 0.0001,
  });

  return (
    <SmoothScrollContext.Provider value={{ progress }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
