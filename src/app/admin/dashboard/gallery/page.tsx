"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2, Image as ImageIcon, X, GripHorizontal, Pencil } from "lucide-react";
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

export default function GalleryPage() {
  const { status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingGallery, setSavingGallery] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (status === "authenticated") {
      fetch("/api/admin/gallery")
        .then(res => res.json())
        .then(data => setImages(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, router]);
  
  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setSelectedItem(item);
    setIsDialogOpen(true);
    // Use timeout to ensure form is rendered
    setTimeout(() => {
      if (formRef.current) {
        (formRef.current.elements.namedItem("title") as HTMLInputElement).value = item.caption || item.title || "";
      }
    }, 0);
  };

  const handleUploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingGallery(true);
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("imageFile") as File;

    if (!editingId && (!imageFile || imageFile.size === 0)) {
      toast.error("Please select an image to upload");
      setSavingGallery(false);
      return;
    }

    if (editingId) formData.append("id", editingId);

    try {
      const res = await fetch("/api/admin/gallery", {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });
      if (res.ok) {
        const result = await res.json();
        if (editingId) {
          setImages(images.map(img => img.id === editingId ? result : img));
          toast.success("Image updated successfully!");
        } else {
          setImages([result, ...images]);
          toast.success("Image uploaded successfully!");
        }
        setIsDialogOpen(false);
        setEditingId(null);
        setSelectedItem(null);
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(`Failed to ${editingId ? 'update' : 'upload'} image.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during upload.");
    } finally {
      setSavingGallery(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setImages(images.filter(img => img.id !== id));
        toast.success("Image deleted successfully!");
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    // Calculate new order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    // Optimistic update
    setImages(updatedItems);

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItems.map(item => ({ id: item.id, order: item.order }))),
      });

      if (!res.ok) {
        toast.error("Failed to save new image order");
        // Reload on failure to restore state
        const refresh = await fetch("/api/admin/gallery");
        const data = await refresh.json();
        setImages(Array.isArray(data) ? data : []);
      } else {
        toast.success("Image order updated");
      }
    } catch (error) {
      console.error("Error updating sort order:", error);
      toast.error("Failed to save new image order");
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-serif mb-2">Manage Gallery</h2>
            <p className="text-muted-foreground font-typewriter text-sm uppercase tracking-wider">Upload and manage wedding photos</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingId(null);
              setSelectedItem(null);
            }
          }}>
            <DialogTrigger 
              render={
                <Button className="rounded-full px-6 py-6 shadow-lg shadow-primary/20 hover:shadow-xl transition-all gap-2">
                  <Plus size={18} />
                  <span>Upload Photo</span>
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[450px] border-primary/10">
              <form ref={formRef} onSubmit={handleUploadImage} className="flex flex-col max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif">{editingId ? "Edit Photo" : "Upload Photo"}</DialogTitle>
                  <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                    Choose a high-quality image for your wedding gallery.
                  </DialogDescription>
                </DialogHeader>
                
                <DialogBody className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter ml-1">Photo Title / Caption (Optional)</Label>
                      <Input name="title" placeholder="e.g. Pre-wedding session" className="rounded-xl border-primary/10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-typewriter ml-1">
                        {editingId ? "Replace Image (Optional)" : "Choose Image"}
                      </Label>
                      <Input type="file" name="imageFile" accept="image/*" className="rounded-xl border-primary/10 text-xs file:bg-primary/10 file:text-primary" required={!editingId} />
                    </div>
                  </div>
                </DialogBody>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-full py-6">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingGallery} className="flex-2 rounded-full py-6 px-10">
                    {savingGallery ? (editingId ? "Saving..." : "Uploading...") : (editingId ? "Save Changes" : "Upload Now")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {images.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-muted-foreground italic font-serif border border-primary/5 shadow-sm">
            <ImageIcon size={48} className="mx-auto mb-4 text-primary/20" />
            No photos in the gallery yet. Start your journey!
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="gallery-list" direction="horizontal">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {images.map((img, index) => (
                    <Draggable key={img.id} draggableId={img.id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white rounded-[2rem] shadow-sm border border-primary/5 overflow-hidden group relative ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary scale-105 z-50' : ''}`}
                          style={provided.draggableProps.style}
                        >
                          <div className="aspect-[4/5] relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={img.imageUrl} 
                              alt={img.caption || img.title || "Gallery image"} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
                            />
                            
                            <div 
                              {...provided.dragHandleProps}
                              className="absolute top-2 left-2 bg-white/80 p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-grab hover:bg-white text-muted-foreground hover:text-primary z-20 shadow-sm"
                            >
                              <GripHorizontal size={14} />
                            </div>

                            <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20">
                              <Button 
                                onClick={() => openEditModal(img)} 
                                size="icon" 
                                className="w-8 h-8 rounded-full shadow-lg bg-white/80 text-primary hover:bg-primary hover:text-white border-0 cursor-pointer"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Dialog open={deleteConfirmId === img.id} onOpenChange={(open) => setDeleteConfirmId(open ? img.id : null)}>
                                <DialogTrigger 
                                  render={
                                    <Button variant="destructive" size="icon" className="w-8 h-8 rounded-full shadow-lg bg-white/80 text-red-600 hover:bg-red-600 hover:text-white border-0 cursor-pointer">
                                      <Trash2 size={14} />
                                    </Button>
                                  }
                                />
                                <DialogContent className="sm:max-w-[400px] border-red-100 cursor-default">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl font-serif text-red-600">Confirm Delete</DialogTitle>
                                    <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
                                      Are you sure you want to delete this photo?
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <DialogBody>
                                    <div className="bg-muted/30 p-4 rounded-2xl border border-primary/5">
                                      <div className="aspect-video w-full rounded-xl overflow-hidden mb-3">
                                        <img src={img.imageUrl} alt={img.caption || img.title} className="w-full h-full object-cover" />
                                      </div>
                                      <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mb-1">Photo to delete:</p>
                                      <p className="font-serif text-lg truncate">{img.caption || img.title || "Untitled"}</p>
                                    </div>
                                  </DialogBody>
                                  
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-full py-6">
                                      Cancel
                                    </Button>
                                    <Button onClick={() => handleDeleteImage(img.id)} variant="destructive" className="flex-1 rounded-full py-6 bg-red-500 hover:bg-red-600 text-white">
                                      Delete Now
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          {(img.caption || img.title) && (
                            <div className="p-4 bg-white border-t border-primary/5">
                              <p className="text-xs font-serif italic text-muted-foreground truncate">{img.caption || img.title}</p>
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
        )}
      </section>
    </div>
  );
}
