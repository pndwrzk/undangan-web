"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Heart, ChevronLeft, ChevronRight, Sparkles, Loader2, Mail } from "lucide-react";
import { submitWish, toggleLikeGuestbookMessage } from "@/lib/actions";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { toast } from "sonner";
import { Z_INDEX } from "@/lib/z-index";
import { apiRequest } from "@/lib/api-client";

import { Guest as GuestType, Guestbook as GuestbookType } from "@/types";

const EmptyState = ({ language, t }: { language: string, t: any }) => (
  <m.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-12 text-center space-y-4"
  >
    <div className="relative mb-6">
      <m.div
        animate={{
          y: [0, -12, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center relative z-10"
      >
        <Mail size={40} className="text-primary/40" />
      </m.div>
      <m.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"
      />
      <m.div
        animate={{ x: [0, 5, -5, 0], y: [0, 3, -3, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -top-1 -right-1 text-primary/30"
      >
        <Sparkles size={22} />
      </m.div>
    </div>
    <div className="space-y-2">
      <p className="font-serif italic text-md md:text-lg text-primary/80">
        {language === "id" ? "Sampaikan Doa Tulus Anda" : "Share Your Sincere Wishes"}
      </p>
      <p className="text-muted-foreground font-serif italic text-sm">
        {t.empty}
      </p>
    </div>
    <div className="w-12 h-[1px] bg-primary/10" />
  </m.div>
);

export default function Guestbook({ guest }: { guest?: GuestType | null }) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<GuestbookType[]>([]);
  const [newName, setNewName] = useState("");
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [likedMessages, setLikedMessages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    let data: any = null;
    try {
      const response = await apiRequest("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      data = await response.json();
      if (data.text) {
        setNewText(data.text);
        toast.success(language === "id" ? "Ucapan berhasil dibuat!" : "Wish generated successfully!");
      } else {
        throw new Error(data.message || "Failed to generate");
      }
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      toast.error(data?.message || (
        language === "id"
          ? "Gagal membuat ucapan. Silakan coba lagi."
          : "Failed to generate wish. Please try again."
      ));
    } finally {
      setIsGenerating(false);
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
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentPage === i
            ? "bg-primary text-white shadow-md scale-110"
            : "bg-background hover:bg-muted text-muted-foreground"
            } text-sm font-bold font-sans`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <section id="guestbook" style={{ zIndex: Z_INDEX.GUESTBOOK_SECTION }} className="py-16 md:py-24 px-6 md:px-8 lg:px-16 bg-[#fcfaf3] relative -mt-[2px]">
      <div className="max-w-4xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="font-typewriter text-[14px] md:text-xs uppercase tracking-[0.3em] text-primary mb-6 block">{t.guestbook.sectionLabel}</span>
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            <p className="text-muted-foreground font-serif italic text-[14px] md:text-base leading-snug mb-4 max-w-lg">
              {t.guestbook.description}
            </p>
            <div className="flex items-center justify-center gap-4 text-primary/40 font-typewriter uppercase text-[10px] tracking-widest">
              <div className="w-8 h-[1px] bg-primary/20" />
              <span>{t.guestbook.showingWishes.replace("{count}", totalCount.toString())}</span>
              <div className="w-8 h-[1px] bg-primary/20" />
            </div>
          </div>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Form */}
          <div className="md:col-span-1">
            {!guest ? (
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-primary/10 text-center sticky top-8">
                <h3 className=" font-typewriter text-[14px] md:text-xl mb-4 text-red-500">{t.guestbook.restrictedTitle}</h3>
                <p className="text-sm text-muted-foreground font-serif">
                  {t.guestbook.restrictedDesc}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sticky top-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground ml-2 mb-1">{t.guestbook.yourName}</label>
                  <div className="relative">
                    <Input
                      placeholder={t.guestbook.placeholderName}
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      className="bg-background border-none shadow-sm rounded-xl py-6 pr-32"
                    />
                    {guest?.name && newName !== guest.name && (
                      <button
                        type="button"
                        onClick={() => setNewName(guest.name)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-sans text-primary hover:text-primary/70 transition-colors underline underline-offset-2"
                      >
                        {t.guestbook.useMyName}
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground ml-2">{t.guestbook.message}</label>
                    <button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={isGenerating}
                      className="flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-wider text-primary hover:text-primary/70 transition-colors bg-primary/5 px-3 py-1 rounded-full disabled:opacity-50 mb-1"
                    >
                      {isGenerating ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      {t.guestbook.generateAI}
                    </button>
                  </div>
                  <Textarea
                    placeholder={t.guestbook.placeholderMessage}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    required
                    className="bg-background border-none shadow-sm rounded-xl py-4 min-h-[180px] md:min-h-[220px] resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!newText || !newName}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 shadow-md disabled:opacity-50 font-sans tracking-widest"
                >
                  {t.guestbook.sendButton}
                </Button>
              </form>
            )}
          </div>

          {/* List */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div className="relative">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground font-serif italic">{t.guestbook.loading}</div>
              ) : (
                <AnimatePresence mode="wait">
                  <m.div
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
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${likedMessages.includes(msg.id)
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
                      <EmptyState language={language} t={t.guestbook} />
                    )}
                  </m.div>
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
