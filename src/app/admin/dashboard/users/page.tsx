"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (status === "authenticated") {
      fetchUsers();
    }
  }, [status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setUsername("");
    setName("");
    setPassword("");
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setUsername(user.username);
    setName(user.name || "");
    setPassword(""); // Keep password empty, only fill to change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const isEdit = !!editingId;
    const url = "/api/admin/users";
    
    try {
      const payload = isEdit 
        ? { id: editingId, name, password }
        : { username, name, password };

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save user");
      }

      await fetchUsers();
      resetForm();
      toast.success(`User successfully ${isEdit ? 'updated' : 'added'}!`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string, currentUsername: string) => {
    if (!confirm(`Are you sure you want to delete admin "${currentUsername}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete user");
      }
      setUsers(users.filter(u => u.id !== id));
      toast.success("User deleted successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
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
        <h2 className="text-2xl font-serif mb-6">Manage Admin Users</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Form */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 h-fit">
            <h3 className="text-lg font-bold text-primary mb-6">
              {editingId ? "Edit Admin" : "Add New Admin"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest font-typewriter text-muted-foreground mb-1">Username</label>
                <input 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!!editingId}
                  className="w-full p-3 rounded-xl border bg-muted/20 focus:outline-primary disabled:opacity-50" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-typewriter text-muted-foreground mb-1">Full Name</label>
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Optional"
                  className="w-full p-3 rounded-xl border bg-muted/20 focus:outline-primary" 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-typewriter text-muted-foreground mb-1">
                  {editingId ? "New Password (leave empty to keep current)" : "Password"}
                </label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingId}
                  className="w-full p-3 rounded-xl border bg-muted/20 focus:outline-primary" 
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={processing} className="w-full flex-1 rounded-full py-6">
                  {processing ? "Saving..." : (editingId ? "Update Admin" : "Add Admin")}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="flex-1 rounded-full py-6"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* User List */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 border-b font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-muted/30">
                    <TableHead className="px-6 py-4">Username / Name</TableHead>
                    <TableHead className="px-6 py-4">Created Date</TableHead>
                    <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-serif">
                  {users.map((user, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="px-6 py-4">
                        <p className="font-bold">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.name || 'No name provided'}</p>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-full"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(user.id, user.username)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="px-6 py-12 text-center text-muted-foreground italic font-serif">No users found.</TableCell>
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
