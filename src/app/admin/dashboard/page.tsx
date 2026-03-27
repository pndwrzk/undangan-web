"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, CheckCircle, XCircle, Heart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      const rsvpRes = await fetch("/api/admin/rsvps");
      const wishesRes = await fetch("/api/admin/wishes");
      
      const rsvpData = await rsvpRes.json();
      const wishesData = await wishesRes.json();
      
      setRsvps(Array.isArray(rsvpData) ? rsvpData : []);
      setWishes(Array.isArray(wishesData) ? wishesData : []);
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
    guests: rsvps.reduce((acc: any, r: any) => acc + (r.attendance === 'yes' ? parseInt(r.guests) : 0), 0)
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent RSVPs */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif">Recent RSVPs</h2>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-typewriter">{rsvps.length} Total</span>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-muted/30">
                  <TableHead className="px-6 py-4">Guest Name</TableHead>
                  <TableHead className="px-6 py-4">Attendance</TableHead>
                  <TableHead className="px-6 py-4">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((rsvp, idx) => (
                  <TableRow key={idx} className="font-serif text-sm">
                    <TableCell className="px-6 py-4 font-bold">{rsvp.name}</TableCell>
                    <TableCell className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${rsvp.attendance === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {rsvp.attendance === 'yes' ? 'Attending' : 'Declined'}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground text-xs">{new Date(rsvp.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {rsvps.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="px-6 py-12 text-center text-muted-foreground font-serif italic">No RSVP responses yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>
          </div>
        </section>

        {/* Recent Wishes */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif">Guest Wishes</h2>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-typewriter">{wishes.length} Total</span>
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
            {wishes.map((wish, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/5 rounded-full text-primary">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <p className="font-serif font-bold mb-1">{wish.name}</p>
                    <p className="text-sm font-serif italic text-muted-foreground leading-relaxed">&quot;{wish.message}&quot;</p>
                    <p className="mt-3 text-[10px] font-typewriter text-muted-foreground/50 uppercase tracking-widest">{new Date(wish.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {wishes.length === 0 && (
              <div className="bg-white p-12 text-center text-muted-foreground font-serif italic rounded-3xl border border-primary/5">
                No wishes in the guestbook yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
