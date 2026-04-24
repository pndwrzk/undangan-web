"use client";

import { m, AnimatePresence } from "framer-motion";
import { Home, Heart, Calendar, MessageSquare } from "lucide-react";
import { Z_INDEX } from "@/lib/z-index";
import { useState, useEffect } from "react";

const navItems = [
  { id: "hero", icon: <Home className="w-4 h-4" />, label: "Home" },
  { id: "couple", icon: <Heart className="w-4 h-4" />, label: "Couple" },
  { id: "event", icon: <Calendar className="w-4 h-4" />, label: "Event" },
  { id: "rsvp", icon: <MessageSquare className="w-4 h-4" />, label: "RSVP" },
];

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState("hero");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleActivity = () => {
      setIsVisible(true);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    // Initial timer
    timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    const scrollHandler = handleActivity;
    const clickHandler = handleActivity;
    const touchHandler = handleActivity;

    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener("click", clickHandler);
    window.addEventListener("touchstart", touchHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("touchstart", touchHandler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const observers: (IntersectionObserver | null)[] = [];

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveTab(item.id);
            }
          });
        },
        { threshold: [0.3, 0.5, 0.7], rootMargin: "-20% 0px -20% 0px" }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.disconnect();
      });
    };
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <m.div
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 120 }}
      transition={{ 
        duration: 0.8,
        ease: "easeInOut",
        delay: isVisible ? 0 : 0.2
      }}
      style={{ zIndex: Z_INDEX.BOTTOM_NAV }}
      className={`fixed bottom-0 left-0 right-0 md:hidden ${isVisible ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Delicate Gold Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      
      <nav className="bg-[#FDFCF0] border-t border-primary/10 rounded-t-[2rem] px-6 py-2 pb-5 flex items-center justify-around shadow-[0_-10px_40px_-10px_rgba(85,107,47,0.15)]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                scrollTo(item.id);
              }}
              className="relative flex flex-col items-center gap-1 focus:outline-none py-1.5 min-w-[64px]"
            >
              <div 
                className={`p-1 rounded-full transition-all duration-500 relative ${
                  isActive ? "text-primary scale-110" : "text-muted-foreground/40 group-hover:text-primary/40"
                }`}
              >
                {item.icon}
              </div>
              
              <span 
                className={`text-[9px] font-typewriter uppercase tracking-[0.15em] transition-all duration-500 ${
                  isActive ? "text-primary font-bold" : "text-muted-foreground/40"
                }`}
              >
                {item.label}
              </span>

              {/* Sophisticated Sliding Underline */}
              {isActive && (
                <m.div
                  layoutId="activeUnderline"
                  className="absolute bottom-1 w-8 h-[1.5px] bg-accent rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </m.div>
  );
}
