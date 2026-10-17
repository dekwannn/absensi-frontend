"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import { witaDateStr, witaMonthStr, formatTime as formatWitaTime, formatNowDate } from "@/lib/time";
import {
  ScanFace, UserPlus, CalendarDays, LogOut,
  Users, ChevronRight, ClipboardList,
  CheckCircle2, XCircle, Clock, TrendingUp
} from "lucide-react";

interface StatsData {
  total_users: number;
  hadir_hari_ini: number;
  belum_checkout: number;
  total_absensi_bulan: number;
}

interface AttendanceRecord {
  id?: string | number;
  user_id: string | number;
  username?: string;
  name?: string;
  date: string;
  check_in: string;
  check_out?: string | null;
}

function AdminDashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [stats, setStats] = useState<StatsData>({
    total_users: 0,
    hadir_hari_ini: 0,
    belum_checkout: 0,
    total_absensi_bulan: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  // Clock
  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(formatWitaTime(now.toISOString()));
      setDate(formatNowDate(now, { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => {
      clearInterval(interval);
      setMounted(false);
    };
  }, []);

  // Fetch stats dengan abort controller untuk prevent race condition
  const fetchStats = useCallback(async () => {
    const controller = new AbortController();
    
    try {
      setLoadingStats(true);
      // tanggal WITA — toISOString() memberi tanggal UTC, yang sebelum 08:00 WITA masih "kemarin"
      const today = witaDateStr();
      const thisMonth = witaMonthStr();

      const [usersRes, attendanceRes] = await Promise.all([
        api.get("/users", { signal: controller.signal }),
        api.get("/attendance", { signal: controller.signal }),
      ]);

      // Validasi response
      const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
      const allAttendance = Array.isArray(attendanceRes.data?.data) 
        ? attendanceRes.data.data 
        : Array.isArray(attendanceRes.data) 
        ? attendanceRes.data 
        : [];

      const todayRecords = allAttendance.filter((a: AttendanceRecord) => a?.date === today);
      const monthRecords = allAttendance.filter((a: AttendanceRecord) => a?.date?.startsWith(thisMonth));

      // Update stats
      setStats({
        total_users: allUsers.length,
        hadir_hari_ini: todayRecords.length,
        belum_checkout: todayRecords.filter((a: AttendanceRecord) => !a.check_out).length,
        total_absensi_bulan: monthRecords.length,
      });

      // 5 absensi terbaru hari ini - sort by check_in descending
      const sortedRecords = [...todayRecords].sort((a, b) => {
        return new Date(b.check_in).getTime() - new Date(a.check_in).getTime();
      });
      
      setRecentAttendance(sortedRecords.slice(0, 5));
    } catch (err: any) {
      if (err.name !== 'CanceledError') {
        console.error("Error fetching stats:", err);
        // Set empty state on error
        setStats({
          total_users: 0,
          hadir_hari_ini: 0,
          belum_checkout: 0,
          total_absensi_bulan: 0,
        });
        setRecentAttendance([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingStats(false);
      }
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    fetchStats();
    
    // Optional: auto-refresh setiap 30 detik
    const refreshInterval = setInterval(fetchStats, 30000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [mounted, fetchStats]);

  const formatTime = (t?: string | null) => formatWitaTime(t, "-");

  // Generate unique key untuk attendance record
  const getAttendanceKey = (a: AttendanceRecord, index: number) => {
    const id = a.id || a.user_id || index;
    const timestamp = a.check_in?.replace(/[^0-9]/g, '') || '';
    return `att-${id}-${timestamp}-${index}`;
  };

  const getUserDisplayName = (a: AttendanceRecord) => {
    return a.username || a.name || "Unknown User";
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">

      {/* HEADER */}
      <header className="bg-slate-800 text-white pt-8 pb-20 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-10 -mb-10 blur-xl" />
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Administrator</p>
            <h1 className="text-2xl font-bold">{user?.name || "Admin"}</h1>
            <p className="text-slate-400 text-xs mt-1">Beranda</p>
          </div>
          <button
            onClick={logout}
            className="p-2 bg-white/10 rounded-full hover:bg-red-500/80 transition text-white active:scale-95"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* CLOCK WIDGET */}
      <div className="px-6 -mt-12 relative z-20 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Waktu Sekarang</p>
            <h2 className="text-4xl font-extrabold text-slate-800 mt-1 tabular-nums">{time || "--:--"}</h2>
            <p className="text-slate-400 text-xs mt-1 capitalize">{date}</p>
          </div>
          <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
            <CalendarDays size={28} />
          </div>
        </div>
      </div>

      <main className="px-6 space-y-6">

        {/* STATS GRID */}
        <div>
          <h3 className="text-slate-700 font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-slate-800 rounded-full" />
            Statistik Hari Ini
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Users size={18} className="text-blue-600" />
                </div>
                {loadingStats && <div className="w-8 h-4 bg-slate-200 rounded animate-pulse" />}
              </div>
              <p className="text-2xl font-extrabold text-slate-800">{loadingStats ? "-" : stats.total_users}</p>
              <p className="text-xs text-slate-400 mt-0.5">Total Pegawai</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-50 rounded-xl">
                  <CheckCircle2 size={18} className="text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800">{loadingStats ? "-" : stats.hadir_hari_ini}</p>
              <p className="text-xs text-slate-400 mt-0.5">Hadir Hari Ini</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-orange-50 rounded-xl">
                  <Clock size={18} className="text-orange-500" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800">{loadingStats ? "-" : stats.belum_checkout}</p>
              <p className="text-xs text-slate-400 mt-0.5">Belum Check-Out</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-50 rounded-xl">
                  <TrendingUp size={18} className="text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800">{loadingStats ? "-" : stats.total_absensi_bulan}</p>
              <p className="text-xs text-slate-400 mt-0.5">Absensi Bulan Ini</p>
            </div>
          </div>
        </div>

        {/* MENU UTAMA */}
        <div>
          <h3 className="text-slate-700 font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-slate-800 rounded-full" />
            Manajemen
          </h3>
          <div className="grid grid-cols-1 gap-3">

            {/* Data Pegawai */}
            <Link href="/admin/users">
              <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-between active:scale-95 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Data Pegawai</h4>
                    <p className="text-blue-100 text-xs">CRUD user & daftarkan wajah</p>
                  </div>
                </div>
                <div className="bg-white text-blue-600 rounded-full p-1">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Link>

            {/* Rekap Absensi */}
            <Link href="/admin/attendance">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between active:scale-95 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700">Rekap Absensi</h4>
                    <p className="text-slate-400 text-xs">Lihat semua data kehadiran</p>
                  </div>
                </div>
                <div className="bg-slate-50 text-slate-400 rounded-full p-1">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Link>

            {/* Test Check-In */}
            <Link href="/attendance/check-in">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between active:scale-95 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 text-slate-600 p-3 rounded-xl">
                    <ScanFace size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700">Test Absensi</h4>
                    <p className="text-slate-400 text-xs">Coba fitur check-in/out</p>
                  </div>
                </div>
                <div className="bg-slate-50 text-slate-400 rounded-full p-1">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* ABSENSI TERBARU HARI INI */}
        <div>
          <h3 className="text-slate-700 font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-slate-800 rounded-full" />
            Absensi Hari Ini
          </h3>

          {loadingStats ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={`skeleton-${i}`} className="h-14 bg-slate-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : recentAttendance.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <XCircle className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 text-sm">Belum ada absensi hari ini</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentAttendance.map((record, idx) => (
                <div 
                  key={getAttendanceKey(record, idx)}
                  className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      record.check_out ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {getUserDisplayName(record)}
                      </p>
                      <p className="text-xs text-slate-400">
                        In: {formatTime(record.check_in)} · Out: {formatTime(record.check_out)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    record.check_out ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                  }`}>
                    {record.check_out ? "Lengkap" : "Check-In"}
                  </span>
                </div>
              ))}
              <Link href="/admin/attendance" className="block text-center text-xs text-blue-600 font-bold pt-1 hover:underline">
                Lihat semua →
              </Link>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard requireAdmin>
      <AdminDashboardContent />
    </AuthGuard>
  );
}