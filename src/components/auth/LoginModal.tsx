"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        router.push("/admin/dashboard");
        onClose();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 border-primary/10">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-3xl font-serif">Admin Login</DialogTitle>
          <p className="text-muted-foreground font-serif italic text-sm mt-2">
            Enter your credentials to access the dashboard
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="pl-12 rounded-2xl border-primary/10 h-14"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pl-12 rounded-2xl border-primary/10 h-14"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-serif italic text-center">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-primary text-white font-serif text-xl shadow-lg hover:translate-y-[-2px] transition-all active:scale-95"
          >
            {isLoading ? "Logging in..." : "Login to Dashboard"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
