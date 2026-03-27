"use client";

import { motion } from "framer-motion";
import { Heart, Calendar, Star, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { Story as StoryType } from "@/types";


const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
};

interface JourneyProps {
  stories?: StoryType[];
}

export default function Journey({ stories }: JourneyProps) {
  if (!stories || stories.length === 0) return null;

  const displayStories = stories.map((s, i) => ({
    ...s,
    icon: iconMap[s.icon as string] || <Heart className="w-5 h-5" />,
    rotate: i % 2 === 0 ? "-rotate-2" : "rotate-3"
  })) as (Omit<StoryType, 'icon'> & { icon: React.ReactNode; rotate: string })[];

  return (
    <section className="py-32 px-6 bg-muted/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-primary mb-4 block">Our Story</span>
          <h2 className="text-5xl md:text-7xl font-serif mb-6">Journey of Love</h2>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto" />
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-primary/20 hidden md:block" />

          {/* Milestones */}
          <div className="space-y-24 md:space-y-40">
            {displayStories.map((item, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex-1 text-center md:text-left"
                >
                  <div className={`flex flex-col ${index % 2 === 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                    <span className="font-typewriter text-xs uppercase tracking-widest text-primary mb-4 block">{item.date}</span>
                    <h3 className="text-3xl font-serif mb-4">{item.title}</h3>
                    <p className="text-muted-foreground font-serif italic leading-relaxed max-w-sm">
                      "{item.description}"
                    </p>
                  </div>
                </motion.div>

                {/* Center Icon */}
                <div className="relative z-10 font-sans hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-background border border-primary/20 shadow-xl text-primary shrink-0">
                  {item.icon}
                </div>

                {/* Photo */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex-1 flex justify-center"
                >
                  <div className={`relative w-64 h-64 p-3 bg-white shadow-2xl transform ${item.rotate} hover:rotate-0 transition-transform duration-500`}>
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={item.image || "/hero-bg.png"}
                        alt={item.title}
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    {/* Tape Effect */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-black/5 opacity-50 rotate-1" />
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-black opacity-[0.02] -rotate-90 select-none pointer-events-none">
        LOVE STORY
      </div>
    </section>
  );
}
