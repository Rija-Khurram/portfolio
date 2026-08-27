'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export default function Home() {
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
        className="text-4xl italic text-plum mb-4"
        style={{ fontFamily: "var(--font-heading)" }}
        {...fadeInVariant(0)}
      >
        Complex features, simple interfaces.
      </motion.h1>
      <motion.div
        className="mb-8 border-2 border-dashed border-lavender/30 rounded flex items-center justify-center"
        style={{ width: "100%", height: "450px", backgroundColor: "rgba(184, 166, 224, 0.08)" }}
        {...fadeInVariant(0.1)}
      >
        {/* <img
          src="/images/lankastay-proof.png"
          alt="LankaStay booking flow — before and after"
          className="w-full h-full object-cover rounded"
        /> */}
        <p className="text-plum/70 text-center">
          Add LankaStay booking flow screenshot here
        </p>
      </motion.div>
      <motion.p
        className="text-plum/70"
        {...fadeInVariant(0.2)}
      >
        I'm a frontend developer — with backend and Flutter experience — who builds interfaces for the messy, feature-heavy flows most people avoid.
      </motion.p>
    </div>
  );
}