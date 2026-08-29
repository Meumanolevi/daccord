"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

const variants = {
  primary: "bg-brand text-white border-brand hover:bg-brand-dark",
  secondary: "bg-white text-brand-dark border-brand-border hover:bg-canvas",
  light: "bg-white text-plum border-white hover:bg-canvas",
};

export function AnimatedButton({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  ariaLabel,
}: AnimatedButtonProps) {
  return (
    <motion.a
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`inline-flex min-h-12 items-center justify-center border px-6 py-3 text-center text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      {children}
    </motion.a>
  );
}
