"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const hidden = direction === "right"
    ? { opacity: 0, x: "7%", y: 0 }
    : { opacity: 0, x: 0, y: "7%" };

  return (
    <motion.div
      className={className}
      initial={false}
      animate={reduceMotion
        ? { opacity: active ? 1 : 0 }
        : active
          ? { opacity: 1, x: 0, y: 0 }
          : hidden}
      transition={{ duration: reduceMotion ? 0.01 : 0.72, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!active}
      inert={!active}
      style={{
        pointerEvents: active ? "auto" : "none",
        willChange: reduceMotion ? "auto" : "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}
