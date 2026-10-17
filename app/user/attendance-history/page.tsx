"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import { CalendarDays, Clock, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface AttendanceRecord {
  id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: string;
}

function HistoryContent() {
  const { user } = useAuth();
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance/my-history");
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return "-";
    return new Date(time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
  };

  const filteredData = data.filter((item) => item.date.startsWith(month));
  const totalHadir = filteredData.length;
  const totalLengkap = filteredData.filter((i) => i.check_in && i.check_out).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-blue-600 text-white px-6 pt-8 pb-14 rounded-b-[2rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
        <div className="flex items-center gap-3 mb-1 relative z-10">
          <Link href="/user/dashboard" className="p-2 bg-white/20 rounded-full active:scale-95 transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Riwayat Absensi</h1>
            <p className="text-blue-100 text-xs">{user?.name}</p>
          </div>
          <button onClick={fetchData} className="ml-auto p-2 bg-white/20 rounded-full active:scale-95 transition">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      <main className="px-6 -mt-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow border border-slate-100 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalHadir}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Hadir</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow border border-slate-100 text-center">
            <p className="text-2xl font-bold text-green-600">{totalLengkap}</p>
            <p className="text-xs text-slate-500 mt-0.5">Lengkap (In & Out)</p>
          </div>
        </div>

        {/* Filter Bulan */}
        <div className="bg-white p-4 rounded-2xl shadow border border-slate-100">
          <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Filter Bulan</label>
          <input
            type="month" value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-2 w-full border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow border border-slate-100">
            <CalendarDays className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-500 font-medium">Belum ada data absensi</p>
            <p className="text-slate-400 text-sm mt-1">pada bulan yang dipilih</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((item) => {
              return (
                <div key={item.id} className="bg-white rounded-lg border-l-4 border-blue-500 shadow-sm p-4">
                  {/* Tanggal */}
                  <p className="font-semibold text-slate-800 text-sm mb-3">
                    {formatDate(item.date)}
                  </p>
                  
                  {/* Check In & Check Out dalam satu baris */}
                  <div className="flex items-center gap-8">
                    {/* Check In */}
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Clock size={16} className="text-blue-500" />
                      </div>
                      <span className="font-medium text-slate-700 text-sm">{formatTime(item.check_in)}</span>
                    </div>
                    
                    {/* Check Out */}
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-orange-50 rounded-lg">
                        <Clock size={16} className="text-orange-500" />
                      </div>
                      <span className="font-medium text-slate-700 text-sm">{formatTime(item.check_out)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AttendanceHistoryPage() {
  return (
    <AuthGuard>
      <HistoryContent />
    </AuthGuard>
  );
}