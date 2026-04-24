"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, MapPin, ExternalLink, Bell, Sparkles, Heart } from "lucide-react";
import TornEdge from "@/components/invitation/TornEdge";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Couple as CoupleType, Event as EventType } from "@/types";
import { Z_INDEX } from "@/lib/z-index";

export default function EventDetails({ events, couple }: { events?: EventType[], couple: CoupleType | null }) {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
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
      <div className="w-14 h-14 md:w-20 md:h-20 bg-[#ebeadf] rounded-xl flex items-center justify-center shadow-lg mb-3 border border-transparent">
        <span className="text-xl md:text-3xl font-serif text-[#505b24] font-bold">{value}</span>
      </div>
      <span className="font-typewriter text-[10px] md:text-xs uppercase tracking-widest text-white/90 font-bold">{label}</span>
    </div>
  );

  return (
    <div id="event">
      {/* SECTION 1: COUNTDOWN */}
      <section
        id="event-countdown"
        ref={sectionRef}
        style={{ zIndex: Z_INDEX.SECTION_BASE }}
        className="py-8 md:py-12 bg-[#fcfaf3] relative -mt-[2px] overflow-hidden"
      >
        <m.div
          style={{
            y: backgroundY,
            backgroundImage: "url('/images/parallex_bg.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
            height: "140%", // Taller than container
            top: "-20%",    // Offset to center
          }}
          className="absolute inset-x-0 z-0 pointer-events-none"
        />
        <TornEdge position="top" color="fill-muted/5" />
        <div style={{ zIndex: Z_INDEX.BASE_CONTENT }} className="max-w-6xl mx-auto relative">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <span className="font-arabic text-[20px] md:text-3xl text-primary mb-6 md:mb-8 block leading-[1.6] md:leading-[1.8] drop-shadow-sm px-4" dir="rtl">
              {t.event.sectionLabel}
            </span>
            <h2 className="md:text-[15px] text-[13px] text-primary/70 md:text-sm font-typewriter mb-4 md:mb-6 text-muted-foreground leading-snug max-w-2xl mx-auto px-6 opacity-90 font-semibold">
              "{t.event.title.split(' (')[0]}"
              <span className="block text-[9px] md:text-[10px] font-typewriter uppercase tracking-[0.3em] mt-3 md:mt-4 not-italic opacity-60">
                {t.event.title.includes('(') ? `(${t.event.title.split(' (')[1]}` : ''}
              </span>
            </h2>
            <div className="w-12 md:w-16 h-[1px] bg-primary/10 mx-auto" />
          </m.div>



          {/* Unified Countdown Card */}

        </div>
      </section>

      {/* SECTION 2: EVENT PLANNING */}
      <section id="event-planning" style={{ zIndex: Z_INDEX.SECTION_CONTENT }} className="py-16  md:py-24 px-6 md:px-12 lg:px-24 bg-[#fcfaf3] relative -mt-[2px] overflow-hidden">
        <span style={{ zIndex: Z_INDEX.BASE_CONTENT }} className="block mx-auto font-serif italic text-base md:text-md text-primary/90 max-w-lg md:text-[16px] text-[14px] text-center leading-relaxed relative mb-8 md:mb-12">
          {t.event.eventPlanning}
        </span>
        <div style={{ zIndex: Z_INDEX.BASE_CONTENT }} className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
            {events.map((ev, idx) => (
              <m.div
                key={ev.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + (idx * 0.2) }}
                className="flex flex-col bg-background p-6 sm:p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-lg border border-primary/5 group hover:border-primary/20 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="p-2.5 md:p-3 rounded-xl bg-primary/10 text-primary">
                    <Calendar size={20} className="md:w-6 md:h-6" />
                  </div>
                  <span className="font-typewriter text-[8px] md:text-[9px] uppercase tracking-widest px-2.5 py-0.5 bg-accent/10 rounded-full">{ev.title}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-serif mb-3 md:mb-4">{ev.subtitle || ev.title}</h3>

                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3">
                    <Clock className="text-primary mt-1 shrink-0" size={16} />
                    <div>
                      <p className="font-bold text-foreground text-sm md:text-base ">{ev.time}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{ev.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary mt-1 shrink-0" size={16} />
                    <div>
                      <p className="font-bold text-foreground leading-snug text-sm md:text-base ">{ev.location}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{ev.address}</p>
                    </div>
                  </div>
                </div>



                {ev.mapUrl && (
                  <a
                    href={ev.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 w-full py-3 bg-primary text-white flex items-center justify-center gap-2 rounded-lg font-sans uppercase tracking-[0.1em] text-[10px] hover:bg-primary/90 transition-all group-hover:shadow-md"
                  >
                    <ExternalLink size={12} />
                    {t.event.viewMap}
                  </a>
                )}
              </m.div>
            ))}
          </div>

        </div>


      </section>

      <div className="py-16 px-[25px]   md:px-[100px] bg-[#f6f3e8]">  <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center justify-center bg-[#505b24] p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-xl w-full relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <m.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-10 w-40 h-30 bg-white/30 rounded-full blur-3xl pointer-events-none"
        />
        <div className="text-[#ebeadf] md:text-[16px] text-[14px] font-semibold"> {language === "id" ? "SAVE THE DATE!" : "SAVE THE DATE!"}</div>
        <m.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none"
        />

        <span style={{ zIndex: Z_INDEX.BASE_CONTENT }} className="block mx-auto font-serif italic text-sm md:text-lg text-white/90 max-w-lg text-center leading-relaxed relative mb-8 md:mb-10">

        </span>

        <div style={{ zIndex: Z_INDEX.BASE_CONTENT }} className="flex justify-center gap-4 mb-8 md:mb-10 relative">
          <TimerBox value={timeLeft.days} label={language === "id" ? "Hari" : "Days"} />
          <TimerBox value={timeLeft.hours} label={language === "id" ? "Jam" : "Hours"} />
          <TimerBox value={timeLeft.minutes} label={language === "id" ? "Menit" : "Mins"} />
          <TimerBox value={timeLeft.seconds} label={language === "id" ? "Detik" : "Secs"} />
        </div>

        <a
          href={generateCalendarLink()}
          target="_blank"
          rel="noopener noreferrer"
          style={{ zIndex: Z_INDEX.BASE_CONTENT }}
          className="w-full max-w-xs py-4 bg-[#ebeadf] border border-transparent rounded-xl text-[#505b24] font-bold font-sans flex items-center justify-center gap-2 hover:bg-[#ebeadf]/90 transition-all shadow-md uppercase tracking-[0.1em] text-[10px] relative"
        >
          <Bell size={14} />
          {language === "id" ? "Remind Me" : "Remind Me"}
        </a>
      </m.div></div>
    </div>

  );
}
