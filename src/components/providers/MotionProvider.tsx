"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { ReactNode } from "react";

/**
 * Motion Provider with LazyMotion
 * Reduces Framer Motion bundle size by ~30KB
 * 
 * Usage: Wrap your app with this provider, then use 'm' instead of 'motion'
 * 
 * Before: import { motion } from "framer-motion"
 * After: import { m } from "framer-motion"
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
