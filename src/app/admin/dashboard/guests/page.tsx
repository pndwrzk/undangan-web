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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (status === "authenticated") {
      fetch("/api/admin/guests")
        .then(res => res.json())
        .then(data => setGuests(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

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
    const side = formData.get("side");

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/admin/guests?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, group, phone, side }),
        });
      } else {
        res = await fetch("/api/admin/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, group, phone, side }),
        });
      }
      
      if (res.ok) {
        const updatedGuest = await res.json();
        if (editingId) {
          setGuests(guests.map(g => (g.id === editingId ? updatedGuest : g)));
          toast.success("Guest updated successfully!");
        } else {
          setGuests([updatedGuest, ...guests]);
          toast.success("Guest added successfully!");
        }
        (e.target as HTMLFormElement).reset();
        setIsDialogOpen(false);
        setEditingId(null);
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
        setGuests(guests.filter(g => g.id !== id));
        toast.success("Guest removed successfully!");
        setDeleteConfirmId(null);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to delete guest");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete guest");
    }
  };

  const generateLink = (id: string) => {
    if (typeof window === "undefined") return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/?id=${id}`;
  };

  const copyInvitationLink = async (id: string) => {
    const link = generateLink(id);
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
      setCopiedId(id);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy link");
    }
  };

  const sendWhatsApp = (name: string, id: string, phone: string) => {
    const link = generateLink(id);
    const message = `Halo ${name},\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i ke acara pernikahan kami.\n\nBerikut adalah link undangan digital kami:\n${link}\n\nMerupakan suatu kehormatan bagi kami jika Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone?.includes(searchTerm)
  );

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
            <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-primary/10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">{editingId ? "Edit Guest" : "Add New Guest"}</DialogTitle>
                <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                  Enter the details for the wedding guest.
                </DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleSaveGuest} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Guest Name</Label>
                  <Input name="name" placeholder="e.g. John Doe" className="rounded-xl border-primary/10" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Group / Category</Label>
                  <Input name="group" placeholder="e.g. High School Friends" className="rounded-xl border-primary/10" />
                </div>
                 <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">WhatsApp Number</Label>
                  <Input name="phone" placeholder="e.g. 62812345678" className="rounded-xl border-primary/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Guest Side</Label>
                  <select name="side" className="w-full flex h-10 items-center justify-between rounded-xl border border-primary/10 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="0">Bride / Mempelai Wanita (0)</option>
                    <option value="1">Groom / Mempelai Pria (1)</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-full py-6">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingGuest} className="flex-2 rounded-full py-6 px-10">
                    {savingGuest ? "Saving..." : editingId ? "Update Guest" : "Create Guest"}
                  </Button>
                </div>
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
              <span>{filteredGuests.length} Guests found</span>
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
                  {filteredGuests.map((guest) => (
                    <TableRow key={guest.id} className="border-b border-primary/5 last:border-0 hover:bg-primary/5 transition-colors group">
                      <TableCell className="px-6 py-5">
                        <p className="font-bold text-slate-800 text-lg">{guest.name}</p>
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
                              onClick={() => sendWhatsApp(guest.name, guest.id, guest.phone)}
                            >
                              WhatsApp
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-full bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 gap-2 px-4"
                            onClick={() => copyInvitationLink(guest.id)}
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
                            <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-red-100">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-serif text-red-600">Remove Guest</DialogTitle>
                                <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                                  Are you sure you want to remove this guest?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="bg-muted/30 p-5 rounded-2xl mb-4 border border-primary/5">
                                <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mb-1">Guest to remove:</p>
                                <p className="font-serif text-xl">{guest.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{guest.group || "Uncategorized"}</p>
                              </div>
                              <div className="flex gap-3 pt-2">
                                <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-full py-6">
                                  Cancel
                                </Button>
                                <Button onClick={() => handleDeleteGuest(guest.id)} variant="destructive" className="flex-1 rounded-full py-6 bg-red-500 hover:bg-red-600 text-white">
                                  Remove Now
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredGuests.length === 0 && (
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
        </div>
      </section>
    </div>
  );
}
