"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { submitWish, toggleLikeGuestbookMessage } from "@/lib/actions";
import { useLanguage } from "@/components/providers/LanguageProvider";

import { Guest as GuestType, Guestbook as GuestbookType } from "@/types";

export default function Guestbook({ guest }: { guest?: GuestType | null }) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<GuestbookType[]>([]);
  const [newName, setNewName] = useState("");
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [likedMessages, setLikedMessages] = useState<string[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchWishes(1);
  }, [guest?.id]);

  const fetchWishes = async (page: number) => {
    setLoading(true);
    try {
      const url = `/api/guestbook?page=${page}&limit=5${guest?.id ? `&guestId=${guest.id}` : ""}`;
      const res = await fetch(url);
      const result = await res.json();
      
      setMessages(result.data);
      setTotalCount(result.total);
      setTotalPages(result.pages);
      setCurrentPage(result.currentPage);
      if (result.likedByGuest) {
        setLikedMessages(result.likedByGuest);
      }
    } catch (error) {
      console.error("Failed to fetch wishes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchWishes(page);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitWish({ 
      name: newName || "Anonymous", 
      message: newText,
      guestId: guest?.id 
    });

    if (result.success) {
      setNewText("");
      setNewName("");
      fetchWishes(1); // Go to first page to see the new message
    } else {
      alert("Failed to send wishes. Please try again.");
    }
  };

  const handleLike = async (messageId: string) => {
    if (!guest?.id) return;

    const isCurrentlyLiked = likedMessages.includes(messageId);
    
    // Optimistic update
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: isCurrentlyLiked ? Math.max(0, (msg.likes || 1) - 1) : (msg.likes || 0) + 1 } 
        : msg
    ));
    
    const newLiked = isCurrentlyLiked 
      ? likedMessages.filter(id => id !== messageId) 
      : [...likedMessages, messageId];
      
    setLikedMessages(newLiked);

    const result = await toggleLikeGuestbookMessage(messageId, guest.id);
    if (!result.success) {
      // Revert if failed
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, likes: isCurrentlyLiked ? (msg.likes || 0) + 1 : Math.max(0, (msg.likes || 1) - 1) } 
          : msg
      ));
      const revertedLiked = isCurrentlyLiked 
        ? [...likedMessages, messageId] 
        : likedMessages.filter(id => id !== messageId);
      setLikedMessages(revertedLiked);
      alert("Failed to update like.");
    }
  };

  // Helper for page numbers
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentPage === i 
                ? "bg-primary text-white shadow-md scale-110" 
                : "bg-background hover:bg-muted text-muted-foreground"
            } text-sm font-bold font-serif`}
          >
            {i}
          </button>
        );
    }
    return pages;
  };

  return (
    <section id="guestbook" className="py-20 md:py-32 px-6 bg-muted/20 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-typewriter text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary mb-6 block underline underline-offset-8 decoration-primary/20">{t.guestbook.sectionLabel}</span>
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            <p className="text-muted-foreground font-serif italic text-base md:text-lg leading-snug mb-8 max-w-lg">
              {t.guestbook.description}
            </p>
            <div className="flex items-center justify-center gap-4 text-primary/40 font-typewriter uppercase text-[10px] tracking-widest">
               <div className="w-8 h-[1px] bg-primary/20" />
               <span>{t.guestbook.showingWishes.replace("{count}", totalCount.toString())}</span>
               <div className="w-8 h-[1px] bg-primary/20" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Form */}
          <div className="md:col-span-1">
            {!guest ? (
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-primary/10 text-center sticky top-8">
                <h3 className="text-xl font-serif mb-4 text-red-500">{t.guestbook.restrictedTitle}</h3>
                <p className="text-sm text-muted-foreground font-serif">
                  {t.guestbook.restrictedDesc}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sticky top-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground ml-2">{t.guestbook.yourName}</label>
                    <Input
                      placeholder={t.guestbook.placeholderName}
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      className="bg-background border-none shadow-sm rounded-xl py-6"
                    />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground ml-2">{t.guestbook.message}</label>
                  <Textarea
                    placeholder={t.guestbook.placeholderMessage}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    required
                    className="bg-background border-none shadow-sm rounded-xl min-h-[150px] py-4"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!newText || !newName}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 shadow-md disabled:opacity-50"
                >
                  {t.guestbook.sendButton}
                </Button>
              </form>
            )}
          </div>

          {/* List */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div className="space-y-6 min-h-[400px]">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground font-serif italic">{t.guestbook.loading}</div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="group bg-background p-6 rounded-2xl shadow-sm border border-primary/5 hover:border-primary/10 transition-all flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 text-primary">
                            <MessageSquare size={14} />
                            <span className="text-sm font-bold font-serif">{msg.name}</span>
                          </div>
                          
                          {guest?.id && (
                            <button
                              onClick={() => handleLike(msg.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                                likedMessages.includes(msg.id) 
                                  ? "bg-red-50 text-red-500 border-red-100" 
                                  : "bg-muted/30 text-muted-foreground hover:bg-red-50 hover:text-red-400 border-transparent"
                              } border text-[10px] font-bold`}
                            >
                              <Heart 
                                size={12} 
                                className={`${likedMessages.includes(msg.id) ? "fill-current scale-110" : "scale-100"} transition-transform`} 
                              />
                              <span>{msg.likes || 0}</span>
                            </button>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground italic mb-4 font-serif leading-snug flex-1">"{msg.message}"</p>
                        <span className="font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground/50">
                          {new Date(msg.createdAt).toLocaleString(language === "id" ? 'id-ID' : 'en-US')}
                        </span>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground font-serif italic">{t.guestbook.empty}</div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Classic Pagination UI */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="rounded-full border-primary/10 text-primary"
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <div className="flex items-center gap-1">
                  {renderPageNumbers()}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="rounded-full border-primary/10 text-primary"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
