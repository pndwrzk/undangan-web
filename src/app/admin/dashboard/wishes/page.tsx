"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WishesPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [wishes, setWishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (authStatus === "authenticated") {
      fetchWishes();
    }
  }, [authStatus, router]);

  const fetchWishes = async () => {
    try {
      const res = await fetch("/api/admin/wishes");
      if (res.ok) {
        const data = await res.json();
        setWishes(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch wishes");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const res = await fetch("/api/admin/wishes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setWishes(wishes.map(w => w.id === id ? { ...w, status: newStatus } : w));
        toast.success(`Wish ${newStatus === 1 ? 'published' : 'unpublished'} successfully!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/wishes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setWishes(wishes.filter(w => w.id !== id));
        toast.success("Wish deleted successfully!");
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete wish");
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif">Manage Guest Wishes</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-typewriter">
            {wishes.length} Total
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-muted/30">
                  <TableHead className="px-6 py-4">Guest Name</TableHead>
                  <TableHead className="px-6 py-4">Message</TableHead>
                  <TableHead className="px-6 py-4">Status</TableHead>
                  <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-serif">
                {wishes.map((wish) => (
                  <TableRow key={wish.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors group">
                    <TableCell className="px-6 py-5">
                      <p className="font-bold text-slate-800">{wish.name}</p>
                      <p className="text-[10px] text-muted-foreground font-typewriter uppercase tracking-tighter mt-1">Guest</p>
                    </TableCell>
                    <TableCell className="px-6 py-5 max-w-md">
                      <p className="text-sm font-serif italic text-slate-700 leading-relaxed">"{wish.message}"</p>
                      <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-typewriter">
                        <MessageSquare size={10} />
                        {new Date(wish.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <button 
                        onClick={() => toggleStatus(wish.id, wish.status)}
                        className={`px-3 py-1 rounded-full text-[10px] uppercase font-typewriter tracking-widest flex items-center gap-1.5 transition-all ${wish.status === 1 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}
                      >
                        {wish.status === 1 ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {wish.status === 1 ? 'Published' : 'Hidden'}
                      </button>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog open={deleteConfirmId === wish.id} onOpenChange={(open) => setDeleteConfirmId(open ? wish.id : null)}>
                          <DialogTrigger 
                            render={
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 h-9 w-9 p-0"
                              >
                                <Trash2 size={16} />
                              </Button>
                            }
                          />
                          <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-red-100">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-serif text-red-600">Delete Wish</DialogTitle>
                              <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                                Are you sure you want to permanently delete this message?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="bg-muted/30 p-5 rounded-2xl mb-4 border border-primary/5">
                              <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mb-2">Message from {wish.name}:</p>
                              <p className="font-serif italic text-slate-700">"{wish.message}"</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-full py-6 font-typewriter uppercase text-xs tracking-widest">
                                Keep It
                              </Button>
                              <Button onClick={() => handleDelete(wish.id)} variant="destructive" className="flex-1 rounded-full py-6 bg-red-500 hover:bg-red-600 text-white font-typewriter uppercase text-xs tracking-widest">
                                Delete Now
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {wishes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic font-serif">No wishes found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}
