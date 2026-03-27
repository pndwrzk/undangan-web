"use client";

import { motion } from "framer-motion";
import { Home, Heart, Calendar, MessageSquare } from "lucide-react";

const navItems = [
  { id: "hero", icon: <Home className="w-5 h-5" />, label: "Home" },
  { id: "couple", icon: <Heart className="w-5 h-5" />, label: "Couple" },
  { id: "event", icon: <Calendar className="w-5 h-5" />, label: "Event" },
  { id: "rsvp", icon: <MessageSquare className="w-5 h-5" />, label: "RSVP" },
];

export default function BottomNav() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 2, duration: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] md:hidden"
    >
      <nav className="bg-white/80 backdrop-blur-lg border border-primary/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors focus:outline-none group"
          >
            <div className="p-2 rounded-full group-hover:bg-primary/5 transition-all">
              {item.icon}
            </div>
            <span className="text-[10px] font-typewriter uppercase tracking-tighter">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </motion.div>
  );
}
