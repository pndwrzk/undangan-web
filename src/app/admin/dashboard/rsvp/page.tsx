"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RSVPData {
  id: string;
  name: string;
  attendance: string;
  guests: number | null;
  createdAt: string;
}

export default function RSVPPage() {
  const { status } = useSession();
  const router = useRouter();
  const [rsvpData, setRsvpData] = useState<RSVPData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
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
      const res = await fetch(
        `/api/admin/rsvps?page=${currentPage}&limit=${itemsPerPage}&q=${encodeURIComponent(debouncedSearch)}`
      );
      const data = await res.json();
      setRsvpData(data.data || []);
      setTotalCount(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch RSVP data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (rsvpData.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Nama", "Status Kehadiran", "Jumlah Tamu", "Tanggal"];
    const rows = rsvpData.map((item) => [
      item.name,
      item.attendance === "yes" ? "Hadir" : "Tidak Hadir",
      item.guests || "-",
      new Date(item.createdAt).toLocaleDateString("id-ID"),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `rsvp-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data exported successfully");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-primary/80 mb-2">RSVP Data</h1>
        <p className="text-muted-foreground font-serif italic">
          Manage and view guest attendance confirmation data
        </p>
      </div>

      {/* Search & Export */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-8">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search guest name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-primary/10 bg-white focus:outline-primary shadow-sm font-serif"
          />
        </div>
        <Button
          onClick={handleExportCSV}
          className="bg-primary hover:bg-primary/90 text-white rounded-full py-4 px-6 flex items-center gap-2 h-auto shadow-sm"
        >
          <Download size={18} />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/5 border-primary/10">
                <TableHead className="font-serif font-bold text-primary">Name</TableHead>
                <TableHead className="font-serif font-bold text-primary">Status</TableHead>
                <TableHead className="font-serif font-bold text-primary text-center">Guests</TableHead>
                <TableHead className="font-serif font-bold text-primary">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <p className="text-muted-foreground">Loading...</p>
                  </TableCell>
                </TableRow>
              ) : rsvpData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <p className="text-muted-foreground">No RSVP data</p>
                  </TableCell>
                </TableRow>
              ) : (
                rsvpData.map((item) => (
                  <TableRow key={item.id} className="border-primary/5 hover:bg-primary/5">
                    <TableCell className="font-serif">{item.name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-typewriter ${
                          item.attendance === "yes"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.attendance === "yes" ? "Confirmed" : "Declined"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-serif font-bold">
                        {item.attendance === "yes" ? item.guests || 1 : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-serif">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2 font-typewriter uppercase tracking-widest text-[10px]">
          <p className="text-muted-foreground">
            Showing {Math.min(totalCount, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(totalCount, currentPage * itemsPerPage)} of {totalCount} RSVPs
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
  );
}
