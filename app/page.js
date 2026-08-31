'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import ShaderHero from './components/ShaderHero';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  const fadeInVariant = (delay = 0) => ({
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: 'easeOut', delay },
  });

  return (
    <>
      <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden sm:min-h-screen">
        <ShaderHero />

        <motion.div
          className="relative z-10 mx-6 max-w-xl rounded-2xl bg-cream/85 px-8 py-10 text-center shadow-lg backdrop-blur-sm"
          {...fadeInVariant(0)}
        >
          <h1
            className="text-4xl italic text-plum sm:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Complex features, simple interfaces.
          </h1>
          <p className="mt-3 text-plum/70">
            I'm a frontend developer — with backend and Flutter experience — who builds interfaces for the messy, feature-heavy flows most people avoid.
          </p>
        </motion.div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          className="overflow-hidden rounded-xl"
          {...fadeInVariant(0.1)}
        >
          <img
            src="/images/lankastay-proof.png"
            alt="LankaStay booking flow — before and after"
            className="w-full h-auto rounded-xl border border-lavender/30"
          />
        </motion.div>
      </div>
    </>
  );
}