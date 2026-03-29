"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, MessageSquare, CheckCircle, XCircle, Heart } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (authStatus === "authenticated") {
      fetchWishes();
    }
  }, [authStatus, router, currentPage]);

  const fetchWishes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/wishes?page=${currentPage}&limit=${itemsPerPage}`);
      if (res.ok) {
        const data = await res.json();
        setWishes(data.data || []);
        setTotalCount(data.total || 0);
        setTotalPages(data.pages || 1);
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
        toast.success(`Wish ${newStatus === 1 ? 'published' : 'unpublished'} successfully!`);
        fetchWishes();
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
        toast.success("Wish deleted successfully!");
        setDeleteConfirmId(null);
        fetchWishes();
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
            {totalCount} Total
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-muted/30">
                  <TableHead className="px-6 py-4">Guest Name</TableHead>
                  <TableHead className="px-6 py-4">Message</TableHead>
                  <TableHead className="px-6 py-4">Likes</TableHead>
                  <TableHead className="px-6 py-4">Status</TableHead>
                  <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-serif">
                {wishes.map((wish) => (
                  <TableRow key={wish.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors group">
                    <TableCell className="px-6 py-5">
                      <div className="flex flex-col">
                        <p className="font-bold text-slate-800 text-lg">{wish.guest?.name || wish.name}</p>
                        <p className="text-[10px] text-primary font-typewriter uppercase tracking-widest mt-0.5">Original Name</p>
                        
                        <div className="mt-3 pt-2 border-t border-primary/5">
                          <p className="text-sm text-slate-600 font-medium">{wish.name}</p>
                          <p className="text-[9px] text-muted-foreground font-typewriter uppercase tracking-widest">As Submitted</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 max-w-md">
                      <p className="text-sm font-serif italic text-slate-700 leading-relaxed whitespace-normal break-words">"{wish.message}"</p>
                      <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-typewriter">
                        <MessageSquare size={10} />
                        {new Date(wish.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-full w-fit border border-red-100">
                        <Heart size={12} fill="currentColor" />
                        <span className="text-sm font-bold leading-none">{wish.likes || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div 
                        onClick={() => toggleStatus(wish.id, wish.status)}
                        className={`relative w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ${wish.status === 1 ? 'bg-primary' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${wish.status === 1 ? 'translate-x-6' : 'translate-x-0'}`} />
                        <span className={`absolute -right-16 top-1/2 -translate-y-1/2 text-[10px] font-typewriter uppercase tracking-widest ${wish.status === 1 ? 'text-primary' : 'text-slate-400'}`}>
                          {wish.status === 1 ? 'On' : 'Off'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
                          <DialogContent className="sm:max-w-[400px] border-red-100">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-serif text-red-600">Delete Wish</DialogTitle>
                              <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                                Are you sure you want to permanently delete this message?
                              </DialogDescription>
                            </DialogHeader>
                            
                            <DialogBody>
                              <div className="bg-muted/30 p-5 rounded-2xl border border-primary/5">
                                <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mb-2">Message from {wish.name}:</p>
                                <p className="font-serif italic text-slate-700">"{wish.message}"</p>
                              </div>
                            </DialogBody>
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-full py-6 font-typewriter uppercase text-xs tracking-widest">
                                Keep It
                              </Button>
                              <Button onClick={() => handleDelete(wish.id)} variant="destructive" className="flex-1 rounded-full py-6 bg-red-500 hover:bg-red-600 text-white font-typewriter uppercase text-xs tracking-widest">
                                Delete Now
                              </Button>
                            </DialogFooter>
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

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2 font-typewriter uppercase tracking-widest text-[10px]">
            <p className="text-muted-foreground">
              Showing {Math.min(totalCount, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(totalCount, currentPage * itemsPerPage)} of {totalCount} wishes
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-full px-4 h-9 border-primary/10 hover:bg-primary/5 disabled:opacity-30"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, i, arr) => (
                    <div key={p} className="flex items-center">
                      {i > 0 && arr[i-1] !== p - 1 && <span className="mx-1 opacity-50">...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentPage === p ? 'bg-primary text-white shadow-sm' : 'hover:bg-primary/5 text-muted-foreground'}`}
                      >
                        {p}
                      </button>
                    </div>
                  ))
                }
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full px-4 h-9 border-primary/10 hover:bg-primary/5 disabled:opacity-30"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
