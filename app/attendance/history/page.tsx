"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import { witaMonthStr, formatTime as formatWitaTime, formatDate as formatCalendarDate } from "@/lib/time";
import { CalendarDays, ArrowLeft, RefreshCw, LogIn, LogOut, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface AttendanceRecord {
  id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  checkin_status?: "on_time" | "late";
  checkin_label?: string;
  checkout_status?: "normal" | "early";
  checkout_label?: string;
}

function HistoryContent() {
  const { user } = useAuth();
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(witaMonthStr());

  // ambil hanya data bulan yang dipilih (filter di backend), muat ulang saat bulan diganti
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance/my-history", { params: { month } });
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const formatTime = (t?: string) => formatWitaTime(t);

  const formatDate = (d: string) => formatCalendarDate(d, { weekday: "short", day: "numeric", month: "short" });

  const filtered     = data.filter(i => i.date.startsWith(month));
  const totalHadir   = filtered.length;
  const totalLengkap = filtered.filter(i => i.check_in && i.check_out).length;
  const totalOnTime  = filtered.filter(i => i.checkin_status === "on_time").length;
  const totalLate    = filtered.filter(i => i.checkin_status === "late").length;

  // Hitung persentase kehadiran
  const attendanceRate = totalHadir > 0 ? Math.round((totalLengkap / totalHadir) * 100) : 0;
  const onTimeRate     = totalHadir > 0 ? Math.round((totalOnTime / totalHadir) * 100) : 0;

  // Nama bulan untuk display
  const monthName = formatCalendarDate(month + "-01", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#f0f4ff] pb-20">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .history-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-bar {
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 100%);
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .count-anim {
          animation: countUp 0.5s ease forwards;
        }
      `}</style>

      <div className="history-page">

        {/* ── HEADER ───────────────────────────────────────── */}
        <header className="relative bg-blue-600 px-6 pt-10 pb-36 overflow-hidden">
          {/* Dekoratif blur circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl" />
          <div className="absolute top-6 left-1/2 w-20 h-20 bg-white/5 rounded-full blur-xl" />

          {/* Dots pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

          {/* Nav row */}
          <div className="flex items-center gap-3 relative z-10 mb-5">
            <Link href="/user/dashboard" className="p-2 bg-white/15 backdrop-blur-sm rounded-full active:scale-95 transition border border-white/20">
              <ArrowLeft size={18} className="text-white" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">Riwayat Absensi</h1>
              <p className="text-blue-100 text-xs mt-0.5">{user?.name}</p>
            </div>
            <button onClick={fetchData} className="p-2 bg-white/15 backdrop-blur-sm rounded-full active:scale-95 transition border border-white/20">
              <RefreshCw size={16} className={`text-white ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Filter bulan — di dalam header, paling atas konten */}
          <div className="relative z-10 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-lg shrink-0">
              <CalendarDays size={15} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest mb-0.5">Pilih Bulan</p>
              <input
                type="month"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="w-full text-sm font-bold text-white bg-transparent focus:outline-none [color-scheme:dark]"
              />
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-blue-100 font-medium">{filtered.length} hari</p>
              <p className="text-[10px] text-blue-200">tercatat</p>
            </div>
          </div>
        </header>

        <main className="px-5 -mt-28 relative z-10 space-y-4">

          {/* ── SUMMARY HERO CARD ──────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/60 overflow-hidden border border-white">

            {/* Top banner */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-5 pt-5 pb-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-full opacity-20"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)", backgroundSize: "10px 10px" }} />

              <div className="flex items-start justify-between relative z-10 mb-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Rekap Kehadiran Bulan Ini</p>
                  </div>
                  <h2 className="text-white font-extrabold text-xl capitalize">{monthName}</h2>
                  <p className="text-blue-200 text-xs mt-1">
                    Kamu tercatat hadir <span className="text-white font-bold">{totalHadir} hari</span> bulan ini
                  </p>
                </div>

                {/* Ring chart — persentase absen lengkap */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-16 h-16">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="white" strokeWidth="3.5"
                        strokeDasharray={`${attendanceRate} 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-white font-extrabold text-sm leading-none">{attendanceRate}%</span>
                    </div>
                  </div>
                  <span className="text-blue-200 text-[9px] font-medium">Absen Lengkap</span>
                </div>
              </div>

              {/* Progress bar on-time — dengan label yang jelas */}
              <div className="relative z-10 bg-white/10 rounded-2xl px-3 py-2.5">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-blue-200" />
                    <span className="text-blue-100 text-xs font-medium">Ketepatan Waktu Masuk</span>
                  </div>
                  <span className="text-white text-xs font-extrabold">{onTimeRate}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full shimmer-bar transition-all duration-1000" style={{ width: `${onTimeRate}%` }} />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[9px] text-blue-200">{totalOnTime} hari tepat waktu</span>
                  <span className="text-[9px] text-blue-300">{totalLate} hari terlambat</span>
                </div>
              </div>
            </div>

            {/* Divider label */}
            <div className="px-5 pt-3 pb-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Detail Statistik</p>
            </div>

            {/* 4 stat tiles — dengan label lebih jelas */}
            <div className="grid grid-cols-2 gap-0 divide-y divide-slate-100 px-5 pb-4">
              {/* Row 1 */}
              <div className="flex items-center gap-3 py-3 pr-4 border-r border-slate-100">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-xl shrink-0">
                  <CalendarDays size={16} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-blue-600 count-anim leading-none">{totalHadir}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">Total Hari Hadir</p>
                  <p className="text-[10px] text-slate-400">bulan {monthName.split(" ")[0]}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-3 pl-4">
                <div className="bg-green-50 text-green-600 p-2 rounded-xl shrink-0">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-green-600 count-anim leading-none">{totalLengkap}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">Absen Lengkap</p>
                  <p className="text-[10px] text-slate-400">absen masuk dan keluar</p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center gap-3 py-3 pr-4 border-r border-slate-100">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl shrink-0">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-emerald-600 count-anim leading-none">{totalOnTime}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">Tepat Waktu</p>
                  <p className="text-[10px] text-slate-400">masuk ≤ 08:00</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-3 pl-4">
                <div className="bg-red-50 text-red-500 p-2 rounded-xl shrink-0">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-red-500 count-anim leading-none">{totalLate}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">Terlambat</p>
                  <p className="text-[10px] text-slate-400">masuk setelah 08:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── JUDUL LIST RIWAYAT ──────────────────────────── */}
          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between pt-1">
              <div>
                <h3 className="text-slate-800 font-extrabold text-base">Log Absensi</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Daftar catatan masuk & keluar kamu — {filtered.length} record ditemukan
                </p>
              </div>
              {/* <div className="flex items-center gap-1 bg-blue-50 px-2.5 py-1.5 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-blue-600 text-[10px] font-bold">{monthName.split(" ")[0]}</span>
              </div> */}
            </div>
          )}

          {/* ── LIST RIWAYAT ────────────────────────────────── */}
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white animate-pulse rounded-2xl shadow-sm" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
              <CalendarDays className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-500 font-medium">Belum ada riwayat absensi</p>
              <p className="text-slate-400 text-sm mt-1">pada bulan yang dipilih</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(item => {
                const isOnTime   = item.checkin_status === "on_time";
                const isLate     = item.checkin_status === "late";
                const isComplete = item.check_in && item.check_out;
                const hasIn      = !!item.check_in;

                return (
                  <div key={item.id} className={`bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm border ${
                    isLate ? "border-l-4 border-l-red-400 border-slate-100" : "border-l-4 border-l-blue-400 border-slate-100"
                  }`}>
                    {/* Tanggal & Badge */}
                    <div className="min-w-[64px]">
                      <p className="text-xs font-bold text-slate-700 leading-tight">{formatDate(item.date)}</p>
                      <span className={`inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isOnTime ? "bg-green-100 text-green-700"
                        : isLate ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-500"
                      }`}>{item.checkin_label || "-"}</span>
                    </div>

                    <div className="w-px h-9 bg-slate-100 shrink-0" />

                    {/* Jam Masuk */}
                    <div className="flex items-center gap-2 flex-1">
                      <div className="p-1.5 bg-blue-50 rounded-lg shrink-0">
                        <LogIn size={11} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wide">Masuk</p>
                        <p className="text-sm font-bold text-slate-800 tabular-nums leading-tight">{formatTime(item.check_in)}</p>
                      </div>
                    </div>

                    {/* Jam Keluar */}
                    <div className="flex items-center gap-2 flex-1">
                      <div className="p-1.5 bg-orange-50 rounded-lg shrink-0">
                        <LogOut size={11} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wide">Keluar</p>
                        <p className="text-sm font-bold text-slate-800 tabular-nums leading-tight">{formatTime(item.check_out)}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isComplete ? "bg-green-100 text-green-700"
                      : hasIn    ? "bg-orange-100 text-orange-600"
                      : "bg-slate-100 text-slate-400"
                    }`}>
                      {isComplete ? "✓" : hasIn ? "↑" : "-"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AttendanceHistoryPage() {
  return <AuthGuard><HistoryContent /></AuthGuard>;
}