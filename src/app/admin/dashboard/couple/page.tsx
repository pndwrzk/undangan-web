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

 

export default function CouplePage() {
  const { status } = useSession();
  const router = useRouter();
  const [couple, setCouple] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingCouple, setSavingCouple] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
 
 
  
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
                      <Input name="groomName" defaultValue={couple?.groomName || ""} className="rounded-xl border-primary/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Alias Name</Label>
                      <Input name="groomAlias" defaultValue={couple?.groomAlias || ""} className="rounded-xl border-primary/10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Bio / Parent Names</Label>
                      <textarea name="groomBio" defaultValue={couple?.groomBio || ""} className="w-full p-3 rounded-xl border border-primary/10 bg-muted/10 focus:outline-primary min-h-[100px]" />
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
                      <Input name="brideName" defaultValue={couple?.brideName || ""} className="rounded-xl border-secondary/10" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Alias Name</Label>
                      <Input name="brideAlias" defaultValue={couple?.brideAlias || ""} className="rounded-xl border-secondary/10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Bio / Parent Names</Label>
                      <textarea name="brideBio" defaultValue={couple?.brideBio || ""} className="w-full p-3 rounded-xl border border-secondary/10 bg-muted/10 focus:outline-secondary min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter">Photo</Label>
                      <Input type="file" name="brideImageFile" accept="image/*" className="rounded-xl border-secondary/10 text-xs file:bg-secondary/10 file:text-secondary" />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6 pt-4">
                    <h3 className="text-sm font-typewriter uppercase tracking-widest text-muted-foreground border-b border-muted/20 pb-2">Global Settings & Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-typewriter text-white uppercase tracking-widest text-sm">Hero Background Preview</p>
                </div>
                <img src={couple.heroImage} alt="Hero Background" className="w-full h-64 object-cover" />
              </div>
            )}

        </div>
      </section>
    </div>
  );
}
