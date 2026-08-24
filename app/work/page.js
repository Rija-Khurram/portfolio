'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export default function Work() {
  const prefersReducedMotion = useReducedMotion();

  const fadeInVariant = (delay = 0) => ({
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: 'easeOut', delay },
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <motion.h1
        className="text-3xl italic text-plum mb-8"
        style={{ fontFamily: "var(--font-heading)" }}
        {...fadeInVariant(0)}
      >
        Work
      </motion.h1>
      <motion.section
        className="border border-lavender/30 rounded-xl p-6 mb-6 hover:shadow-lg transition-shadow"
        whileHover={prefersReducedMotion ? {} : { y: -4 }}
        transition={{ duration: 0.2 }}
        {...fadeInVariant(0.1)}
      >
        <h2 className="text-xl text-plum mb-2">LankaStay</h2>
        <p className="text-plum/70 text-sm">
          [Placeholder — case study: the problem, what I decided, what came
          of it. Screenshots of the booking flow and date-conflict logic go
          here.]
        </p>
      </motion.section>
      <motion.p
        className="text-sm text-plum/50"
        {...fadeInVariant(0.2)}
      >
        [Placeholder — space reserved for a second case study.]
      </motion.p>
    </div>
  );
}
