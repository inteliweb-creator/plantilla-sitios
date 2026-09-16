'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Línea de bronce arriba del todo que avanza al bajar por la página. */
export default function BarraProgreso() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="marco fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[100] pointer-events-none"
    />
  );
}
