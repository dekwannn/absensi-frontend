"use client";

import { useState } from "react";
import { Bell, X, CheckCircle2 } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";

export default function NotificationBanner() {
  const { permission, requestPermission, sendTestNotification } = useNotification();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [justGranted, setJustGranted] = useState(false);

  // Sudah granted → tidak perlu tampilkan banner
  // Sudah dismissed → jangan tampil lagi
  if (permission === "granted" && !justGranted) return null;
  if (permission === "denied") return null;
  if (dismissed) return null;

  // Tampilkan sukses sebentar setelah grant
  if (justGranted) {
    return (
      <div className="mx-6 mb-4 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
        <CheckCircle2 size={20} className="text-green-600 shrink-0" />
        <div className="flex-1">
          <p className="text-green-800 font-semibold text-sm">Notifikasi Aktif!</p>
          <p className="text-green-600 text-xs">Kamu akan diingatkan sebelum waktu absen.</p>
        </div>
        <button onClick={() => setJustGranted(false)} className="text-green-400 hover:text-green-600">
          <X size={16} />
        </button>
      </div>
    );
  }

  const handleAllow = async () => {
    setLoading(true);
    const result = await requestPermission();
    setLoading(false);
    if (result === "granted") {
      sendTestNotification();
      setJustGranted(true);
      // Hilangkan banner sukses setelah 3 detik
      setTimeout(() => setJustGranted(false), 3000);
    }
  };

  return (
    <div className="mx-6 mb-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shrink-0">
          <Bell size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-blue-800 font-semibold text-sm">Aktifkan Pengingat Absensi</p>
          <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
            Dapatkan notifikasi 10 menit sebelum waktu absen masuk & pulang.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAllow}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-xl active:scale-95 transition disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Izinkan"}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-2 bg-white border border-blue-200 text-blue-500 text-xs font-bold rounded-xl active:scale-95 transition"
            >
              Nanti
            </button>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="text-blue-300 hover:text-blue-500 shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}