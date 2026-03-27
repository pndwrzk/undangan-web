"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Users, LayoutDashboard, Heart, Shield, Calendar, Gift, Image, MessageSquare, History, Music, Menu, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [couple, setCouple] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    if (status === "authenticated") {
      fetch("/api/admin/couple")
        .then(res => res.json())
        .then(data => setCouple(data))
        .catch(console.error);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const themeStyles = {
    "--primary": couple?.primaryColor || "#BE185D",
    "--secondary": couple?.secondaryColor || "#4338CA",
    "--background": couple?.backgroundColor || "#FDFCF0",
    "--card": couple?.cardColor || "#FFFFFF",
    "--popover": couple?.cardColor || "#FFFFFF",
    "--muted": couple?.mutedColor || "#F3F4F6",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-muted/10 flex flex-col md:flex-row font-sans" style={themeStyles}>
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-lg font-serif text-primary hover:opacity-80 transition-opacity" onClick={() => router.push("/admin/dashboard")}>Wedding Admin</h1>
          <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mt-0.5">
            {couple ? `${couple.brideName} & ${couple.groomName}` : "Dashboard"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => window.open('/', '_blank')} className="hover:bg-primary/5 text-primary">
            <ExternalLink className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="hover:bg-primary/5 bg-transparent text-primary">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-in fade-in-0 duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white border-r flex flex-col shadow-xl z-50 w-72 transform transition-transform duration-300 ease-in-out md:w-64 md:relative md:translate-x-0 md:h-screen md:sticky md:top-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h1 className="text-xl font-serif text-primary">Wedding Admin</h1>
            <p className="text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground mt-1">
              {couple ? `${couple.brideName} & ${couple.groomName}` : "Dashboard"}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto w-full pb-20 md:pb-4">
          <Link href="/admin/dashboard" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <LayoutDashboard size={18} /> Overview
          </Link>
          <Link href="/admin/dashboard/couple" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/dashboard/couple' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Heart size={18} /> Bride & Groom
          </Link>
          <Link href="/admin/dashboard/story" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/dashboard/story' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <History size={18} /> Journey of Love
          </Link>
          <Link href="/admin/dashboard/events" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/dashboard/events' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Calendar size={18} /> Events
          </Link>
          <Link href="/admin/dashboard/music" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/dashboard/music' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Music size={18} /> Music
          </Link>
          <Link href="/admin/dashboard/gifts" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/dashboard/gifts' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Gift size={18} /> Gifts
          </Link>
          <Link href="/admin/dashboard/gallery" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/dashboard/gallery' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Image size={18} /> Gallery
          </Link>
          <Link href="/admin/dashboard/guests" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/dashboard/guests' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Users size={18} /> Guest List
          </Link>
          <Link href="/admin/dashboard/wishes" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/dashboard/wishes' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <MessageSquare size={18} /> Guest Wishes
          </Link>
          <Link href="/admin/dashboard/users" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === '/admin/dashboard/users' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
            <Shield size={18} /> Manage Admins
          </Link>
          <div className="pt-4 mt-4 border-t border-primary/5">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 rounded-xl border-primary/20 text-primary hover:bg-primary/5"
              onClick={() => window.open('/', '_blank')}
            >
              <ExternalLink size={18} /> View Invitation
            </Button>
          </div>
        </nav>
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground mb-4 px-2">Signed in as <br/><strong className="text-foreground">{session?.user?.name}</strong></p>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto md:h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[400px] border-red-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-red-600">Confirm Logout</DialogTitle>
            <DialogDescription className="font-typewriter text-xs uppercase tracking-widest mt-2">
              Are you sure you want to end your session?
            </DialogDescription>
          </DialogHeader>
          
          <DialogBody>
            <p className="text-sm font-serif text-muted-foreground text-center py-4">
              You will need to log in again to manage your wedding invitation dashboard.
            </p>
          </DialogBody>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)} className="flex-1 rounded-full py-6 font-typewriter uppercase text-xs tracking-widest">
              Stay Logged In
            </Button>
            <Button onClick={() => signOut()} variant="destructive" className="flex-1 rounded-full py-6 bg-red-500 hover:bg-red-600 text-white font-typewriter uppercase text-xs tracking-widest transition-all">
              Yes, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
