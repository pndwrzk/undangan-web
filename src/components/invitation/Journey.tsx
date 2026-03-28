"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Calendar, Star, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { Story as StoryType } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TornEdge from "@/components/invitation/TornEdge";
import { useLanguage } from "@/components/providers/LanguageProvider";

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
  const { t } = useLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const textX = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  if (!stories || stories.length === 0) return null;

  const displayStories = stories.map((s, i) => ({
    ...s,
    icon: iconMap[s.icon as string] || <Heart className="w-5 h-5" />,
    rotate: i % 2 === 0 ? "-rotate-2" : "rotate-3"
  })) as (Omit<StoryType, 'icon'> & { icon: React.ReactNode; rotate: string })[];

  return (
    <section id="story" ref={sectionRef} className="py-16 px-6 bg-muted/5 relative overflow-hidden">
      <TornEdge position="top" color="fill-background" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-primary mb-6 block">{t.story.title}</span>
          
          <p className="text-muted-foreground font-serif italic text-base md:text-lg leading-relaxed mb-6">
            {t.story.intro}
          </p>

          <div className="w-24 h-[1px] bg-primary/20 mx-auto" />
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-primary/20" />

          {/* Milestones */}
          <div className="space-y-12 md:space-y-16">
            {displayStories.map((item, index) => (
              <div key={index} className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex-1 text-left"
                >
                  <div className={`flex flex-col items-start ${index % 2 === 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                    <span className="font-typewriter text-xs uppercase tracking-widest text-primary mb-4 block">{item.date}</span>
                    <h3 className="text-3xl font-serif mb-4">{item.title}</h3>
                    <p className="text-muted-foreground font-serif italic leading-relaxed max-w-sm">
                      "{item.description}"
                    </p>
                  </div>
                </motion.div>

                {/* Center Icon */}
                <div className="absolute left-8 -translate-x-1/2 top-0 md:relative md:left-0 md:translate-x-0 md:top-auto z-10 font-sans flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-background border border-primary/20 shadow-xl text-primary shrink-0">
                  {item.icon}
                </div>

                {/* Photo */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex-1 flex justify-start md:justify-center"
                >
                  <div 
                    onClick={() => setSelectedPhoto(item)}
                    className={`relative w-64 h-64 p-3 bg-white shadow-2xl transform ${item.rotate} hover:rotate-0 transition-transform duration-500 cursor-pointer group`}
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={item.image || "/hero-bg.png"}
                        alt={item.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        unoptimized
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

        {/* Lightbox */}
        <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
          <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none ring-0">
            <div className="relative w-full aspect-[4/5] md:aspect-video flex items-center justify-center">
              {selectedPhoto && (
                <Image
                  src={selectedPhoto.image || "/hero-bg.png"}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              )}
            </div>
            {selectedPhoto && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-white text-center">
                <p className="font-serif text-lg">{selectedPhoto.title}</p>
                <p className="text-xs font-typewriter uppercase tracking-widest opacity-80">{selectedPhoto.date}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Background Decorative Text */}
      <motion.div 
        style={{ x: textX }}
        className="absolute top-1/2 left-0 -translate-y-1/2 text-[25vw] md:text-[15vw] font-serif font-black opacity-[0.03] md:opacity-[0.02] -rotate-90 select-none pointer-events-none whitespace-nowrap"
      >
        LOVE STORY
      </motion.div>
    </section>
  );
}
