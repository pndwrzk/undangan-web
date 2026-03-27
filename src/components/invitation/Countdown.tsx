"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Countdown({ couple }: { couple: any }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDateStr = couple?.weddingDate ? new Date(couple.weddingDate).toISOString() : "2026-09-12T09:00:00";
    const targetDate = new Date(targetDateStr).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimerBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 md:w-20 md:h-20 bg-background border border-primary/20 rounded-2xl flex items-center justify-center shadow-lg mb-2">
        <span className="text-xl md:text-3xl font-serif text-foreground">{value}</span>
      </div>
      <span className="font-typewriter text-[10px] md:text-xs uppercase tracking-widest text-primary">{label}</span>
    </div>
  );

  return (
    <section className="py-16 px-6 bg-background relative border-y border-primary/10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif mb-8 italic">Counting down to the big day</h2>
          
          <div className="flex justify-center gap-4 md:gap-8">
            <TimerBox value={timeLeft.days} label="Days" />
            <TimerBox value={timeLeft.hours} label="Hours" />
            <TimerBox value={timeLeft.minutes} label="Mins" />
            <TimerBox value={timeLeft.seconds} label="Secs" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
