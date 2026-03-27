"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, History, Heart, Star, MapPin, Calendar, Clock, GripHorizontal, Camera, Music, Utensils, Plane, Flag, Smile, Moon, Sun, Flame, Sparkles, Coffee, Gift, Wine } from "lucide-react";
import { Story as StoryType } from "@/types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
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

const ICON_OPTIONS = [
  { name: "Heart", icon: <Heart size={16} /> },
  { name: "Star", icon: <Star size={16} /> },
  { name: "MapPin", icon: <MapPin size={16} /> },
  { name: "Calendar", icon: <Calendar size={16} /> },
  { name: "Clock", icon: <Clock size={16} /> },
  { name: "Camera", icon: <Camera size={16} /> },
  { name: "Music", icon: <Music size={16} /> },
  { name: "Utensils", icon: <Utensils size={16} /> },
  { name: "Plane", icon: <Plane size={16} /> },
  { name: "Flag", icon: <Flag size={16} /> },
  { name: "Smile", icon: <Smile size={16} /> },
  { name: "Moon", icon: <Moon size={16} /> },
  { name: "Sun", icon: <Sun size={16} /> },
  { name: "Flame", icon: <Flame size={16} /> },
  { name: "Sparkles", icon: <Sparkles size={16} /> },
  { name: "Coffee", icon: <Coffee size={16} /> },
  { name: "Gift", icon: <Gift size={16} /> },
  { name: "Wine", icon: <Wine size={16} /> },
];

