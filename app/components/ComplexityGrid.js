"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const COLS = 6;
const ROWS = 4;
const SIZE = 14;
const GAP = 10;

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function ComplexityGrid() {
  const prefersReducedMotion = useReducedMotion();

  const cells = useMemo(() => {
    const rand = seededRandom(42);
    const items = [];
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const gridX = c * (SIZE + GAP);
        const gridY = r * (SIZE + GAP);
        const scatterX = gridX + (rand() - 0.5) * 120;
        const scatterY = gridY + (rand() - 0.5) * 80;
        const scatterRotate = (rand() - 0.5) * 90;
        const tone = i % 3 === 0 ? "bg-sky" : i % 3 === 1 ? "bg-lavender" : "bg-plum/20";
        items.push({ id: i, gridX, gridY, scatterX, scatterY, scatterRotate, tone });
        i++;
      }
    }
    return items;
  }, []);

  const width = COLS * (SIZE + GAP) - GAP;
  const height = ROWS * (SIZE + GAP) - GAP;

  return (
    <div aria-hidden="true" className="relative mx-auto sm:mx-0" style={{ width, height }}>
      {cells.map((cell, idx) => (
        <motion.span key={cell.id} className={`absolute rounded-sm ${cell.tone}`} style={{ width: SIZE, height: SIZE }} initial={prefersReducedMotion ? { x: cell.gridX, y: cell.gridY, rotate: 0, opacity: 1 } : { x: cell.scatterX, y: cell.scatterY, rotate: cell.scatterRotate, opacity: 0.5 }} animate={{ x: cell.gridX, y: cell.gridY, rotate: 0, opacity: 1 }} transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + idx * 0.015 }} />
      ))}
    </div>
  );
}