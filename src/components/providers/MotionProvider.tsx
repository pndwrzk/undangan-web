"use client";

import { LazyMotion, domMax } from "framer-motion";
import { ReactNode } from "react";

/**
 * Motion Provider with LazyMotion
 * Uses domMax to support drag gestures
 * 
 * Usage: Wrap your app with this provider, then use 'm' instead of 'motion'
 * 
 * Before: import { motion } from "framer-motion"
 * After: import { m } from "framer-motion"
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
