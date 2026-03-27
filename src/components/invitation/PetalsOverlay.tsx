"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PETAL_COUNT = 15;

export default function PetalsOverlay() {
  const [petals, setPetals] = useState<any[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: PETAL_COUNT }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 20,
      size: 10 + Math.random() * 15,
      rotateInitial: Math.random() * 360,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ 
            top: "-10%", 
            left: petal.left, 
            opacity: 0, 
            rotate: petal.rotateInitial 
          }}
          animate={{ 
            top: "110%", 
            left: [petal.left, `${parseFloat(petal.left) + (Math.random() * 20 - 10)}%`],
            opacity: [0, 0.4, 0.4, 0],
            rotate: petal.rotateInitial + 720
          }}
          transition={{ 
            duration: petal.duration, 
            repeat: Infinity, 
            delay: petal.delay,
            ease: "linear"
          }}
          className="absolute text-primary/20 select-none"
          style={{ fontSize: petal.size }}
        >
          {/* Subtle floral/petal shape using SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12 2 15 7 15 12C15 17 12 22 12 22C12 22 9 17 9 12C9 7 12 2 12 2Z" className="opacity-40" />
            <path d="M22 12C22 12 17 15 12 15C7 15 2 12 2 12C2 12 7 9 12 9C17 9 22 12 22 12Z" className="opacity-20" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
