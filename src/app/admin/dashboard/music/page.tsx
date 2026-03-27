"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Music, Play, CheckCircle2 } from "lucide-react";
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
import { Song } from "@/types";

export default function MusicPage() {
  const { status } = useSession();
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSong, setSavingSong] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }

    if (status === "authenticated") {
      fetchSongs();
    }
  }, [status, router]);

  const fetchSongs = async () => {
    try {
      const res = await fetch("/api/admin/songs");
      const data = await res.json();
      setSongs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSong = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingSong(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title"),
      artist: formData.get("artist"),
      url: formData.get("url"),
      isActive: formData.get("isActive") === "true",
    };

    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...payload, id: editingId } : payload;

    try {
      const res = await fetch("/api/admin/songs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editingId ? "Song updated successfully!" : "Song added successfully!");
        setIsDialogOpen(false);
        setEditingId(null);
        fetchSongs();
      } else {
        toast.error("Failed to save song");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save song");
    } finally {
      setSavingSong(false);
    }
  };

  const handleDeleteSong = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/songs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Song deleted successfully!");
        setDeleteConfirmId(null);
        fetchSongs();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete song");
    }
  };

  const handleToggleActive = async (song: Song) => {
    try {
      const res = await fetch("/api/admin/songs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...song, isActive: !song.isActive }),
      });
      if (res.ok) {
        toast.success(song.isActive ? "Song deactivated" : "Song activated!");
        fetchSongs();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleEdit = (s: Song) => {
    setEditingId(s.id);
    setIsDialogOpen(true);
    setTimeout(() => {
      if (formRef.current) {
        (formRef.current.elements.namedItem("title") as HTMLInputElement).value = s.title;
        (formRef.current.elements.namedItem("artist") as HTMLInputElement).value = s.artist || "";
        (formRef.current.elements.namedItem("url") as HTMLInputElement).value = s.url;
        (formRef.current.elements.namedItem("isActive") as HTMLSelectElement).value = String(s.isActive);
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
            <h2 className="text-3xl font-serif mb-2">Manage Music</h2>
            <p className="text-muted-foreground font-typewriter text-sm uppercase tracking-wider">Configure background music for your invitation</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger 
              render={
                <Button onClick={openAddDialog} className="rounded-full px-6 py-6 shadow-lg shadow-primary/20 hover:shadow-xl transition-all gap-2">
                  <Plus size={18} />
                  <span>Add Song</span>
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-primary/10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">{editingId ? "Edit Song" : "Add Song"}</DialogTitle>
                <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                  Enter the details for the background music.
                </DialogDescription>
              </DialogHeader>
              <form ref={formRef} onSubmit={handleSaveSong} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs uppercase tracking-[0.2em] font-typewriter ml-1">Song Title</Label>
                  <Input id="title" name="title" placeholder="e.g. Can't Help Falling In Love" className="rounded-xl border-primary/10 focus-visible:ring-primary bg-muted/20" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist" className="text-xs uppercase tracking-[0.2em] font-typewriter ml-1">Artist (Optional)</Label>
                  <Input id="artist" name="artist" placeholder="e.g. Elvis Presley" className="rounded-xl border-primary/10 focus-visible:ring-primary bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-xs uppercase tracking-[0.2em] font-typewriter ml-1">MP3 URL</Label>
                  <Input id="url" name="url" placeholder="https://example.com/music.mp3" className="rounded-xl border-primary/10 focus-visible:ring-primary bg-muted/20" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive" className="text-xs uppercase tracking-[0.2em] font-typewriter ml-1">Status</Label>
                  <select id="isActive" name="isActive" className="w-full p-3 rounded-xl border border-primary/10 bg-muted/20 focus:outline-primary text-sm">
                    <option value="false">Inactive</option>
                    <option value="true">Active (Play automatically)</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-full py-6 border-primary/10">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingSong} className="flex-2 rounded-full py-6 px-10">
                    {savingSong ? "Saving..." : editingId ? "Update Song" : "Create Song"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {songs.length === 0 ? (
            <div className="col-span-full bg-white rounded-[3rem] p-24 text-center border border-dashed border-primary/20 flex flex-col items-center justify-center gap-4">
              <div className="p-4 bg-muted/30 rounded-full text-muted-foreground/30">
                <Music size={48} />
              </div>
              <p className="text-muted-foreground italic font-serif text-lg">No songs added yet.</p>
              <Button onClick={openAddDialog} variant="outline" className="rounded-full mt-2 border-primary/20">Add Your First Song</Button>
            </div>
          ) : (
            songs.map((s) => (
              <div key={s.id} className={`bg-white p-8 rounded-[3rem] shadow-sm border ${s.isActive ? 'border-primary/30 ring-4 ring-primary/5' : 'border-primary/5'} flex flex-col justify-between relative group hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500`}>
                {s.isActive && (
                  <div className="absolute -top-1 -right-1 bg-primary text-white p-2 rounded-full shadow-lg z-20">
                    <CheckCircle2 size={16} />
                  </div>
                )}
                
                <div className="absolute top-10 right-10 text-primary/10 group-hover:text-primary/20 transition-colors">
                  <Music size={64} />
                </div>

                <div className="relative z-10 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-[1px] w-6 bg-primary/30"></span>
                    <p className="font-typewriter text-[10px] uppercase tracking-[0.3em] text-primary">
                      {s.isActive ? "Now Playing" : "Library"}
                    </p>
                  </div>
                  <h3 className="text-2xl font-serif mb-1 tracking-wide text-slate-800 line-clamp-1">{s.title}</h3>
                  <p className="text-xs font-typewriter text-muted-foreground uppercase tracking-widest">{s.artist || "Unknown Artist"}</p>
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => window.open(s.url, '_blank')}
                      className="rounded-full border-primary/10 hover:bg-primary/5 h-10 w-10"
                    >
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    </Button>
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full bg-primary ${s.isActive ? 'w-1/2' : 'w-0'}`} />
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      variant={s.isActive ? "default" : "outline"}
                      size="sm" 
                      onClick={() => handleToggleActive(s)}
                      className="flex-1 rounded-full border-primary/10 gap-2 h-10 text-[10px] uppercase tracking-widest font-typewriter"
                    >
                      {s.isActive ? "Active" : "Set Active"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(s)} className="rounded-full border-primary/10 hover:bg-primary/5 h-10 px-4">
                      <Pencil size={14} />
                    </Button>
                    <Dialog open={deleteConfirmId === s.id} onOpenChange={(open) => setDeleteConfirmId(open ? s.id : null)}>
                      <DialogTrigger 
                        render={
                          <Button variant="ghost" size="sm" className="rounded-full text-red-500 hover:bg-red-50 h-10 px-4">
                            <Trash2 size={16} />
                          </Button>
                        }
                      />
                      <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-red-100">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-serif text-red-600">Delete Song</DialogTitle>
                          <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                            Are you sure you want to delete this song?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="bg-muted/30 p-4 rounded-2xl mb-4 border border-primary/5">
                          <p className="text-xs font-typewriter uppercase tracking-widest text-muted-foreground mb-1">Song to delete:</p>
                          <p className="font-serif text-lg">{s.title}</p>
                          <p className="text-xs font-medium uppercase tracking-tighter">{s.artist}</p>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-full py-6">
                            Cancel
                          </Button>
                          <Button onClick={() => handleDeleteSong(s.id)} variant="destructive" className="flex-1 rounded-full py-6 bg-red-500 hover:bg-red-600 text-white">
                            Delete Now
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
