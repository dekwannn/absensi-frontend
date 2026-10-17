"use client";

import Link from "next/link";
import {
  LogOut, Clock, Bell, ArrowRight,
  CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, CalendarDays,
  LogIn, LogOut as LogOutIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import SwipeButton from "@/components/SwipeButton";
import NotificationBanner from "@/components/NotificationBanner";

interface Attendance {
  id?: string | number;
  date: string;
  check_in?: string;
  check_out?: string;
  checkin_status?: "on_time" | "late";
  checkin_label?: string;
  checkout_status?: "normal" | "early";
  checkout_label?: string;
}

interface Schedule {
  checkin_open: string;
  checkin_on_time: string;
  checkin_close: string;
  checkout_open: string;
  checkout_normal: string;
  checkout_close: string;
}

interface DateItem {
  day: string;
  date: string;
  dateStr: string;
  isToday: boolean;
  isFuture: boolean;
}

function getCheckinWindow(schedule: Schedule | null) {
  if (!schedule) return { canCheckin: false, status: "before" as const, msg: "" };
  const now = new Date();
  const toTime = (s: string) => { const [h, m] = s.split(":").map(Number); const d = new Date(now); d.setHours(h, m, 0, 0); return d; };
  if (now < toTime(schedule.checkin_open))     return { canCheckin: false, status: "before" as const,  msg: `Absen dibuka pukul ${schedule.checkin_open}` };
  if (now > toTime(schedule.checkin_close))    return { canCheckin: false, status: "closed" as const,  msg: `Absen sudah ditutup sejak ${schedule.checkin_close}` };
  if (now <= toTime(schedule.checkin_on_time)) return { canCheckin: true,  status: "on_time" as const, msg: `Tepat waktu sampai ${schedule.checkin_on_time}` };
  return                                               { canCheckin: true,  status: "late" as const,   msg: `Sudah melewati batas tepat waktu (${schedule.checkin_on_time})` };
}

function getCheckoutWindow(schedule: Schedule | null) {
  if (!schedule) return { canCheckout: false, status: "before" as const, msg: "" };
  const now = new Date();
  const toTime = (s: string) => { const [h, m] = s.split(":").map(Number); const d = new Date(now); d.setHours(h, m, 0, 0); return d; };
  if (now < toTime(schedule.checkout_open))    return { canCheckout: false, status: "before" as const, msg: `Absen keluar dibuka pukul ${schedule.checkout_open}` };
  if (now > toTime(schedule.checkout_close))   return { canCheckout: false, status: "closed" as const, msg: `Absen keluar ditutup sejak ${schedule.checkout_close}` };
  if (now >= toTime(schedule.checkout_normal)) return { canCheckout: true,  status: "normal" as const, msg: `Pulang normal mulai ${schedule.checkout_normal}` };
  return                                               { canCheckout: true,  status: "early" as const, msg: `Pulang lebih awal dari ${schedule.checkout_normal}` };
}

function UserDashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [dates, setDates]               = useState<DateItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [allHistory, setAllHistory]     = useState<Attendance[]>([]);

  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [schedule, setSchedule]     = useState<Schedule | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [showSchedule, setShowSchedule]     = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  // ── Bangun 7 hari ─────────────────────────────────────
  useEffect(() => {
    const today = new Date();
    const days  = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const list: DateItem[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + (i - 3));
      return {
        day:      days[d.getDay()],
        date:     d.getDate().toString().padStart(2, "0"),
        dateStr:  d.toISOString().slice(0, 10),
        isToday:  i === 3,
        isFuture: i > 3,
      };
    });
    setDates(list);
    setSelectedDate(list[3]);
  }, []);

  const fetchToday = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/attendance/today");
      setAttendance(res.data.data || null);
      setSchedule(res.data.schedule || null);
    } catch {
      setError("Gagal memuat data absensi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await api.get("/attendance/my-history");
      setAllHistory(res.data.data || []);
    } catch { /* silent */ }
    finally { setHistoryLoading(false); }
  };

  useEffect(() => {
    fetchToday();
    fetchHistory();
  }, []);


  useEffect(() => {
    if (!selectedDate) return;
    if (selectedDate.isToday) {
      fetchToday();
    } else {
      setSchedule(null); // non-aktifkan swipe di hari lalu
      setError("");
      setLoading(false);
      setAttendance(allHistory.find(a => a.date === selectedDate.dateStr) ?? null);
    }
  }, [selectedDate, allHistory]);

  const recentHistory  = allHistory.slice(0, 5);
  const isViewingToday = selectedDate?.isToday ?? true;

  const formatTime = (t?: string) =>
    !t ? "--:--" : new Date(t).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const cardDateLabel = () => {
    if (!selectedDate || isViewingToday) return "Absensi Hari ini";
    return new Date(selectedDate.dateStr + "T00:00:00").toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long",
    });
  };

  const hasCheckedIn   = !!attendance?.check_in;
  const hasCheckedOut  = !!attendance?.check_out;
  const checkinWindow  = getCheckinWindow(isViewingToday ? schedule : null);
  const checkoutWindow = getCheckoutWindow(isViewingToday ? schedule : null);

  const showCheckinBtn  = isViewingToday && !hasCheckedIn  && checkinWindow.canCheckin;
  const showCheckoutBtn = isViewingToday && hasCheckedIn   && !hasCheckedOut && checkoutWindow.canCheckout;
  const showSwipe       = isViewingToday && !hasCheckedOut && (showCheckinBtn || showCheckoutBtn);
  const attendancePath  = showCheckinBtn ? "/attendance/check-in" : "/attendance/check-out";

  const checkinSubLabel  = () => hasCheckedIn  ? (attendance?.checkin_label  || "-") : "Belum Absen";
  const checkoutSubLabel = () => hasCheckedOut ? (attendance?.checkout_label || "-") : "Belum Absen";
  const checkinSubColor  = () => !hasCheckedIn  ? "text-slate-400" : attendance?.checkin_status  === "on_time" ? "text-green-600" : "text-red-500";
  const checkoutSubColor = () => !hasCheckedOut ? "text-slate-400" : attendance?.checkout_status === "normal"  ? "text-green-600" : "text-orange-500";

  return (
    <div className="min-h-screen bg-white font-sans pb-32">
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* START HEADER */}
      <header className="bg-white pt-8 pb-6 px-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=3b82f6&color=fff&size=48`}
                alt="Avatar" className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-slate-800 font-bold text-base">{user?.name || "User"}</h1>
              <p className="text-xs text-slate-500">{user?.role === "admin" ? "Administrator" : "Karyawan"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition active:scale-95">
              <Bell size={20} className="text-slate-600" />
            </button>
            <button onClick={logout} className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition active:scale-95">
              <LogOut size={20} className="text-red-600" />
            </button>
          </div>
        </div>
      </header>
      {/* END HEADER */}

      <NotificationBanner />

      <main className="px-6">

        {/* ── DATE SELECTOR ────────────────────────────────── */}
        <div className="mb-6 -mx-6 px-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2">
            {dates.map((d, i) => {
              const isSelected = selectedDate?.dateStr === d.dateStr;
              const hasData    = allHistory.some(h => h.date === d.dateStr);

              return (
                <button
                  key={i}
                  disabled={d.isFuture}
                  onClick={() => !d.isFuture && setSelectedDate(d)}
                  className={`relative flex-shrink-0 px-4 py-2.5 rounded-2xl transition-all ${
                    d.isFuture
                      ? "bg-white text-slate-300 border border-slate-100 cursor-not-allowed opacity-40"
                      : isSelected
                        ? d.isToday
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "bg-slate-700 text-white shadow-md scale-105" // hari lalu yang dipilih = abu gelap
                        : "bg-white text-slate-500 border border-slate-200 hover:border-blue-300 hover:text-blue-600 cursor-pointer active:scale-95"
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-[10px] mb-0.5 ${isSelected ? "text-white/60" : d.isFuture ? "text-slate-300" : "text-slate-400"}`}>
                      {d.day}
                    </div>
                    <div className="text-xl font-bold leading-none">{d.date}</div>
                    {/* Dot biru kecil jika ada data absensi hari itu */}
                    <div className={`w-1 h-1 rounded-full mx-auto mt-1.5 ${
                      hasData && !isSelected ? "bg-blue-400" : "bg-transparent"
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ABSENSI CARD ─────────────────────────────────── */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800 font-semibold">{cardDateLabel()}</h3>
            {!isViewingToday && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                <CalendarDays size={11} />
                Riwayat
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="h-24 bg-slate-200 animate-pulse rounded-xl" />
              <div className="h-24 bg-slate-200 animate-pulse rounded-xl" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className={`border rounded-xl p-3 transition-colors ${hasCheckedIn ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`text-white p-1 rounded-lg ${hasCheckedIn ? "bg-blue-500" : "bg-slate-300"}`}><LogIn size={14} /></div>
                    <span className={`text-xs font-medium ${hasCheckedIn ? "text-blue-600" : "text-slate-400"}`}>Absen Masuk</span>
                  </div>
                  <p className="text-slate-800 font-bold text-xl mb-0.5">{formatTime(attendance?.check_in)}</p>
                  <p className={`text-xs font-medium ${checkinSubColor()}`}>{checkinSubLabel()}</p>
                </div>
                <div className={`border rounded-xl p-3 transition-colors ${hasCheckedOut ? "bg-orange-50 border-orange-100" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`text-white p-1 rounded-lg ${hasCheckedOut ? "bg-orange-500" : "bg-slate-300"}`}><LogOutIcon size={14} /></div>
                    <span className={`text-xs font-medium ${hasCheckedOut ? "text-orange-600" : "text-slate-400"}`}>Absen Keluar</span>
                  </div>
                  <p className="text-slate-800 font-bold text-xl mb-0.5">{formatTime(attendance?.check_out)}</p>
                  <p className={`text-xs font-medium ${checkoutSubColor()}`}>{checkoutSubLabel()}</p>
                </div>
              </div>

              {/* Info window — hanya di hari ini */}
              {isViewingToday && !hasCheckedOut && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                  hasCheckedIn
                    ? checkoutWindow.canCheckout ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                    : checkinWindow.status === "late" ? "bg-orange-50 text-orange-700"
                    : checkinWindow.canCheckin    ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {(!hasCheckedIn && !checkinWindow.canCheckin) || (hasCheckedIn && !checkoutWindow.canCheckout)
                    ? <XCircle size={13} />
                    : checkinWindow.status === "late" && !hasCheckedIn ? <AlertTriangle size={13} />
                    : <CheckCircle2 size={13} />}
                  {hasCheckedIn ? checkoutWindow.msg : checkinWindow.msg}
                </div>
              )}

              {/* Pesan kosong hari lalu */}
              {!isViewingToday && !attendance && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-500">
                  <CalendarDays size={13} />
                  Tidak ada catatan absensi pada tanggal ini
                </div>
              )}
            </>
          )}
        </div>

        {/* ── RIWAYAT ABSENSI ───────────────────────────────── */}
        <div className="mb-6 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-800 font-semibold">Riwayat Absensi</h3>
            {recentHistory.length > 0 && (
              <Link href="/attendance/history">
                <span className="text-blue-600 text-xs font-semibold hover:underline">View All</span>
              </Link>
            )}
          </div>

          {historyLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl" />)}
            </div>
          ) : recentHistory.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <CalendarDays className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 text-sm font-medium">Belum ada riwayat absensi</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentHistory.map(item => {
                const isOnTime   = item.checkin_status === "on_time";
                const isLate     = item.checkin_status === "late";
                const isComplete = item.check_in && item.check_out;
                const hasIn      = !!item.check_in;
                const isActive   = selectedDate?.dateStr === item.date;
                const fmt     = (t?: string) => t ? new Date(t).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "--:--";
                const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      const found = dates.find(d => d.dateStr === item.date);
                      if (found) {
                        setSelectedDate(found);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={`w-full text-left rounded-xl p-3.5 flex items-center justify-between shadow-sm transition-all active:scale-[0.98] ${
                      isActive
                        ? "bg-blue-50 border-2 border-blue-400"
                        : isLate
                          ? "bg-white border border-slate-100 border-l-4 border-l-red-400"
                          : "bg-white border border-slate-100 border-l-4 border-l-blue-400"
                    }`}
                  >
                    <div className="min-w-[70px]">
                      <p className="text-xs font-bold text-slate-700">{fmtDate(item.date)}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        isOnTime ? "bg-green-100 text-green-700" : isLate ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                      }`}>{item.checkin_label || "-"}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100 mx-3" />
                    <div className="flex items-center gap-1.5 flex-1">
                      <div className="p-1 bg-blue-50 rounded-md"><LogIn size={12} className="text-blue-500" /></div>
                      <div>
                        <p className="text-[10px] text-slate-400">Masuk</p>
                        <p className="text-sm font-bold text-slate-700">{fmt(item.check_in)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-1">
                      <div className="p-1 bg-orange-50 rounded-md"><LogOutIcon size={12} className="text-orange-500" /></div>
                      <div>
                        <p className="text-[10px] text-slate-400">Keluar</p>
                        <p className="text-sm font-bold text-slate-700">{fmt(item.check_out)}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ml-2 ${
                      isComplete ? "bg-green-100 text-green-700" : hasIn ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"
                    }`}>
                      {isComplete ? "✓" : hasIn ? "↑" : "-"}
                    </span>
                  </button>
                );
              })}
              <Link href="/attendance/history" className="block text-center py-3 text-blue-600 text-xs font-semibold hover:underline">
                Lihat semua riwayat →
              </Link>
            </div>
          )}
        </div>

      </main>

      {/* SWIPE BUTTON — hanya hari ini */}
      {showSwipe && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl z-50">
          {!hasCheckedIn && checkinWindow.status === "late" && (
            <div className="mb-3 flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-2 rounded-xl text-xs text-orange-700 font-medium">
              <AlertTriangle size={13} />
              Anda akan tercatat terlambat
            </div>
          )}
          {hasCheckedIn && !hasCheckedOut && checkoutWindow.status === "early" && (
            <div className="mb-3 flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-2 rounded-xl text-xs text-orange-700 font-medium">
              <AlertTriangle size={13} />
              Anda akan tercatat pulang lebih awal
            </div>
          )}
          <SwipeButton
            onComplete={() => router.push(attendancePath)}
            text={showCheckinBtn ? "Geser untuk Absen Masuk" : "Geser untuk Absen Keluar"}
            icon={<ArrowRight size={20} />}
          />
        </div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  return <AuthGuard><UserDashboardContent /></AuthGuard>;
}