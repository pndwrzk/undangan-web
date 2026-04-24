"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { Users, CheckCircle, XCircle, Heart } from "lucide-react";

export default function OverviewPage() {
  const { status } = useSession();
  const router = useRouter();
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [wishes, setWishes] = useState<any[]>([]);
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
      const [rsvpRes, wishesRes] = await Promise.all([
        fetch("/api/admin/rsvps"),
        fetch("/api/admin/wishes?limit=100")
      ]);
      const rsvpData = await rsvpRes.json();
      const wishesData = await wishesRes.json();
      setRsvps(Array.isArray(rsvpData) ? rsvpData : rsvpData.data || []);
      setWishes(Array.isArray(wishesData) ? wishesData : wishesData.data || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
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
          <m.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5"
          >
            <div className={`p-3 rounded-2xl w-fit mb-4 ${s.color}`}>{s.icon}</div>
            <p className="text-sm font-typewriter uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
            <p className="text-4xl font-serif font-bold">{s.val}</p>
          </m.div>
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
              <m.circle
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
                <m.circle
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
                  <m.div 
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
                  <m.div 
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

      {/* Guest Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Average Guests Per Attendee */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-primary/5">
          <h3 className="text-2xl font-serif mb-6">Guest Distribution</h3>
          <div className="space-y-6">
            {(() => {
              const avgGuests = stats.confirmed > 0 ? (stats.guests / stats.confirmed).toFixed(2) : "0";
              const maxGuests = Math.max(...rsvps.filter((r: any) => r.attendance === 'yes').map((r: any) => r.guests || 1), 0);
              
              return (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-typewriter uppercase tracking-widest text-muted-foreground">Average Guests/Attendee</p>
                      <p className="text-3xl font-serif font-bold text-primary">{avgGuests}</p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <m.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((parseFloat(avgGuests) / 5) * 100, 100)}%` }}
                        className="h-full bg-primary"
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mb-2">Total Guests</p>
                      <p className="text-2xl font-serif font-bold text-blue-600">{stats.guests}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-4">
                      <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mb-2">Attendees</p>
                      <p className="text-2xl font-serif font-bold text-green-600">{stats.confirmed}</p>
                    </div>
                    <div className="bg-amber-50 rounded-2xl p-4">
                      <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mb-2">Max Per Guest</p>
                      <p className="text-2xl font-serif font-bold text-amber-600">{maxGuests}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Response Rate Timeline */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-primary/5">
          <h3 className="text-2xl font-serif mb-6">Response Timeline</h3>
          {(() => {
            // Group RSVPs by date
            const dateGroups: { [key: string]: number } = {};
            rsvps.forEach((r: any) => {
              const date = new Date(r.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
              dateGroups[date] = (dateGroups[date] || 0) + 1;
            });

            const dates = Object.keys(dateGroups).slice(-7); // Last 7 days
            const maxCount = Math.max(...Object.values(dateGroups), 1);

            return (
              <div className="space-y-4">
                {dates.length > 0 ? (
                  <div className="space-y-3">
                    {dates.map((date, i) => (
                      <m.div
                        key={date}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="space-y-1"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-typewriter text-muted-foreground">{date}</p>
                          <p className="text-sm font-serif font-bold">{dateGroups[date]}</p>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <m.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(dateGroups[date] / maxCount) * 100}%` }}
                            className="h-full bg-gradient-to-r from-primary to-primary/50"
                            transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                          />
                        </div>
                      </m.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p className="text-sm font-serif">No RSVP data available</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(() => {
          const responseRate = stats.total > 0 ? ((totalResponded / stats.total) * 100).toFixed(1) : 0;
          const avgGuestsNum = stats.confirmed > 0 ? (stats.guests / stats.confirmed).toFixed(2) : 0;
          const guestRatio = stats.confirmed > 0 ? (stats.guests / stats.confirmed).toFixed(2) : 0;

          return [
            { 
              label: 'Response Rate', 
              value: `${responseRate}%`,
              description: `${totalResponded} of ${stats.total} invited`,
              color: 'from-blue-500 to-blue-600'
            },
            { 
              label: 'Guests Per Attendee', 
              value: guestRatio,
              description: `${stats.guests} total guests`,
              color: 'from-green-500 to-green-600'
            },
            { 
              label: 'Confirmation Rate', 
              value: `${confirmedPct.toFixed(1)}%`,
              description: `${stats.confirmed} confirmed`,
              color: 'from-amber-500 to-amber-600'
            },
          ].map((metric, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5 overflow-hidden relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5`} />
              <div className="relative z-10">
                <p className="text-sm font-typewriter uppercase tracking-widest text-muted-foreground mb-2">{metric.label}</p>
                <p className="text-4xl font-serif font-bold mb-1">{metric.value}</p>
                <p className="text-xs text-muted-foreground font-serif italic">{metric.description}</p>
              </div>
            </m.div>
          ));
        })()}
      </div>

      {/* Top 5 Wishes by Likes */}
      <div className="mt-12">
        <h2 className="text-3xl font-serif mb-6">Top Wishes by Likes</h2>
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-primary/5">
          {(() => {
            const topWishes = wishes
              .sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0))
              .slice(0, 5);

            if (topWishes.length === 0) {
              return (
                <div className="py-12 text-center text-muted-foreground">
                  <p className="text-sm font-serif">No wishes yet. Guests' wishes will appear here.</p>
                </div>
              );
            }

            const maxLikes = Math.max(...topWishes.map((w: any) => w.likes || 0), 1);

            return (
              <div className="space-y-4">
                {topWishes.map((wish: any, i: number) => (
                  <m.div
                    key={wish.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 pb-4 border-b border-primary/5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0 mt-1">
                      <span className="text-lg font-serif font-bold text-primary">#{i + 1}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-bold text-sm text-slate-900 line-clamp-1">{wish.name}</p>
                          <p className="text-xs text-muted-foreground font-typewriter tracking-tight mt-0.5">
                            {wish.guest?.name ? `From: ${wish.guest.name}` : 'Anonymous'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 bg-red-50 px-2.5 py-1.5 rounded-full">
                          <Heart size={14} className="fill-red-500 text-red-500" />
                          <span className="text-sm font-bold text-red-600">{wish.likes || 0}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground font-serif line-clamp-2 mb-2">{wish.message}</p>
                      
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <m.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((wish.likes || 0) / maxLikes) * 100}%` }}
                          className="h-full bg-gradient-to-r from-red-500 to-red-400"
                          transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 + 0.2 }}
                        />
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
