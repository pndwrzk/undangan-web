"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, Heart, Calendar, Hash } from "lucide-react";
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
import { useRef } from "react";

const COLOR_PRESETS = [
  { name: "Original", primary: "#BE185D", secondary: "#4338CA", background: "#FDFCF0", card: "#FFFFFF", muted: "#FDFCF0" },
  { name: "Emerald", primary: "#065F46", secondary: "#10B981", background: "#F0FDF4", card: "#FFFFFF", muted: "#DCFCE7" },
  { name: "Navy", primary: "#1E3A8A", secondary: "#3B82F6", background: "#EFF6FF", card: "#FFFFFF", muted: "#DBEAFE" },
  { name: "Terracotta", primary: "#9A3412", secondary: "#EA580C", background: "#FFF7ED", card: "#FFFFFF", muted: "#FFEDD5" },
];
 

export default function CouplePage() {
  const { status } = useSession();
  const router = useRouter();
  const [couple, setCouple] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingCouple, setSavingCouple] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState("#BE185D");
  const [selectedSecondary, setSelectedSecondary] = useState("#4338CA");
  const [selectedBackground, setSelectedBackground] = useState("#FDFCF0");
  const [selectedCard, setSelectedCard] = useState("#FFFFFF");
  const [selectedMuted, setSelectedMuted] = useState("#F3F4F6");
 
 
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (status === "authenticated") {
      fetch("/api/admin/couple")
        .then(res => res.json())
        .then(data => {
          setCouple(data);
          if (data?.primaryColor) setSelectedPrimary(data.primaryColor);
          if (data?.secondaryColor) setSelectedSecondary(data.secondaryColor);
          if (data?.backgroundColor) setSelectedBackground(data.backgroundColor);
          if (data?.cardColor) setSelectedCard(data.cardColor);
          if (data?.mutedColor) setSelectedMuted(data.mutedColor);



        })
 
 
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  const handleUpdateCouple = async (e: React.FormEvent<HTMLFormElement>) => {
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
        toast.success("Couple data updated successfully!");
        setIsDialogOpen(false);
        // No need to reload if state is updated, but let's see
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update couple data");
    } finally {
      setSavingCouple(false);
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="mb-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-serif mb-2">Manage Bride & Groom</h2>
            <p className="text-muted-foreground font-typewriter text-sm uppercase tracking-wider">Configure primary wedding details and hashtag</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger 
              render={
                <Button className="rounded-full px-6 py-6 shadow-lg shadow-primary/20 hover:shadow-xl transition-all gap-2">
                  <Pencil size={18} />
                  <span>Edit Details</span>
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[800px] border-primary/10">
              <form ref={formRef} onSubmit={handleUpdateCouple} className="flex flex-col max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif">Edit Wedding Details</DialogTitle>
                  <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                    Update the bride, groom, and global wedding settings.
                  </DialogDescription>
                </DialogHeader>
                
                <DialogBody className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 scrollbar-hide">
                  <div className="space-y-6">
                    <h3 className="text-sm font-typewriter uppercase tracking-widest text-primary border-b border-primary/10 pb-2">Groom (Laki-laki)</h3>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Full Name</Label>
                      <Input name="groomName" defaultValue={couple?.groomName} className="rounded-xl border-primary/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Alias Name</Label>
                      <Input name="groomAlias" defaultValue={couple?.groomAlias} className="rounded-xl border-primary/10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Bio / Parent Names</Label>
                      <textarea name="groomBio" defaultValue={couple?.groomBio} className="w-full p-3 rounded-xl border border-primary/10 bg-muted/10 focus:outline-primary min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Photo</Label>
                      <Input type="file" name="groomImageFile" accept="image/*" className="rounded-xl border-primary/10 text-xs file:bg-primary/10 file:text-primary" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-typewriter uppercase tracking-widest text-secondary border-b border-secondary/10 pb-2">Bride (Wanita)</h3>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Full Name</Label>
                      <Input name="brideName" defaultValue={couple?.brideName} className="rounded-xl border-secondary/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Alias Name</Label>
                      <Input name="brideAlias" defaultValue={couple?.brideAlias} className="rounded-xl border-secondary/10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Bio / Parent Names</Label>
                      <textarea name="brideBio" defaultValue={couple?.brideBio} className="w-full p-3 rounded-xl border border-secondary/10 bg-muted/10 focus:outline-secondary min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Photo</Label>
                      <Input type="file" name="brideImageFile" accept="image/*" className="rounded-xl border-secondary/10 text-xs file:bg-secondary/10 file:text-secondary" />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6 pt-4">
                    <h3 className="text-sm font-typewriter uppercase tracking-widest text-muted-foreground border-b border-muted/20 pb-2">Global Settings & Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4 md:col-span-2">
                        <Label className="text-[10px] uppercase tracking-widest font-typewriter">Theme Presets</Label>
                        <div className="flex flex-wrap gap-3">
                          {COLOR_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setSelectedPrimary(preset.primary);
                                setSelectedSecondary(preset.secondary);
                                setSelectedBackground(preset.background);
                                setSelectedCard(preset.card);
                                setSelectedMuted(preset.muted);
                              }}
                              className="px-3 py-2 rounded-xl border border-primary/10 text-[10px] uppercase tracking-wider hover:bg-primary/5 transition-all flex items-center gap-2 group"
                            >
                              <div className="flex -space-x-1">
                                <div className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: preset.primary }} />
                                <div className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: preset.secondary }} />
                                <div className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: preset.background }} />
                              </div>
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-typewriter">Primary Theme Color</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            name="primaryColor" 
                            value={selectedPrimary} 
                            onChange={(e) => setSelectedPrimary(e.target.value)}
                            className="w-12 h-10 p-1 rounded-lg cursor-pointer" 
                          />
                          <Input 
                            value={selectedPrimary} 
                            onChange={(e) => setSelectedPrimary(e.target.value)}
                            placeholder="#HEX"
                            className="rounded-xl flex-1 font-mono uppercase"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-typewriter">Secondary Theme Color</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            name="secondaryColor" 
                            value={selectedSecondary} 
                            onChange={(e) => setSelectedSecondary(e.target.value)}
                            className="w-12 h-10 p-1 rounded-lg cursor-pointer" 
                          />
                          <Input 
                            value={selectedSecondary} 
                            onChange={(e) => setSelectedSecondary(e.target.value)}
                            placeholder="#HEX"
                            className="rounded-xl flex-1 font-mono uppercase"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-typewriter">Card Background</Label>
                            <div className="flex gap-2">
                              <Input type="color" name="cardColor" value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)} className="w-12 h-10 p-1 rounded-lg" />
                              <Input value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)} className="rounded-xl flex-1 font-mono uppercase" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-typewriter">Muted Background</Label>
                            <div className="flex gap-2">
                              <Input type="color" name="mutedColor" value={selectedMuted} onChange={(e) => setSelectedMuted(e.target.value)} className="w-12 h-10 p-1 rounded-lg" />
                              <Input value={selectedMuted} onChange={(e) => setSelectedMuted(e.target.value)} className="rounded-xl flex-1 font-mono uppercase" />
                            </div>
                          </div>
                        </div>
                      </div>



                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-typewriter">Wedding Hashtag</Label>
                        <Input name="hashtag" defaultValue={couple?.hashtag || "#AlviaPandiwaMenyatu"} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-typewriter">Wedding Date</Label>
                        <Input 
                          type="date" 
                          name="weddingDate" 
                          defaultValue={couple?.weddingDate ? new Date(couple.weddingDate).toISOString().split('T')[0] : ""} 
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] uppercase tracking-widest font-typewriter">Hero Background Image</Label>
                        <Input type="file" name="heroImageFile" accept="image/*" className="rounded-xl border-muted/20 text-xs file:bg-muted file:text-foreground" />
                        <p className="text-[10px] text-muted-foreground mt-1">Leave empty to keep the current background.</p>
                      </div>
                    </div>
                  </div>
                </DialogBody>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-full py-6">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingCouple} className="flex-2 rounded-full py-6 px-10">
                    {savingCouple ? "Saving..." : "Save All Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-primary/5 flex flex-col items-center text-center relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-br-full -ml-8 -mt-8 pointer-events-none" />
             <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-primary/10 mb-6 group-hover:border-primary/30 transition-all duration-500">
                <img src={couple?.groomImage || "/placeholder-groom.jpg"} alt={couple?.groomName} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
             </div>
             <p className="font-typewriter text-[10px] uppercase tracking-[0.3em] text-primary mb-2">The Groom</p>
             <h3 className="text-3xl font-serif mb-2">{couple?.groomName}</h3>
             <p className="text-muted-foreground font-serif italic text-sm px-6">"{couple?.groomBio}"</p>
           </div>

           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-secondary/5 flex flex-col items-center text-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
             <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-secondary/10 mb-6 group-hover:border-secondary/30 transition-all duration-500">
                <img src={couple?.brideImage || "/placeholder-bride.jpg"} alt={couple?.brideName} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
             </div>
             <p className="font-typewriter text-[10px] uppercase tracking-[0.3em] text-secondary mb-2">The Bride</p>
             <h3 className="text-3xl font-serif mb-2">{couple?.brideName}</h3>
             <p className="text-muted-foreground font-serif italic text-sm px-6">"{couple?.brideBio}"</p>
           </div>

           <div className="md:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-primary/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-primary/5 rounded-full text-primary">
                  <Hash size={32} />
                </div>
                <div>
                  <p className="font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Official Hashtag</p>
                  <p className="text-3xl font-serif text-slate-800">{couple?.hashtag}</p>
                </div>
              </div>
               <div className="flex items-center gap-6">
                 <div className="p-4 bg-primary/5 rounded-full text-primary">
                   <Calendar size={32} />
                 </div>
                 <div>
                   <p className="font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Wedding Date</p>
                   <p className="text-3xl font-serif text-slate-800">{couple?.weddingDate ? new Date(couple.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
                 </div>
               </div>
              </div>
            {couple?.heroImage && (
              <div className="md:col-span-2 bg-white rounded-[3rem] shadow-sm border border-primary/5 overflow-hidden relative group">
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-typewriter text-white uppercase tracking-widest text-sm">Hero Background Preview</p>
                </div>
                <img src={couple.heroImage} alt="Hero Background" className="w-full h-64 object-cover" />
              </div>
            )}

            <div className="md:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-primary/5 flex flex-col md:flex-row justify-center items-center gap-10">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" style={{ backgroundColor: couple?.primaryColor || "#BE185D" }} title="Primary" />
                 <div className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" style={{ backgroundColor: couple?.secondaryColor || "#4338CA" }} title="Secondary" />
                 <div className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" style={{ backgroundColor: couple?.backgroundColor || "#FDFCF0" }} title="Background" />
                 <div className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" style={{ backgroundColor: couple?.cardColor || "#FFFFFF" }} title="Card" />
                 <div className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" style={{ backgroundColor: couple?.mutedColor || "#F3F4F6" }} title="Muted" />
               </div>
               <div className="text-center md:text-left">
                 <p className="font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Theme Palette</p>
                 <p className="text-[10px] font-mono uppercase text-slate-500">
                   {couple?.primaryColor} / {couple?.secondaryColor} / {couple?.backgroundColor} / {couple?.cardColor} / {couple?.mutedColor}
                 </p>
               </div>
            </div>
        </div>
      </section>
    </div>
  );
}
