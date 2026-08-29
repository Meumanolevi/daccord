"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type ScrollStageRevealProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
  direction?: "right" | "up";
};

export function ScrollStageReveal({
  active,
  children,
  className,
  direction = "right",
}: ScrollStageRevealProps) {
  const reduceMotion = useReducedMotion();
  const initial = direction === "right"
    ? { opacity: 0, x: "18%", clipPath: "inset(0 0 0 100%)" }
    : { opacity: 0, y: "18%", clipPath: "inset(100% 0 0 0)" };

  return (
    <AnimatePresence initial={false}>
      {active ? (
        <motion.div
          className={className}
          initial={reduceMotion ? false : initial}
          animate={{ opacity: 1, x: 0, y: 0, clipPath: "inset(0 0 0 0)" }}
          exit={reduceMotion ? { opacity: 0 } : initial}
          transition={{ duration: reduceMotion ? 0.01 : 0.86, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
