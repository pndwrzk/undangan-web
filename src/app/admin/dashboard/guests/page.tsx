"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus, Pencil, Trash2, Search, Filter, Copy, CheckCircle2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GuestsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingGuest, setSavingGuest] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, router, currentPage, debouncedSearch]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/guests?page=${currentPage}&limit=${itemsPerPage}&q=${encodeURIComponent(debouncedSearch)}`);
      const data = await res.json();
      setGuests(data.data || []);
      setTotalCount(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch guests");
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setEditingId(null);
    if (formRef.current) {
      formRef.current.reset();
    }
    setIsDialogOpen(true);
  };

  const handleEdit = (guest: any) => {
    setEditingId(guest.id);
    setIsDialogOpen(true);
    setTimeout(() => {
      if (formRef.current) {
        const form = formRef.current as any;
        form.name.value = guest.name;
        form.group.value = guest.group || "";
        form.phone.value = guest.phone || "";
        form.partnerName.value = guest.partnerName || "";
        form.side.value = guest.side !== undefined ? String(guest.side) : "0";
      }
    }, 0);
  };

  const handleSaveGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingGuest(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const group = formData.get("group");
    const phone = formData.get("phone");
    const partnerName = formData.get("partnerName");
    const side = formData.get("side");

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/admin/guests?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, group, phone, side, partnerName }),
        });
      } else {
        res = await fetch("/api/admin/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, group, phone, side, partnerName }),
        });
      }
      
      if (res.ok) {
        toast.success(editingId ? "Guest updated successfully!" : "Guest added successfully!");
        (e.target as HTMLFormElement).reset();
        setIsDialogOpen(false);
        setEditingId(null);
        fetchData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to save guest");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save guest");
    } finally {
      setSavingGuest(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/guests?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Guest removed successfully!");
        setDeleteConfirmId(null);
        fetchData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to delete guest");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete guest");
    }
  };

  const generateLink = (code: string | null, id: string) => {
    if (typeof window === "undefined") return "";
    const baseUrl = window.location.origin;
    const identifier = code || id;
    return `${baseUrl}/?guest_code=${identifier}`;
  };

  const copyInvitationLink = async (guest: any) => {
    const link = generateLink(guest.code, guest.id);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = link;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedId(guest.id);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy link");
    }
  };

  const sendWhatsApp = (name: string, code: string | null, id: string, phone: string) => {
    const link = generateLink(code, id);
    const message = `Halo ${name},\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i ke acara pernikahan kami.\n\nBerikut adalah link undangan digital kami:\n${link}\n\nMerupakan suatu kehormatan bagi kami jika Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Remove client-side filtering and pagination calculations
  // They are now handled by fetchData and the API

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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-serif mb-2">Manage Guests</h2>
            <p className="text-muted-foreground font-typewriter text-sm uppercase tracking-wider">Configure invitation list and groups</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger 
              render={
                <Button onClick={openAddDialog} className="rounded-full px-6 py-6 shadow-lg shadow-primary/20 hover:shadow-xl transition-all gap-2">
                  <UserPlus size={18} />
                  <span>Add Guest</span>
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[450px] border-primary/10">
              <form ref={formRef} onSubmit={handleSaveGuest} className="flex flex-col max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif">{editingId ? "Edit Guest" : "Add New Guest"}</DialogTitle>
                  <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                    Enter the details for the wedding guest.
                  </DialogDescription>
                </DialogHeader>
                
                <DialogBody className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Guest Name</Label>
                    <Input name="name" placeholder="e.g. John Doe" className="rounded-xl border-primary/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Group / Category</Label>
                    <Input name="group" placeholder="e.g. High School Friends" className="rounded-xl border-primary/10" />
                  </div>
                    <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">WhatsApp Number</Label>
                    <Input 
                      name="phone" 
                      placeholder="e.g. 62812345678" 
                      className="rounded-xl border-primary/10" 
                      pattern="628[0-9]*"
                      title="Nomor WhatsApp harus diawali dengan 628"
                      required
                    />
                    <p className="text-[10px] text-muted-foreground font-typewriter ml-1 italic">Wajib diawali 628 (contoh: 628123456789)</p>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Partner Name (Optional)</Label>
                    <Input name="partnerName" placeholder="e.g. Jane Doe" className="rounded-xl border-primary/10" />
                    <p className="text-[10px] text-muted-foreground font-typewriter ml-1 italic">Leave empty if invited alone</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Guest Side</Label>
                    <select name="side" className="w-full flex h-10 items-center justify-between rounded-xl border border-primary/10 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="0">Bride / Mempelai Wanita (0)</option>
                      <option value="1">Groom / Mempelai Pria (1)</option>
                    </select>
                  </div>
                </DialogBody>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-full py-6">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingGuest} className="flex-2 rounded-full py-6 px-10">
                    {savingGuest ? "Saving..." : editingId ? "Update Guest" : "Create Guest"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search guest name or group..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border border-primary/10 bg-white focus:outline-primary shadow-sm font-serif"
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground px-4 bg-white py-4 rounded-full border border-primary/5 shadow-sm">
              <Filter size={14} />
              <span>{totalCount} Guests found</span>
            </div>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-primary/5 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 border-b border-primary/5 font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-muted/30">
                    <TableHead className="px-6 py-5">Guest Information</TableHead>
                    <TableHead className="px-6 py-5">Group</TableHead>
                    <TableHead className="px-6 py-5 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-serif">
                  {guests.map((guest) => (
                    <TableRow key={guest.id} className="border-b border-primary/5 last:border-0 hover:bg-primary/5 transition-colors group">
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-800 text-lg">{guest.name}</p>
                          {guest.code && (
                            <span className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded text-[10px] font-mono font-bold tracking-wider">
                              {guest.code}
                            </span>
                          )}
                        </div>
                        {guest.partnerName && (
                          <p className="text-xs text-primary font-typewriter tracking-tight flex items-center gap-1 mb-1">
                            <span className="opacity-50">&</span> {guest.partnerName}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground font-typewriter tracking-tight">{guest.phone || 'No phone number'}</p>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-3 py-1 bg-secondary/10 text-secondary-foreground rounded-full text-[10px] uppercase tracking-widest font-typewriter border border-secondary/20">
                            {guest.side === 1 ? "Groom's Guest" : "Bride's Guest"}
                          </span>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] uppercase tracking-widest font-typewriter">
                            {guest.group || "Uncategorized"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          {guest.phone && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="rounded-full bg-green-50 text-green-600 border-green-200 hover:bg-green-100 px-4"
                              onClick={() => sendWhatsApp(guest.name, guest.code, guest.id, guest.phone)}
                            >
                              WhatsApp
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-full bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 gap-2 px-4"
                            onClick={() => copyInvitationLink(guest)}
                          >
                            {copiedId === guest.id ? <CheckCircle2 size={14} className="text-green-600" /> : <Copy size={14} />}
                            {copiedId === guest.id ? 'Copied' : 'Copy Link'}
                          </Button>
                          
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(guest)} className="rounded-full hover:bg-primary/10 h-9 w-9 p-0">
                            <Pencil size={14} />
                          </Button>

                          <Dialog open={deleteConfirmId === guest.id} onOpenChange={(open) => setDeleteConfirmId(open ? guest.id : null)}>
                            <DialogTrigger render={
                              <Button variant="ghost" size="icon" className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 h-9 w-9 p-0">
                                <Trash2 size={16} />
                              </Button>
                            }/>
                            <DialogContent className="sm:max-w-[400px] border-red-100">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-serif text-red-600">Remove Guest</DialogTitle>
                                <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                                  Are you sure you want to remove this guest?
                                </DialogDescription>
                              </DialogHeader>
                              
                              <DialogBody>
                                <div className="bg-muted/30 p-5 rounded-2xl border border-primary/5">
                                  <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mb-1">Guest to remove:</p>
                                  <p className="font-serif text-xl">{guest.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{guest.group || "Uncategorized"}</p>
                                </div>
                              </DialogBody>
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-full py-6">
                                  Cancel
                                </Button>
                                <Button onClick={() => handleDeleteGuest(guest.id)} variant="destructive" className="flex-1 rounded-full py-6 bg-red-500 hover:bg-red-600 text-white">
                                  Remove Now
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {guests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="px-6 py-16 text-center text-muted-foreground font-serif italic text-lg">
                        No guests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2 font-typewriter uppercase tracking-widest text-[10px]">
              <p className="text-muted-foreground">
                Showing {Math.min(totalCount, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(totalCount, currentPage * itemsPerPage)} of {totalCount} guests
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
        </div>
      </section>
    </div>
  );
}
