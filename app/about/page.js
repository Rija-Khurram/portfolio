"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function About() {
  const prefersReducedMotion = useReducedMotion();
  const fadeIn = (delay = 0) => ({ initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, ease: "easeOut", delay } });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <motion.h1 className="text-3xl italic text-plum mb-6" style={{ fontFamily: "var(--font-heading)" }} {...fadeIn(0)}>
        About
      </motion.h1>
      <motion.p className="text-plum/70 mb-4" {...fadeIn(0.1)}>
        I'm a frontend developer with backend and Flutter experience. I care about the parts of an app most people skip past — the booking form that has to handle overlapping dates, the dashboard that needs to show ten things without overwhelming anyone, the form that has to validate without feeling like a wall of red text.
      </motion.p>
      <motion.p className="text-plum/70" {...fadeIn(0.2)}>
        My background spans Laravel, PHP, Flutter, and JavaScript — built through real projects, not tutorials. What I care about when building things: taking a feature that's genuinely complex underneath and making sure the person using it never has to think about that complexity.
      </motion.p>
    </div>
  );
}