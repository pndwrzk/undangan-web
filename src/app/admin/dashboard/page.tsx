"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle } from "lucide-react";

export default function OverviewPage() {
  const { status } = useSession();
  const router = useRouter();
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const rsvpRes = await fetch("/api/admin/rsvps");
      const rsvpData = await rsvpRes.json();
      setRsvps(Array.isArray(rsvpData) ? rsvpData : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    total: rsvps.length,
    confirmed: rsvps.filter((r: any) => r.attendance === 'yes').length,
    declined: rsvps.filter((r: any) => r.attendance === 'no').length,
    guests: rsvps.reduce((acc: any, r: any) => acc + (r.attendance === 'yes' ? parseInt(r.guests || "1") : 0), 0)
  };

  const totalResponded = stats.confirmed + stats.declined;
  const confirmedPct = totalResponded > 0 ? (stats.confirmed / totalResponded) * 100 : 0;
  const declinedPct = totalResponded > 0 ? (stats.declined / totalResponded) * 100 : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total RSVP', val: stats.total, icon: <Users />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Confirmed', val: stats.confirmed, icon: <CheckCircle />, color: 'bg-green-50 text-green-600' },
          { label: 'Declined', val: stats.declined, icon: <XCircle />, color: 'bg-red-50 text-red-600' },
          { label: 'Total Guests', val: stats.guests, icon: <Users />, color: 'bg-amber-50 text-amber-600' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5"
          >
            <div className={`p-3 rounded-2xl w-fit mb-4 ${s.color}`}>{s.icon}</div>
            <p className="text-sm font-typewriter uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
            <p className="text-4xl font-serif font-bold">{s.val}</p>
          </motion.div>
        ))}
      </div>

      {/* Attendance Chart */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-primary/5 mb-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="relative w-64 h-64">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="12"
              />
              {/* Confirmed Segment */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="var(--primary)"
                strokeWidth="12"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * confirmedPct) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
              {/* Declined Segment */}
              {declinedPct > 0 && (
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * declinedPct) / 100 }}
                  style={{ rotate: (confirmedPct * 3.6) }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  strokeLinecap="round"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-3xl font-serif font-bold">{totalResponded}</p>
              <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground">Responses</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <h3 className="text-2xl font-serif">Attendance Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <p className="text-sm font-typewriter uppercase tracking-widest">Attending</p>
                </div>
                <p className="text-3xl font-serif font-bold">{stats.confirmed}</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${confirmedPct}%` }}
                    className="h-full bg-primary" 
                  />
                </div>
                <p className="text-xs text-muted-foreground font-serif italic text-right">{confirmedPct.toFixed(1)}%</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <p className="text-sm font-typewriter uppercase tracking-widest">Not Attending</p>
                </div>
                <p className="text-3xl font-serif font-bold">{stats.declined}</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${declinedPct}%` }}
                    className="h-full bg-red-500" 
                  />
                </div>
                <p className="text-xs text-muted-foreground font-serif italic text-right">{declinedPct.toFixed(1)}%</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground font-serif italic pt-4 border-t border-primary/5">
              Current attendance rate is <span className="text-primary font-bold">{confirmedPct.toFixed(1)}%</span> from {totalResponded} responses received.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
