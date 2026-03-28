"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-primary/5 relative"
      >
        <Link 
          href="/" 
          className="absolute -top-12 left-6 flex items-center gap-2 text-primary/60 hover:text-primary transition-colors font-serif italic text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Invitation
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-2">Admin Login</h1>
          <p className="text-muted-foreground font-serif italic text-sm">Alvia & Pandiwa Wedding Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-2xl border-primary/10 h-14"
              required
            />
          </div>
          <div>
            <label className="block font-typewriter text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border-primary/10 h-14"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs font-serif italic">{error}</p>}
          <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-serif text-xl shadow-lg hover:translate-y-[-2px] transition-all">
            Login to Dashboard
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
