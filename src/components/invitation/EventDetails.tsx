"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, ExternalLink, Bell, Sparkles, Heart } from "lucide-react";
import TornEdge from "@/components/invitation/TornEdge";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Couple as CoupleType, Event as EventType } from "@/types";

export default function EventDetails({ events, couple }: { events?: EventType[], couple: CoupleType | null }) {
  const { t, language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    if (!couple?.weddingDate) return;
    
    // Parse the base date (e.g., "2026-09-12")
    const weddingDate = new Date(couple.weddingDate);
    
    // Default to a safe morning time if no specific time is found
    let startHour = 8;
    let startMin = 0;
    
    if (events && events[0]?.time) {
      // Handle both 09:00 and 09.00 formats
      const timeMatch = events[0].time.match(/(\d{2})[:.](\d{2})/);
      if (timeMatch) {
        startHour = parseInt(timeMatch[1]);
        startMin = parseInt(timeMatch[2]);
      }
    }
    
    // Create target date using local date components to avoid UTC shifts
    const targetDate = new Date(
      weddingDate.getFullYear(),
      weddingDate.getMonth(),
      weddingDate.getDate(),
      startHour,
      startMin,
      0
    );

    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, [couple?.weddingDate, events]);

  if (!events || events.length === 0) return null;

  const generateCalendarLink = () => {
    try {
      if (!events || !events[0] || !couple?.weddingDate) return "https://calendar.google.com";
      
      const title = encodeURIComponent(`The Wedding of ${couple.brideAlias || couple.brideName} & ${couple.groomAlias || couple.groomName}`);
      const location = events[0]?.location ? encodeURIComponent(events[0].location) : "";
      
      // Get safe date string (YYYYMMDD)
      const d = new Date(couple.weddingDate);
      if (isNaN(d.getTime())) return "https://calendar.google.com";
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${date}`;
      
      // Start time parsing: match "09:00" or "09.00"
      const startTimeStr = events[0].time || "09:00";
      const timeMatch = startTimeStr.match(/(\d{2})[:.](\d{2})/);
      const startHour = timeMatch ? timeMatch[1] : "09";
      const startMin = timeMatch ? timeMatch[2] : "00";
      
      // Standard format YYYYMMDDTHHMMSS
      const start = `${dateStr}T${startHour}${startMin}00`;
      const endHour = String(parseInt(startHour) + 3).padStart(2, '0');
      const end = `${dateStr}T${endHour}${startMin}00`;

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=Wedding+Invitation&location=${location}&dates=${start}/${end}`;
    } catch (e) {
      console.error("Error generating calendar link:", e);
      return "https://calendar.google.com";
    }
  };

  const TimerBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 md:w-20 md:h-20 bg-[#556B2F] rounded-xl flex items-center justify-center shadow-lg mb-3 border border-white/10">
        <span className="text-xl md:text-3xl font-serif text-white">{value}</span>
      </div>
      <span className="font-typewriter text-[10px] md:text-[11px] uppercase tracking-widest text-primary/60 font-bold">{label}</span>
    </div>
  );

  return (
    <section id="event" className="pt-20 md:pt-32 pb-16 md:pb-24 px-6 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      <TornEdge position="top" color="fill-muted/5" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="font-arabic text-2xl md:text-3xl text-primary mb-8 md:mb-10 block leading-[1.6] md:leading-[1.8] drop-shadow-sm px-4" dir="rtl">
            {t.event.sectionLabel}
          </span>
          <h2 className="text-base md:text-lg font-serif mb-6 text-muted-foreground italic leading-snug max-w-2xl mx-auto px-6 opacity-90">
            "{t.event.title.split(' (')[0]}"
            <span className="block text-[9px] md:text-[10px] font-typewriter uppercase tracking-[0.3em] mt-3 md:mt-4 not-italic opacity-40">
              {t.event.title.includes('(') ? `(${t.event.title.split(' (')[1]}` : ''}
            </span>
          </h2>
          <div className="w-12 md:w-16 h-[1px] bg-primary/10 mx-auto mb-10 md:mb-16" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch mb-12 md:mb-20">
          {events.map((ev, idx) => (
            <motion.div
              key={ev.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 + (idx * 0.2) }}
              className="flex flex-col bg-background p-6 sm:p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-lg border border-primary/5 group hover:border-primary/20 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="p-2.5 md:p-3 rounded-xl bg-primary/10 text-primary">
                  {idx % 2 === 0 ? <Calendar size={20} className="md:w-6 md:h-6" /> : <Clock size={20} className="md:w-6 md:h-6" />}
                </div>
                <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-widest px-2.5 py-0.5 bg-accent/10 rounded-full">{ev.title}</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-serif mb-3 md:mb-4">{ev.subtitle || ev.title}</h3>
              
              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-3">
                  <Clock className="text-primary mt-1 shrink-0" size={16} />
                  <div>
                    <p className="font-bold text-foreground text-sm md:text-base">{ev.time}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{ev.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1 shrink-0" size={16} />
                  <div>
                    <p className="font-bold text-foreground leading-snug text-sm md:text-base">{ev.location}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ev.address}</p>
                  </div>
                </div>
              </div>

              {ev.mapUrl && (
                <a
                  href={ev.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 w-full py-3 bg-primary text-white flex items-center justify-center gap-2 rounded-lg font-serif uppercase tracking-[0.2em] text-[10px] hover:bg-primary/90 transition-all group-hover:shadow-md"
                >
                  <ExternalLink size={12} />
                  {t.event.viewMap}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Unified Countdown Card at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm p-8 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/10 shadow-sm w-full relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.08, 0.05]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none"
          />
          <Sparkles className="absolute top-6 left-6 text-primary/10 animate-pulse" size={24} />
          <Heart className="absolute bottom-6 right-6 text-primary/10 animate-bounce" size={20} style={{ animationDuration: '3s' }} />

          <span className="font-serif italic text-sm text-primary/60 max-w-lg text-center leading-relaxed relative z-10">
            {t.couple.requestRestu}
          </span>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-6 mb-10 relative z-10" />
          
          <div className="flex justify-center gap-4 mb-10 relative z-10">
            <TimerBox value={timeLeft.days} label={language === "id" ? "Hari" : "Days"} />
            <TimerBox value={timeLeft.hours} label={language === "id" ? "Jam" : "Hours"} />
            <TimerBox value={timeLeft.minutes} label={language === "id" ? "Menit" : "Mins"} />
          </div>

          <a
            href={generateCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs py-4 bg-white border border-primary/20 rounded-xl text-primary font-serif flex items-center justify-center gap-2 hover:bg-primary/5 transition-all shadow-sm uppercase tracking-[0.1em] text-[10px] relative z-10"
          >
            <Bell size={14} />
            {language === "id" ? "Simpan Tanggal" : "Save the Date"}
          </a>
        </motion.div>
      </div>
      
      {/* Background Motif */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] md:text-[15vw] font-serif italic opacity-[0.03] md:opacity-[0.02] pointer-events-none select-none z-0 -rotate-90">
        {t.event.decorativeTitle}
      </div>
    </section>
  );
}
