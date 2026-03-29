"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, Heart, Calendar, Hash, Image as ImageIcon, Trash2, Camera, User, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CouplePage() {
  const { status } = useSession();
  const router = useRouter();
  const [couple, setCouple] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingCouple, setSavingCouple] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const groomInputRef = useRef<HTMLInputElement>(null);
  const brideInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const quoteInputRef = useRef<HTMLInputElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);
  
  const [isUpdatingImage, setIsUpdatingImage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState<{ type: 'groom' | 'bride' | 'hero' | 'quote' | 'story' | null, open: boolean }>({ type: null, open: false });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (status === "authenticated") {
      fetch("/api/admin/couple")
        .then(res => res.json())
        .then(data => setCouple(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  const handleUpdateDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingCouple(true);
    const formData = new FormData(e.currentTarget);
    if (couple?.id) formData.append("id", couple.id);

    try {
      const res = await fetch("/api/admin/couple", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const updated = await res.json();
        setCouple(updated);
        toast.success("Wedding details updated successfully!");
        setIsDetailsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update details");
    } finally {
      setSavingCouple(false);
    }
  };

  const handleImageUpload = async (type: 'groom' | 'bride' | 'hero' | 'quote' | 'story', file: File) => {
    setIsUpdatingImage(type);
    const formData = new FormData();
    if (couple?.id) formData.append("id", couple.id);
    
    // API requires names if updating from this endpoint
    formData.append("groomName", couple?.groomName || "");
    formData.append("brideName", couple?.brideName || "");
    
    formData.append(`${type}ImageFile`, file);

    try {
      const res = await fetch("/api/admin/couple", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const updated = await res.json();
        setCouple(updated);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image updated!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUpdatingImage(null);
    }
  };

  const executeResetImage = async () => {
    const type = confirmReset.type;
    if (!type) return;

    setConfirmReset({ type: null, open: false });
    setIsUpdatingImage(type);
    
    const formData = new FormData();
    if (couple?.id) formData.append("id", couple.id);
    formData.append("groomName", couple?.groomName || "");
    formData.append("brideName", couple?.brideName || "");
    formData.append(`delete${type.charAt(0).toUpperCase() + type.slice(1)}Image`, "true");

    try {
      const res = await fetch("/api/admin/couple", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const updated = await res.json();
        setCouple(updated);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} photo reset!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset photo");
    } finally {
      setIsUpdatingImage(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section with unified edit button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/10 pb-8">
        <div>
          <h2 className="text-4xl font-serif text-slate-800 mb-2">The Happy Couple</h2>
          <p className="text-muted-foreground font-typewriter text-xs uppercase tracking-[0.3em]">Design and manage your primary wedding profile</p>
        </div>
        
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogTrigger render={
            <Button className="rounded-full px-8 py-6 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 group">
              <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="font-serif">Edit Details</span>
            </Button>
          } />
          <DialogContent className="sm:max-w-[800px] border-primary/10 rounded-[2rem]">
            <form key={couple ? `${couple.id}-${couple.updatedAt}` : "loading"} onSubmit={handleUpdateDetails} className="flex flex-col max-h-[90vh]">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle className="text-3xl font-serif">Wedding Details Editor</DialogTitle>
                <DialogDescription className="font-typewriter text-[10px] uppercase tracking-widest text-primary/60 mt-1">
                  Global names, bios, and wedding metadata
                </DialogDescription>
              </DialogHeader>
              <DialogBody className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 overflow-y-auto scrollbar-hide">
                {/* Groom Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <User size={16} />
                    <h3 className="text-sm font-typewriter uppercase tracking-widest">Groom Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter text-muted-foreground">Full Name</Label>
                      <Input name="groomName" defaultValue={couple?.groomName || ""} className="rounded-xl focus:ring-primary/20" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter text-muted-foreground">Alias (Displayed in Title)</Label>
                      <Input name="groomAlias" defaultValue={couple?.groomAlias || ""} className="rounded-xl border-primary/20" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter text-muted-foreground">Short Bio / Parent Names</Label>
                      <textarea name="groomBio" defaultValue={couple?.groomBio || ""} className="w-full p-4 rounded-xl border border-primary/20 bg-muted/5 focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[120px]" />
                    </div>
                  </div>
                </div>

                {/* Bride Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2 text-secondary">
                    <User size={16} />
                    <h3 className="text-sm font-typewriter uppercase tracking-widest">Bride Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter text-muted-foreground">Full Name</Label>
                      <Input name="brideName" defaultValue={couple?.brideName || ""} className="rounded-xl border-secondary/20 focus:ring-secondary/20" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter text-muted-foreground">Alias (Displayed in Title)</Label>
                      <Input name="brideAlias" defaultValue={couple?.brideAlias || ""} className="rounded-xl border-secondary/20" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter text-muted-foreground">Short Bio / Parent Names</Label>
                      <textarea name="brideBio" defaultValue={couple?.brideBio || ""} className="w-full p-4 rounded-xl border border-secondary/20 bg-muted/5 focus:ring-2 focus:ring-secondary/20 outline-none text-sm min-h-[120px]" />
                    </div>
                  </div>
                </div>

                {/* Global Info */}
                <div className="md:col-span-2 pt-6 border-t border-primary/10">
                  <h3 className="text-sm font-typewriter uppercase tracking-widest text-muted-foreground mb-6">Website Theme Metadata</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter text-muted-foreground">Official Hashtag</Label>
                      <div className="relative">
                        <Input name="hashtag" defaultValue={couple?.hashtag || "#WeddingDay"} className="rounded-xl pl-10" />
                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter text-muted-foreground">Wedding Date</Label>
                      <div className="relative">
                        <Input type="date" name="weddingDate" defaultValue={couple?.weddingDate ? new Date(couple.weddingDate).toISOString().split('T')[0] : ""} className="rounded-xl pl-10" />
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogBody>
              <DialogFooter className="p-6 bg-muted/5">
                <Button type="button" variant="ghost" onClick={() => setIsDetailsModalOpen(false)} className="rounded-full">Cancel</Button>
                <Button type="submit" disabled={savingCouple} className="rounded-full px-10 transition-all">
                  {savingCouple ? "Saving Changes..." : "Apply All Edits"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Groom Profile */}
        <div className="relative group">
          <div className="bg-white rounded-[2.5rem] p-1 shadow-2xl shadow-primary/5 border border-primary/5 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Profile Image Column */}
              <div className="p-4 md:w-1/2">
                <div className="relative h-80 md:h-[450px] rounded-[2rem] overflow-hidden bg-muted/20 border-2 border-primary/10 transition-colors group-hover:border-primary/30">
                  {isUpdatingImage === 'groom' && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/20 border-t-white"></div>
                    </div>
                  )}
                  <img src={couple?.groomImage || "/placeholder-groom.jpg"} alt="Groom" className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105" />
                  
                  {/* Photo Actions Overlay - desktop hover only */}
                  <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/30">
                    <div className="flex gap-3">
                      <button 
                         onClick={() => groomInputRef.current?.click()}
                         className="p-4 bg-white rounded-full text-primary shadow-xl hover:scale-110 active:scale-95 transition-all"
                         title="Change Photo"
                      >
                         <Camera size={24} />
                      </button>
                      <button 
                         onClick={() => setConfirmReset({ type: 'groom', open: true })}
                         className="p-4 bg-white rounded-full text-red-500 shadow-xl hover:scale-110 active:scale-95 transition-all"
                         title="Reset Photo"
                      >
                         <Trash2 size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-primary border border-primary/10">
                    <Heart size={16} fill="currentColor" />
                  </div>
                </div>
                {/* Mobile-only action buttons */}
                <div className="flex md:hidden gap-2 mt-3 px-2">
                  <button onClick={() => groomInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary/10 text-primary rounded-2xl text-xs font-typewriter uppercase tracking-widest active:scale-95 transition-all">
                    <Camera size={14} /> Change Photo
                  </button>
                  <button onClick={() => setConfirmReset({ type: 'groom', open: true })} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 rounded-2xl text-xs font-typewriter uppercase tracking-widest active:scale-95 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Text Info Column */}
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <p className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-2">The Groom</p>
                <h3 className="text-3xl font-serif text-slate-800 mb-6 leading-tight">{couple?.groomName}</h3>
                <div className="space-y-4">
                   <div className="h-0.5 w-12 bg-primary/10" />
                   <p className="text-muted-foreground font-serif italic text-sm leading-relaxed line-clamp-6">
                     {couple?.groomBio || "Write a beautiful bio for the groom..."}
                   </p>
                </div>
              </div>
            </div>
          </div>
          <input type="file" ref={groomInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload('groom', e.target.files[0])} />
        </div>

        {/* Bride Profile */}
        <div className="relative group">
          <div className="bg-white rounded-[2.5rem] p-1 shadow-2xl shadow-secondary/5 border border-secondary/5 overflow-hidden">
            <div className="flex flex-col md:flex-row-reverse">
              {/* Profile Image Column */}
              <div className="p-4 md:w-1/2">
                <div className="relative h-80 md:h-[450px] rounded-[2rem] overflow-hidden bg-muted/20 border-2 border-secondary/10 transition-colors group-hover:border-secondary/30">
                  {isUpdatingImage === 'bride' && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/20 border-t-white"></div>
                    </div>
                  )}
                  <img src={couple?.brideImage || "/placeholder-bride.jpg"} alt="Bride" className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105" />
                  
                  {/* Photo Actions Overlay - desktop hover only */}
                  <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/30">
                    <div className="flex gap-3">
                      <button 
                         onClick={() => brideInputRef.current?.click()}
                         className="p-4 bg-white rounded-full text-secondary shadow-xl hover:scale-110 active:scale-95 transition-all"
                         title="Change Photo"
                      >
                         <Camera size={24} />
                      </button>
                      <button 
                         onClick={() => setConfirmReset({ type: 'bride', open: true })}
                         className="p-4 bg-white rounded-full text-red-500 shadow-xl hover:scale-110 active:scale-95 transition-all"
                         title="Reset Photo"
                      >
                         <Trash2 size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-secondary border border-secondary/10">
                    <Heart size={16} fill="currentColor" />
                  </div>
                </div>
                {/* Mobile-only action buttons */}
                <div className="flex md:hidden gap-2 mt-3 px-2">
                  <button onClick={() => brideInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary/10 text-secondary rounded-2xl text-xs font-typewriter uppercase tracking-widest active:scale-95 transition-all">
                    <Camera size={14} /> Change Photo
                  </button>
                  <button onClick={() => setConfirmReset({ type: 'bride', open: true })} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 rounded-2xl text-xs font-typewriter uppercase tracking-widest active:scale-95 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Text Info Column */}
              <div className="p-8 md:w-1/2 flex flex-col justify-center text-right md:text-left">
                <p className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-secondary/60 mb-2">The Bride</p>
                <h3 className="text-3xl font-serif text-slate-800 mb-6 leading-tight">{couple?.brideName}</h3>
                <div className="space-y-4">
                   <div className="h-0.5 w-12 bg-secondary/10 ml-auto md:ml-0" />
                   <p className="text-muted-foreground font-serif italic text-sm leading-relaxed line-clamp-6">
                     {couple?.brideBio || "Write a beautiful bio for the bride..."}
                   </p>
                </div>
              </div>
            </div>
          </div>
          <input type="file" ref={brideInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload('bride', e.target.files[0])} />
        </div>
      </div>

      {/* Global Metadata Section */}
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="flex items-center gap-8 group">
              <div className="p-6 bg-primary/5 rounded-[2rem] text-primary transition-colors group-hover:bg-primary/10">
                <Hash size={40} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-1">Official Ceremony Hashtag</p>
                <p className="text-xl md:text-2xl font-serif text-slate-800 break-all">{couple?.hashtag}</p>
              </div>
           </div>
           <div className="flex items-center gap-8 group">
              <div className="p-6 bg-secondary/5 rounded-[2rem] text-secondary transition-colors group-hover:bg-secondary/10">
                <Calendar size={40} />
              </div>
              <div>
                <p className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-1">Mark the Date</p>
                <p className="text-2xl font-serif text-slate-800">
                  {couple?.weddingDate ? new Date(couple.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "-"}
                </p>
              </div>
           </div>
        </div>
      </div>

      {/* Invitation Backgrounds / Theme Assets */}
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-serif text-slate-800 flex items-center gap-3">
             <Sparkles className="text-primary w-5 h-5" />
             Invitation Themes
          </h3>
          <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mt-2">Manage the high-impact visual backgrounds of your website</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: 'Hero Background', type: 'hero', img: couple?.heroImage || "/hero-bg.png", ref: heroInputRef, desc: 'Displayed on the opening screen and main banner.' },
             { title: 'Quote Background', type: 'quote', img: couple?.quoteImage || "/quote-bg.png", ref: quoteInputRef, desc: 'Background for the main wedding quote section.' },
             { title: 'Story Cover', type: 'story', img: couple?.storyImage || "/story-bg.jpg", ref: storyInputRef, desc: 'The full-cover image for your "Our Journey" section.' }
           ].map((item, i) => (
             <div key={i} className="group relative">
               <div className="bg-white rounded-[2.5rem] p-1 shadow-lg border border-primary/5 overflow-hidden h-full flex flex-col">
                  <div className="relative h-64 md:h-80 m-4 rounded-[2rem] overflow-hidden bg-muted/20 border-2 border-primary/5 transition-colors group-hover:border-primary/20">
                    {isUpdatingImage === item.type && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-30 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                      </div>
                    )}
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    
                    {/* Desktop hover overlay */}
                    <div className="absolute inset-0 hidden md:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-20">
                      <button 
                        onClick={() => item.ref.current?.click()}
                        className="bg-white p-3 rounded-full text-primary hover:scale-110 transition-transform"
                        title={`Change ${item.title}`}
                      >
                        <ImageIcon size={20} />
                      </button>
                      <button 
                        onClick={() => setConfirmReset({ type: item.type as any, open: true })}
                        className="bg-white p-3 rounded-full text-red-500 hover:scale-110 transition-transform"
                        title={`Reset ${item.title}`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="px-8 pb-4 flex-1 flex flex-col">
                    <h4 className="text-xl font-serif text-slate-800 mb-2">{item.title}</h4>
                    <p className="text-xs text-muted-foreground font-serif italic flex-1">{item.desc}</p>
                  </div>
                  {/* Mobile action buttons */}
                  <div className="flex md:hidden gap-2 px-8 pb-6">
                    <button onClick={() => item.ref.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary/10 text-primary rounded-2xl text-xs font-typewriter uppercase tracking-widest active:scale-95 transition-all">
                      <ImageIcon size={14} /> Change
                    </button>
                    <button onClick={() => setConfirmReset({ type: item.type as any, open: true })} className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 text-red-500 rounded-2xl active:scale-95 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
               </div>
               <input type="file" ref={item.ref} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(item.type as any, e.target.files[0])} />
             </div>
           ))}
        </div>
      </div>

      {/* Confirmation Reset Modal */}
      <Dialog open={confirmReset.open} onOpenChange={(open) => setConfirmReset(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[450px] border-red-50 rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-red-600">Confirm Asset Reset</DialogTitle>
            <DialogDescription className="font-typewriter text-[10px] uppercase tracking-widest mt-2">
              Warning: This will restore the system default image
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="py-6 flex flex-col items-center text-center">
            <div className="p-4 bg-red-50 rounded-full text-red-500 mb-4">
              <Trash2 size={32} />
            </div>
            <p className="text-muted-foreground font-serif">Are you sure you want to remove the current <span className="font-bold text-slate-800 uppercase">{confirmReset.type}</span> asset?</p>
          </DialogBody>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmReset({ type: null, open: false })} className="rounded-full flex-1">Keep Current</Button>
            <Button variant="destructive" onClick={executeResetImage} className="rounded-full bg-red-500 hover:bg-red-600 flex-1">Reset Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