export default function StoryPage() {
  const { status } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState<StoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState<StoryType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("Heart");
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (status === "authenticated") {
      fetchStories();
    }
  }, [status, router]);

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/admin/story");
      const data = await res.json();
      setStories(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    if (editingStory) formData.append("id", editingStory.id);

    try {
      const method = editingStory ? "PUT" : "POST";

      const res = await fetch("/api/admin/story", {
        method,
        body: formData,
      });

      if (res.ok) {
        toast.success(editingStory ? "Story updated!" : "Story created!");
        setIsDialogOpen(false);
        setEditingStory(null);
        fetchStories();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save story");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/story?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Story deleted");
        setDeleteConfirmId(null);
        fetchStories();
      } else {
        toast.error("Failed to delete story");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const items = Array.from(stories);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    // Calculate new order values based on array position
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    // Optimistic UI update
    setStories(updatedItems);

    try {
      const res = await fetch("/api/admin/story", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItems.map(item => ({ id: item.id, order: item.order }))),
      });

      if (!res.ok) {
        toast.error("Failed to save new story order");
        // Reload on failure
        fetchStories();
      } else {
        toast.success("Story order updated");
      }
    } catch (error) {
      console.error("Error updating story order:", error);
      toast.error("Failed to save new story order");
    }
  };

   const openAddModal = () => {
    setEditingStory(null);
    setSelectedIcon("Heart");
    setIsDialogOpen(true);
    if (formRef.current) formRef.current.reset();
  };

  const openEditModal = (story: StoryType) => {
    setEditingStory(story);
    setSelectedIcon(story.icon || "Heart");
    setIsDialogOpen(true);
    setTimeout(() => {
      const form = formRef.current;
      if (form) {
        (form.elements.namedItem("date") as HTMLInputElement).value = story.date;
        (form.elements.namedItem("title") as HTMLInputElement).value = story.title;
        (form.elements.namedItem("description") as HTMLTextAreaElement).value = story.description;
        // Icon and Image are handled by radio buttons and file input respectively, 
        // but we'll stick to the existing radio/file logic.
      }
    }, 0);
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif mb-2">Journey of Love</h2>
          <p className="text-muted-foreground font-typewriter text-sm uppercase tracking-wider">Manage your love story milestones</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger 
            render={
              <Button onClick={openAddModal} className="rounded-full px-6 py-6 shadow-lg shadow-primary/20 hover:shadow-xl transition-all gap-2">
                <Plus size={18} /> 
                <span>Add Milestone</span>
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[500px] border-primary/10">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">{editingStory ? "Edit Milestone" : "New Milestone"}</DialogTitle>
                <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                  Share a moment from your relationship.
                </DialogDescription>
              </DialogHeader>
              
              <DialogBody className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-typewriter ml-1">Date / Period</Label>
                  <Input name="date" defaultValue={editingStory?.date} placeholder="January 2022" className="rounded-xl" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-typewriter ml-1">Title</Label>
                  <Input name="title" defaultValue={editingStory?.title} placeholder="The First Meet" className="rounded-xl" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-typewriter ml-1">Description</Label>
                  <textarea name="description" defaultValue={editingStory?.description} placeholder="Describe the moment..." className="w-full p-3 rounded-xl border border-primary/10 bg-muted/10 focus:outline-primary min-h-[100px]" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-typewriter ml-1">Photo</Label>
                  <Input type="file" name="imageFile" accept="image/*" className="rounded-xl border-primary/10 text-xs file:bg-primary/10 file:text-primary" />
                  {editingStory?.image && (
                    <p className="text-[10px] text-muted-foreground mt-1">Current: <span className="underline">{editingStory.image.split('/').pop()}</span></p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-typewriter ml-1">Icon</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {ICON_OPTIONS.map((option) => (
                      <label 
                        key={option.name} 
                        className={`flex-1 p-2 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-1 ${selectedIcon === option.name ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-muted/10 border-transparent hover:bg-muted/20'}`}
                        onClick={() => setSelectedIcon(option.name)}
                      >
                        <input 
                          type="radio" 
                          name="icon" 
                          value={option.name} 
                          checked={selectedIcon === option.name}
                          onChange={() => setSelectedIcon(option.name)}
                          className="hidden" 
                        />
                        {option.icon}
                        <span className="text-[9px] uppercase tracking-tighter">{option.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </DialogBody>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-full py-6">Cancel</Button>
                <Button type="submit" disabled={saving} className="flex-2 rounded-full py-6 px-10">
                  {saving ? "Saving..." : editingStory ? "Update Story" : "Create Story"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="story-list" direction="horizontal">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {stories.map((story, index) => (
                  <Draggable key={story.id} draggableId={story.id} index={index}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white p-6 rounded-3xl shadow-sm border border-primary/5 relative group ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary scale-105 z-50' : ''}`}
                        style={provided.draggableProps.style}
                      >
                        <div 
                          {...provided.dragHandleProps}
                          className="absolute top-4 left-4 p-2 bg-white/80 shadow-sm text-muted-foreground rounded-full hover:bg-primary/10 hover:text-primary transition-all cursor-grab z-10 md:opacity-0 md:group-hover:opacity-100"
                        >
                          <GripHorizontal size={14} />
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                          <button onClick={() => openEditModal(story)} className="p-2 bg-white/80 shadow-sm text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                            <Edit2 size={14} />
                          </button>
                          
                          <Dialog open={deleteConfirmId === story.id} onOpenChange={(open) => setDeleteConfirmId(open ? story.id : null)}>
                            <DialogTrigger 
                              render={
                                <button className="p-2 bg-white/80 shadow-sm text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all">
                                  <Trash2 size={14} />
                                </button>
                              }
                            />
                            <DialogContent className="sm:max-w-[400px] border-red-100 cursor-default">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-serif text-red-600">Confirm Delete</DialogTitle>
                                <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                                  Are you sure you want to delete this story?
                                </DialogDescription>
                              </DialogHeader>
                              
                              <DialogBody>
                                <div className="bg-muted/30 p-4 rounded-2xl border border-primary/5">
                                  <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mb-1">Moment to delete:</p>
                                  <p className="font-serif text-lg">{story.title}</p>
                                  <p className="text-[10px] font-medium uppercase tracking-tighter">{story.date}</p>
                                </div>
                              </DialogBody>
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-full py-6">
                                  Cancel
                                </Button>
                                <Button onClick={() => handleDelete(story.id)} variant="destructive" className="flex-1 rounded-full py-6 bg-red-500 hover:bg-red-600 text-white">
                                  Delete Now
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        
                        <div className="flex items-start gap-4 mb-4 mt-8">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            {ICON_OPTIONS.find(i => i.name === story.icon)?.icon || <Heart size={16} />}
                          </div>
                          <div>
                            <span className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground">{story.date}</span>
                            <h3 className="text-lg font-bold font-serif leading-tight">{story.title}</h3>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground font-serif italic line-clamp-3 mb-4">
                           "{story.description}"
                        </p>
                        
                        {story.image && (
                          <div className="aspect-video relative rounded-2xl overflow-hidden mt-2 border border-primary/5">
                            <img src={story.image} alt={story.title} className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {stories.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-primary/20">
            <History className="mx-auto text-primary/20 mb-4" size={48} />
            <p className="text-muted-foreground font-serif italic">No milestones added yet. Start your journey!</p>
          </div>
        )}
      </div>
    </div>
  );
}
