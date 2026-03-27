"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import { submitWish } from "@/lib/actions";

import { Guest as GuestType, Guestbook as GuestbookType } from "@/types";

export default function Guestbook({ guest }: { guest?: GuestType | null }) {
  const [messages, setMessages] = useState<GuestbookType[]>([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const res = await fetch("/api/guestbook");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch wishes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest || !newText) return;

    const result = await submitWish({ name: guest.name, message: newText });

    if (result.success) {
      setMessages([result.data as any, ...messages]);
      setNewText("");
    } else {
      alert("Failed to send wishes. Please try again.");
    }
  };

  return (
    <section className="py-32 px-6 bg-muted/20 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-primary mb-4 block">Wishes</span>
          <h2 className="text-5xl md:text-7xl font-serif mb-6">Guestbook</h2>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Form */}
          <div className="md:col-span-1">
            {!guest ? (
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-primary/10 text-center sticky top-8">
                <h3 className="text-xl font-serif mb-4 text-red-500">Access Restricted</h3>
                <p className="text-sm text-muted-foreground font-serif">
                  Please use your unique invitation link to send wishes to the couple.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sticky top-8">
                <div className="bg-background border-none shadow-sm rounded-xl py-6 px-4 text-muted-foreground font-serif italic text-sm text-center">
                  Posting as <span className="font-bold text-primary not-italic">{guest.name}</span>
                </div>
                <Textarea
                  placeholder="Give your wishes for the couple..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="bg-background border-none shadow-sm rounded-xl min-h-[150px] py-4"
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 shadow-md">
                  Send Wishes
                </Button>
              </form>
            )}
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground font-serif italic">Loading wishes...</div>
            ) : (
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-background p-6 rounded-2xl shadow-sm border border-primary/5 hover:border-primary/10 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <MessageSquare size={14} />
                      <span className="text-sm font-bold font-serif">{msg.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-3 font-serif leading-relaxed">"{msg.message}"</p>
                    <span className="font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground/50">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </motion.div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground font-serif italic">No wishes yet. Be the first!</div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
