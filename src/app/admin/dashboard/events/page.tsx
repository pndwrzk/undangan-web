"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, Calendar, Clock, Plus, Pencil, Trash2 } from "lucide-react";
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

export default function EventsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingEvent, setSavingEvent] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (status === "authenticated") {
      fetch("/api/admin/events")
        .then(res => res.json())
        .then(data => setEvents(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  const handleSaveEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingEvent(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    
    const method = editingId ? "PUT" : "POST";
    if (editingId) payload.id = editingId;

    try {
      const res = await fetch("/api/admin/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const savedEvent = await res.json();
        if (editingId) {
          setEvents(events.map(ev => ev.id === editingId ? savedEvent : ev));
          toast.success("Event updated successfully!");
        } else {
          setEvents([...events, savedEvent]);
          toast.success("Event added successfully!");
        }
        (e.target as HTMLFormElement).reset();
        setIsDialogOpen(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save event");
    } finally {
      setSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(events.filter(ev => ev.id !== id));
        toast.success("Event deleted successfully!");
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event");
    }
  };

  const handleEdit = (ev: any) => {
    setEditingId(ev.id);
    setIsDialogOpen(true);
    setTimeout(() => {
      const form = formRef.current;
      if (form) {
        (form.elements.namedItem("title") as HTMLInputElement).value = ev.title;
        (form.elements.namedItem("subtitle") as HTMLInputElement).value = ev.subtitle || "";
        (form.elements.namedItem("time") as HTMLInputElement).value = ev.time;
        (form.elements.namedItem("date") as HTMLInputElement).value = ev.date;
        (form.elements.namedItem("location") as HTMLInputElement).value = ev.location;
        (form.elements.namedItem("address") as HTMLTextAreaElement).value = ev.address;
        (form.elements.namedItem("mapUrl") as HTMLInputElement).value = ev.mapUrl;
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-serif mb-2">Manage Events</h2>
            <p className="text-muted-foreground font-typewriter text-sm uppercase tracking-wider">Configure wedding ceremonies and celebrations</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger 
              render={
                <Button onClick={openAddDialog} className="rounded-full px-6 py-6 shadow-lg shadow-primary/20 hover:shadow-xl transition-all gap-2">
                  <Plus size={18} />
                  <span>Add Event</span>
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-primary/10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">{editingId ? "Edit Event" : "Add New Event"}</DialogTitle>
                <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                  Enter the details for the wedding event.
                </DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleSaveEvent} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Event Title</Label>
                  <Input name="title" placeholder="e.g. Akad Nikah" className="rounded-xl border-primary/10" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Subtitle / Description</Label>
                  <Input name="subtitle" placeholder="e.g. The Wedding Ceremony" className="rounded-xl border-primary/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Date</Label>
                    <Input name="date" placeholder="Saturday, 12 Sept 2026" className="rounded-xl border-primary/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Time</Label>
                    <Input name="time" placeholder="09:00 AM - 11:00 AM" className="rounded-xl border-primary/10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Location Title</Label>
                  <Input name="location" placeholder="e.g. St. Mary's Cathedral" className="rounded-xl border-primary/10" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Full Address</Label>
                  <textarea name="address" className="w-full p-3 rounded-xl border border-primary/10 bg-muted/10 focus:outline-primary min-h-[80px]" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-typewriter ml-1">Google Maps URL</Label>
                  <Input name="mapUrl" type="url" placeholder="https://goo.gl/maps/..." className="rounded-xl border-primary/10" required />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-full py-6">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingEvent} className="flex-2 rounded-full py-6 px-10">
                    {savingEvent ? "Saving..." : editingId ? "Update Event" : "Create Event"}
                  </Button>
                </div>
              </form>
            </DialogContent>
        </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-8">
             {events.length === 0 ? (
               <div className="bg-white rounded-3xl p-12 text-center text-muted-foreground italic font-serif border border-primary/5 shadow-sm">
                 No events configured yet. Add one!
               </div>
             ) : (
               events.map((ev, idx) => (
                 <div key={ev.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-primary/5 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none" />
                   
                   <div className="flex-1 w-full space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-typewriter text-[10px] uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-full">
                          {ev.title}
                        </span>
                        <h4 className="font-serif text-xl">{ev.subtitle || ev.title}</h4>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar size={16} className="text-primary/50" />
                          <span>{ev.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Clock size={16} className="text-primary/50" />
                          <span>{ev.time}</span>
                        </div>
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <MapPin size={16} className="text-primary/50 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-foreground">{ev.location}</p>
                            <p className="text-xs mt-1">{ev.address}</p>
                            <a href={ev.mapUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline mt-2 inline-block">View on Maps</a>
                          </div>
                        </div>
                      </div>
                   </div>

                   <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
                     <Button variant="outline" onClick={() => handleEdit(ev)} className="flex-1 rounded-full border-primary/20 hover:bg-primary/5 gap-2 group-hover:bg-primary/5">
                        <Pencil size={14} />
                        Edit
                     </Button>
                     
                     <Dialog open={deleteConfirmId === ev.id} onOpenChange={(open) => setDeleteConfirmId(open ? ev.id : null)}>
                        <DialogTrigger 
                          render={
                            <Button variant="ghost" className="flex-1 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 gap-2">
                              <Trash2 size={14} />
                              Delete
                            </Button>
                          }
                        />
                        <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-red-100">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-serif text-red-600">Confirm Delete</DialogTitle>
                            <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                              Are you sure you want to delete this event? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="bg-muted/30 p-4 rounded-2xl mb-4 border border-primary/5">
                            <p className="text-xs font-typewriter uppercase tracking-widest text-muted-foreground mb-1">Event to delete:</p>
                            <p className="font-serif text-lg">{ev.title}</p>
                            <p className="text-xs font-medium uppercase tracking-tighter">{ev.date} at {ev.time}</p>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-full py-6">
                              Cancel
                            </Button>
                            <Button onClick={() => handleDeleteEvent(ev.id)} variant="destructive" className="flex-1 rounded-full py-6 bg-red-500 hover:bg-red-600 text-white">
                              Delete Now
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                   </div>
                 </div>
               ))
             )}
          </div>
      </section>
    </div>
  );
}
