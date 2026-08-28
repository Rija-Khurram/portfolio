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
        <h2 className="text-xl text-plum mb-4">LankaStay</h2>

        <img
          src="/images/lankastay-booking-flow.png"
          alt="LankaStay admin dashboard showing bookings with check-in and check-out dates"
          className="w-full h-auto rounded-lg border border-lavender/30 mb-4"
        />

        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-plum/50 mb-1">
              Problem
            </p>
            <p className="text-sm text-plum/70">
              A hotel booking system where overlapping bookings for the same
              room could slip through — two guests reserving the same dates
              without either of them knowing.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-plum/50 mb-1">
              Decision
            </p>
            <p className="text-sm text-plum/70">
              Built a Carbon-based date-range overlap check at the database
              level, rather than relying on client-side validation alone —
              so a booking can&apos;t be created if it overlaps an existing
              one, no matter where the request comes from.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-plum/50 mb-1">
              Outcome
            </p>
            <p className="text-sm text-plum/70">
              Reliably blocks double-bookings. Verified through manual
              testing across overlapping, adjacent, and edge-case date
              ranges.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="border border-lavender/30 rounded-xl p-6 hover:shadow-lg transition-shadow"
        whileHover={prefersReducedMotion ? {} : { y: -4 }}
        transition={{ duration: 0.2 }}
        {...fadeInVariant(0.2)}
      >
        <h2 className="text-xl text-plum mb-4">Library App</h2>
       <img
  src="/images/library-app-workflow.png"
  alt="Library App borrowed-books view showing overdue status and fine calculation"
  className="mx-auto max-w-[300px] h-auto rounded-lg border border-lavender/30 mb-4"
/>

        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-plum/50 mb-1">
              Problem
            </p>
            <p className="text-sm text-plum/70">
              Most student library apps stop at basic CRUD — add a book,
              borrow a book, done. That ignores how a real library actually
              works: someone has to physically hand the book over and take
              it back.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-plum/50 mb-1">
              Decision
            </p>
            <p className="text-sm text-plum/70">
              Built a Flutter + Firebase app around a simple rule: the app
              can speed up everything except the physical handoff. Browsing,
              requesting, and tracking are fully self-service, but pickup
              and return only finalize when a librarian confirms them in
              person — via a unique pickup code and a return-confirmation
              step where the fine is calculated and locked in. Firestore
              security rules enforce role-based access at the database
              level, and payments are simulated to keep the project free of
              billing dependencies.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-plum/50 mb-1">
              Outcome
            </p>
            <p className="text-sm text-plum/70">
              A complete, working request-to-return cycle for both roles:
              students can browse, request, track live status, get overdue
              warnings, and pay simulated fines; admins can manage the
              catalog, approve or reject requests, and confirm pickups and
              returns at the counter. Built as a semester project to
              demonstrate authentication, role-based access control, and a
              fully human-verified borrowing workflow — not deployed for
              real-world use.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}