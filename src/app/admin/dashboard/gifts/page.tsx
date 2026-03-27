"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Gift, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GiftsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [gifts, setGifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingGift, setSavingGift] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }

    if (status === "authenticated") {
      fetch("/api/admin/gifts")
        .then(res => res.json())
        .then(data => setGifts(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  const handleSaveGift = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingGift(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    const method = editingId ? "PUT" : "POST";
    if (editingId) payload.id = editingId;

    try {
      const res = await fetch("/api/admin/gifts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const savedGift = await res.json();
        if (editingId) {
          setGifts(gifts.map(g => g.id === editingId ? savedGift : g));
          toast.success("Gift account updated successfully!");
        } else {
          setGifts([...gifts, savedGift]);
          toast.success("Gift account added successfully!");
        }
        setIsDialogOpen(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save gift account");
    } finally {
      setSavingGift(false);
    }
  };

  const handleDeleteGift = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gifts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGifts(gifts.filter(g => g.id !== id));
        toast.success("Gift account deleted successfully!");
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete gift account");
    }
  };

  const handleEdit = (g: any) => {
    setEditingId(g.id);
    setIsDialogOpen(true);
    // Use timeout to ensure dialog is rendered before populating
    setTimeout(() => {
      if (formRef.current) {
        (formRef.current.elements.namedItem("bankName") as HTMLInputElement).value = g.bankName;
        (formRef.current.elements.namedItem("accountNumber") as HTMLInputElement).value = g.accountNumber;
        (formRef.current.elements.namedItem("accountName") as HTMLInputElement).value = g.accountName;
      }
    }, 0);
  };

  const openAddDialog = () => {
    setEditingId(null);
    setIsDialogOpen(true);
    if (formRef.current) formRef.current.reset();
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
            <h2 className="text-3xl font-serif mb-2">Manage Digital Gifts</h2>
            <p className="text-muted-foreground font-typewriter text-sm uppercase tracking-wider">Configure bank accounts for wedding gifts</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger 
              render={
                <Button onClick={openAddDialog} className="rounded-full px-6 py-6 shadow-lg shadow-primary/20 hover:shadow-xl transition-all gap-2">
                  <Plus size={18} />
                  <span>Add Account</span>
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-primary/10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">{editingId ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle>
                <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                  Enter the details for the digital gift destination.
                </DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleSaveGift} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="text-xs uppercase tracking-[0.2em] font-typewriter ml-1">Bank Name</Label>
                  <Input id="bankName" name="bankName" placeholder="e.g. BCA, Mandiri, DANA" className="rounded-xl border-primary/10 focus-visible:ring-primary bg-muted/20" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-xs uppercase tracking-[0.2em] font-typewriter ml-1">Account Number</Label>
                  <Input id="accountNumber" name="accountNumber" placeholder="e.g. 1234567890" className="rounded-xl border-primary/10 focus-visible:ring-primary bg-muted/20" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName" className="text-xs uppercase tracking-[0.2em] font-typewriter ml-1">Account Holder Name</Label>
                  <Input id="accountName" name="accountName" placeholder="e.g. Alvia / Pandiwa" className="rounded-xl border-primary/10 focus-visible:ring-primary bg-muted/20" required />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-full py-6 border-primary/10">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingGift} className="flex-2 rounded-full py-6 px-10">
                    {savingGift ? "Saving..." : editingId ? "Update Account" : "Create Account"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {gifts.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-24 text-center border border-dashed border-primary/20 flex flex-col items-center justify-center gap-4">
              <div className="p-4 bg-muted/30 rounded-full text-muted-foreground/30">
                <Gift size={48} />
              </div>
              <p className="text-muted-foreground italic font-serif text-lg">No gift accounts configured yet.</p>
              <Button onClick={openAddDialog} variant="outline" className="rounded-full mt-2 border-primary/20">Add Your First Account</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gifts.map((g) => (
                <div key={g.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-primary/5 flex flex-col justify-between relative group hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                  <div className="absolute top-10 right-10 text-primary/10 group-hover:text-primary/20 transition-colors">
                    <Gift size={64} />
                  </div>

                  <div className="relative z-10 mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-[1px] w-6 bg-primary/30"></span>
                      <p className="font-typewriter text-[10px] uppercase tracking-[0.3em] text-primary">{g.bankName}</p>
                    </div>
                    <p className="text-3xl font-serif mb-2 tracking-wider text-slate-800">{g.accountNumber}</p>
                    <p className="text-xs font-typewriter text-muted-foreground uppercase tracking-widest">a/n {g.accountName}</p>
                  </div>

                    <div className="relative z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(g)} className="flex-1 rounded-full border-primary/10 hover:bg-primary/5 gap-2 py-5 text-xs">
                        <Pencil size={14} />
                        Edit
                      </Button>
                      
                      <Dialog open={deleteConfirmId === g.id} onOpenChange={(open) => setDeleteConfirmId(open ? g.id : null)}>
                        <DialogTrigger 
                          render={
                            <Button variant="ghost" size="sm" className="rounded-full text-red-100 hover:text-red-500 hover:bg-red-50 py-5 px-4 bg-red-400">
                              <Trash2 size={16} />
                            </Button>
                          }
                        />
                        <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-red-100">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-serif text-red-600">Confirm Delete</DialogTitle>
                            <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                              Are you sure you want to delete this bank account? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="bg-muted/30 p-4 rounded-2xl mb-4 border border-primary/5">
                            <p className="text-xs font-typewriter uppercase tracking-widest text-muted-foreground mb-1">Account to delete:</p>
                            <p className="font-serif text-lg">{g.bankName} - {g.accountNumber}</p>
                            <p className="text-xs font-medium uppercase tracking-tighter">a/n {g.accountName}</p>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-full py-6">
                              Cancel
                            </Button>
                            <Button onClick={() => handleDeleteGift(g.id)} variant="destructive" className="flex-1 rounded-full py-6 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200">
                              Delete Now
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
