"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import { base64ToFile } from '@/utils/imageConverter';
import { useRouter, useParams, notFound } from 'next/navigation';
import { formatTime } from '@/lib/time';
import { getErrorCode, getErrorDetail, isNetworkError } from '@/lib/errors';
import { distanceMeters, formatDistance, type Office } from '@/lib/geo';
import LocationMap from '@/components/LocationMap';
import AuthGuard from '@/components/AuthGuard';
import {
  ChevronLeft, MapPin, AlertCircle, CheckCircle2, RefreshCw,
  Send, Camera, X, ScanLine, Clock, Home, RotateCcw, Navigation,
  WifiOff, ShieldAlert, UserX, MapPinOff, AlertTriangle,
} from 'lucide-react';
import { gsap } from 'gsap';

// ══════════════════════════════════════════════════════════════
//  ALERT DIALOG SYSTEM
// ══════════════════════════════════════════════════════════════
type AlertType = 'error' | 'warning' | 'info';

interface AlertData {
  type: AlertType;
  title: string;
  message: string;
  icon: React.ReactNode;
}

function AlertDialog({ alert, onClose }: { alert: AlertData; onClose: () => void }) {
  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const styles = {
    error: {
      iconWrap: 'bg-red-100',
      iconColor: 'text-red-500',
      title: 'text-red-700',
      btn: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
      ring: 'ring-red-100',
    },
    warning: {
      iconWrap: 'bg-amber-100',
      iconColor: 'text-amber-500',
      title: 'text-amber-700',
      btn: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700',
      ring: 'ring-amber-100',
    },
    info: {
      iconWrap: 'bg-blue-100',
      iconColor: 'text-blue-500',
      title: 'text-blue-700',
      btn: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
      ring: 'ring-blue-100',
    },
  }[alert.type];

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-[300] flex items-center justify-center px-6 alert-backdrop"
      style={{ background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div className="alert-dialog w-full max-w-xs bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Top icon area */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6">
          <div className={`w-16 h-16 rounded-2xl ${styles.iconWrap} flex items-center justify-center mb-4 ring-8 ${styles.ring}`}>
            <div className={`${styles.iconColor} [&>svg]:w-8 [&>svg]:h-8`}>
              {alert.icon}
            </div>
          </div>
          <h2 className={`font-extrabold text-lg text-center leading-tight mb-2 ${styles.title}`}>
            {alert.title}
          </h2>
          <p className="text-slate-500 text-sm text-center leading-relaxed">
            {alert.message}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mx-6" />

        {/* Button */}
        <div className="p-4">
          <button
            onClick={onClose}
            className={`w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all active:scale-[0.97] ${styles.btn} shadow-lg`}
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  ATTENDANCE PAGE
// ══════════════════════════════════════════════════════════════
function AttendanceContent() {
  const router = useRouter();
  const params = useParams();

  const type      = params.type as string;
  const isCheckIn = type === 'check-in';
  const pageTitle = isCheckIn ? "Absensi Masuk" : "Absensi Keluar";

  const videoRef        = useRef<HTMLVideoElement | null>(null);
  const canvasRef       = useRef<HTMLCanvasElement | null>(null);
  const successModalRef = useRef<HTMLDivElement>(null);
  const checkmarkRef    = useRef<HTMLDivElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);

  const [image, setImage]               = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  // stream disimpan di ref agar cleanup selalu melihat stream yang aktif
  const streamRef = useRef<MediaStream | null>(null);
  const [loading, setLoading]           = useState(false);
  const [status, setStatus]             = useState<{ type: 'success' | 'error' | ''; msg: string; time?: string }>({ type: '', msg: '' });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [location, setLocation]         = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [office, setOffice]             = useState<Office | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Alert dialog state
  const [alertData, setAlertData] = useState<AlertData | null>(null);

  const showAlert = useCallback((type: AlertType, title: string, message: string, icon: React.ReactNode) => {
    setAlertData({ type, title, message, icon });
  }, []);

  const toastError   = useCallback((title: string, msg: string, icon: React.ReactNode = <AlertCircle size={16} />) => showAlert('error',   title, msg, icon), [showAlert]);
  const toastWarning = useCallback((title: string, msg: string, icon: React.ReactNode = <AlertTriangle size={16} />) => showAlert('warning', title, msg, icon), [showAlert]);

  // ── GSAP Success animation ────────────────────────────
  useEffect(() => {
    if (showSuccessAnimation && successModalRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(successModalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      tl.fromTo(checkmarkRef.current,    { scale: 0   }, { scale: 1, duration: 0.5, ease: "back.out(2)" }, "+=0.1");
      tl.fromTo(contentRef.current,      { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2");
    }
  }, [showSuccessAnimation]);

  // ── GPS ───────────────────────────────────────────────
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLoadingLocation(false);
      toastError("GPS Tidak Tersedia", "Browser kamu tidak mendukung geolokasi.", <MapPinOff size={16} />);
      return;
    }
    // Pantau posisi terus-menerus agar peta & jarak ikut bergerak saat user berjalan.
    // Nama lokasi cukup diambil sekali, dan toast error hanya ditampilkan sekali.
    let named = false;
    let warned = false;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        setLocation(coords);
        if (!named) {
          named = true;
          getLocationName(coords.lat, coords.lng);
        }
      },
      (err) => {
        setLoadingLocation(false);
        if (warned) return;
        warned = true;
        if (err.code === 1)
          toastError("Izin Lokasi Ditolak", "Harap aktifkan izin GPS di pengaturan browser kamu.", <MapPinOff size={16} />);
        else if (err.code === 2)
          toastWarning("Sinyal GPS Lemah", "Tidak dapat mendeteksi lokasi. Coba pindah ke area terbuka.", <Navigation size={16} />);
        else
          toastError("Gagal Ambil Lokasi", "Terjadi kesalahan saat mengambil koordinat GPS.", <MapPinOff size={16} />);
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [toastError, toastWarning]);

  // ── Titik kantor & radius untuk peta ──────────────────
  useEffect(() => {
    api.get('/attendance/office')
      .then((res) => {
        const d = res.data.data;
        setOffice({ lat: d.latitude, lng: d.longitude, radius: d.radius });
      })
      .catch(() => { /* peta tidak ditampilkan; validasi lokasi tetap di server */ });
  }, []);

  const getLocationName = async (lat: number, lng: number) => {
    try {
      setLoadingLocation(true);
      const res  = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
      const data = await res.json();
      const name = data.locality || data.principalSubdivision || data.city || "Lokasi tidak diketahui";
      const city = data.city || data.principalSubdivision || "";
      setLocationName(city && name !== city ? `${name}, ${city}` : name);
    } catch {
      setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setLoadingLocation(false);
    }
  };

  // ── Kamera ────────────────────────────────────────────
  // Kamera dimatikan saat ditutup, saat halaman ditinggalkan, dan juga bila
  // ditutup sebelum izin kamera selesai diproses.
  useEffect(() => {
    if (!isCameraOpen) return;
    let cancelled = false;

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } }
    }).then((ms) => {
      if (cancelled) { ms.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = ms;
      if (videoRef.current) videoRef.current.srcObject = ms;
    }).catch(() => {
      if (cancelled) return;
      toastError("Kamera Tidak Bisa Dibuka", "Pastikan izin kamera sudah diberikan di browser.", <Camera size={16} />);
      setIsCameraOpen(false);
    });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [isCameraOpen, toastError]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    if (!ctx) return;

    const W = 300, H = 380;
    canvas.width = W; canvas.height = H;

    const scale = Math.max(window.innerWidth / video.videoWidth, window.innerHeight / video.videoHeight);
    const sw = video.videoWidth * scale, sh = video.videoHeight * scale;
    const vx = (window.innerWidth - sw) / 2, vy = (window.innerHeight - sh) / 2;
    const cx = (window.innerWidth - W) / 2,  cy = (window.innerHeight - H) / 2;

    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, (cx - vx) / scale, (cy - vy) / scale, W / scale, H / scale, 0, 0, W, H);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    setImage(canvas.toDataURL('image/jpeg', 0.95));
    setIsCameraOpen(false);
  };

  // ── Submit absensi ────────────────────────────────────
  const handleAttendance = async () => {
    if (!image) {
      toastWarning("Foto Belum Diambil", "Silakan ambil foto wajah terlebih dahulu.", <Camera size={16} />);
      return;
    }
    if (!location) {
      toastWarning("Lokasi Belum Terdeteksi", "Tunggu sebentar hingga GPS aktif.", <Navigation size={16} />);
      return;
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });
    setShowSuccessAnimation(false);

    try {
      const imageFile = base64ToFile(image, `${type}.jpg`);
      const formData  = new FormData();
      formData.append('file', imageFile);
      formData.append('latitude',  location.lat.toString());
      formData.append('longitude', location.lng.toString());

      const res = await api.post(`/${type}`, formData);
      setStatus({
        type: 'success',
        msg:  `Halo ${res.data.user}, ${res.data.message}`,
        // jam dari server (WITA), bukan jam HP
        time: formatTime(res.data.time || new Date().toISOString(), '--:--', true)
      });
      setShowSuccessAnimation(true);

    } catch (err) {
      const detail = getErrorDetail(err);
      setStatus({ type: 'error', msg: detail });

      // Pilih pesan berdasarkan `code` dari backend, bukan menebak dari isi teks
      if (isNetworkError(err)) {
        toastError("Koneksi Gagal", "Server tidak merespons. Periksa koneksi internet kamu.", <WifiOff size={16} />);
      } else {
        switch (getErrorCode(err)) {
          case "OUT_OF_RANGE":
            toastError("Lokasi Tidak Valid", detail, <MapPinOff size={16} />);
            break;
          case "FACE_NOT_DETECTED":
            toastError("Wajah Tidak Terdeteksi", "Pastikan wajah terlihat jelas dan pencahayaan cukup.", <UserX size={16} />);
            break;
          case "FACE_MISMATCH":
            toastError("Wajah Tidak Dikenali", detail, <UserX size={16} />);
            break;
          case "FACE_NOT_ENROLLED":
          case "FACE_REENROLL_REQUIRED":
            toastError("Wajah Belum Didaftarkan", detail || "Hubungi admin untuk mendaftarkan data wajah kamu.", <ShieldAlert size={16} />);
            break;
          case "ALREADY_CHECKED_IN":
          case "ALREADY_CHECKED_OUT":
            toastWarning("Sudah Absen", detail, <CheckCircle2 size={16} />);
            break;
          case "NOT_CHECKED_IN":
            toastWarning("Belum Check-in", detail, <AlertTriangle size={16} />);
            break;
          case "OUTSIDE_HOURS":
            toastWarning("Di Luar Jam Absensi", detail, <Clock size={16} />);
            break;
          default:
            toastError("Absensi Gagal", detail || "Terjadi kesalahan. Silakan coba lagi.", <AlertCircle size={16} />);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    gsap.to(successModalRef.current, { opacity: 0, duration: 0.2, ease: "power2.in", onComplete: () => router.push('/user/dashboard') });
  };
  const handleAbsenLagi = () => {
    gsap.to(successModalRef.current, { opacity: 0, duration: 0.2, ease: "power2.in", onComplete: () => {
      setShowSuccessAnimation(false); setImage(null); setStatus({ type: '', msg: '' });
    }});
  };

  // ── SUCCESS MODAL ─────────────────────────────────────
  if (showSuccessAnimation) {
    const successBg = isCheckIn ? "from-blue-600 via-blue-500 to-indigo-600" : "from-orange-500 via-amber-500 to-orange-600";
    return (
      <div ref={successModalRef} className={`fixed inset-0 bg-gradient-to-br ${successBg} z-50 flex items-center justify-center p-6`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} />
        <div className="text-center max-w-sm w-full relative z-10">
          <div ref={checkmarkRef} className="mx-auto mb-6">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl mx-auto relative">
              <div className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping" />
              <CheckCircle2 size={56} className="text-green-500" strokeWidth={2.5} />
            </div>
          </div>
          <div ref={contentRef}>
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              <span className="text-white/90 text-xs font-bold uppercase tracking-widest">Absensi Berhasil</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-3 leading-tight">
              {isCheckIn ? "Selamat Pagi!" : "Sampai Jumpa!"}
            </h1>
            <div className="bg-white/15 border border-white/20 backdrop-blur-sm rounded-2xl px-5 py-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock size={16} className="text-white/70" />
                <span className="text-white font-extrabold text-2xl tabular-nums">{status.time}</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{status.msg}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleBackToDashboard}
                className="w-full bg-white text-slate-800 py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all">
                <Home size={18} /> Kembali ke Dashboard
              </button>
              <button onClick={handleAbsenLagi}
                className="w-full bg-white/10 border border-white/30 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 active:scale-[0.98] transition-all backdrop-blur-sm">
                <RotateCcw size={16} /> Absen Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── KAMERA FULL SCREEN ────────────────────────────────
  if (isCameraOpen) {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-hidden flex flex-col">
        <canvas ref={canvasRef} className="hidden" />
        <video ref={videoRef} autoPlay playsInline muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }} />

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative" style={{ width: '300px', height: '380px' }}>
            <svg className="absolute -top-1 -left-1" width="60" height="60" viewBox="0 0 60 60">
              <path d="M 20 5 L 5 5 L 5 20" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
            <svg className="absolute -top-1 -right-1" width="60" height="60" viewBox="0 0 60 60">
              <path d="M 40 5 L 55 5 L 55 20" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
            <svg className="absolute -bottom-1 -left-1" width="60" height="60" viewBox="0 0 60 60">
              <path d="M 5 40 L 5 55 L 20 55" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
            <svg className="absolute -bottom-1 -right-1" width="60" height="60" viewBox="0 0 60 60">
              <path d="M 55 40 L 55 55 L 40 55" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80"
                style={{ animation: 'scan 2s ease-in-out infinite' }} />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
          <div className="text-center">
            <div className="inline-block bg-black/50 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-1">Verifikasi Wajah</h3>
              <p className="text-white/80 text-sm">Posisikan wajah dalam frame</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setIsCameraOpen(false)}
              className="text-white bg-white/20 p-4 rounded-full hover:bg-white/30 backdrop-blur-md border border-white/20 active:scale-95 transition">
              <X size={24} />
            </button>
            <button onClick={capturePhoto}
              className="bg-white p-6 rounded-full shadow-2xl active:scale-95 transition-transform relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 group-active:animate-none" />
              <Camera size={32} className="text-blue-600 relative z-10" />
            </button>
            <div className="w-16" />
          </div>
        </div>
      </div>
    );
  }

  // ── HALAMAN UTAMA ─────────────────────────────────────
  const headerBg       = isCheckIn ? "from-blue-600 via-blue-500 to-indigo-600" : "from-orange-500 via-amber-500 to-orange-600";
  const iconBg         = isCheckIn ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600";
  const btnGradient    = isCheckIn ? "from-blue-600 to-blue-500 shadow-blue-200" : "from-orange-500 to-amber-500 shadow-orange-200";
  const submitGradient = isCheckIn ? "from-green-600 to-emerald-500 shadow-green-200" : "from-amber-600 to-orange-500 shadow-amber-200";
  // Jarak ke kantor (tampilan saja; server tetap memvalidasi ulang)
  const distance      = office && location ? distanceMeters(location.lat, location.lng, office.lat, office.lng) : null;
  const outsideRadius = !!office && distance !== null && distance > office.radius;
  const metersToGo    = office && distance !== null ? distance - office.radius : 0;
  const canSubmit = !loading && !!image && !!location && !outsideRadius;

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-sans pb-10">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .attendance-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes scan {
          0%   { top: 0; opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.4s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.4s ease 0.1s forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.4s ease 0.2s forwards; opacity: 0; }
        @keyframes alertIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .alert-backdrop { animation: backdropIn 0.2s ease forwards; }
        .alert-dialog   { animation: alertIn 0.3s cubic-bezier(0.34,1.4,0.64,1) forwards; }
      `}</style>

      {/* ── ALERT DIALOG ────────────────────────────────── */}
      {alertData && <AlertDialog alert={alertData} onClose={() => setAlertData(null)} />}

      <div className="attendance-page">

        {/* ── HEADER ─────────────────────────────────────── */}
        <header className={`bg-gradient-to-br ${headerBg} pt-10 pb-20 px-6 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} />
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-8 w-36 h-36 bg-black/10 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center space-x-18">
            <button onClick={() => router.back()}
              className="p-2.5 bg-white/15 border border-white/25 rounded-xl backdrop-blur-sm active:scale-95 transition">
              <ChevronLeft size={20} className="text-white" />
            </button>
            <div className="text-center ml-4">
              <h1 className="text-white font-extrabold text-lg">{pageTitle}</h1>
            </div>
          </div>
        </header>

        {/* ── LOCATION CARD ───────────────────────────────── */}
        <div className="px-5 -mt-10 relative z-20 fade-up">
          <div className={`bg-white rounded-2xl shadow-lg border flex items-center gap-3 px-4 py-3.5 transition-all ${
            location && !loadingLocation ? "border-green-200 shadow-green-100/50" : "border-amber-200 shadow-amber-100/50"
          }`}>
            <div className={`p-2 rounded-xl shrink-0 ${location && !loadingLocation ? "bg-green-100" : "bg-amber-100"}`}>
              <Navigation size={16} className={location && !loadingLocation ? "text-green-600" : "text-amber-600"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Lokasi Anda</p>
              {loadingLocation ? (
                <div className="space-y-1.5">
                  <div className="h-2.5 bg-slate-200 rounded w-3/4 animate-pulse" />
                  <div className="h-2 bg-slate-100 rounded w-1/2 animate-pulse" />
                </div>
              ) : location ? (
                <p className="text-slate-800 font-bold text-sm truncate">{locationName}</p>
              ) : (
                <p className="text-amber-700 text-sm font-semibold">GPS tidak tersedia</p>
              )}
            </div>
          </div>
        </div>

        <main className="px-5 mt-4 space-y-4">

          {/* ── PETA LOKASI ──────────────────────────────── */}
          {office && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden fade-up-2">
              <LocationMap office={office} point={location} inside={!outsideRadius} className="h-48 w-full" />
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                {distance === null ? (
                  <p className="text-slate-400 text-xs font-semibold">Menunggu posisi GPS...</p>
                ) : outsideRadius ? (
                  <p className="text-red-600 text-xs font-bold flex items-center gap-1.5">
                    <MapPinOff size={14} /> Di luar radius, {formatDistance(metersToGo)} lagi
                  </p>
                ) : (
                  <p className="text-green-600 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Dalam radius kantor
                  </p>
                )}
                {distance !== null && (
                  <span className="text-slate-500 text-xs shrink-0">{formatDistance(distance)} dari kantor</span>
                )}
              </div>
              {location && location.accuracy > 50 && (
                <p className="px-4 pb-3 -mt-1 text-amber-600 text-[11px] leading-snug">
                  Akurasi GPS &plusmn;{Math.round(location.accuracy)} m. Coba dekat jendela atau di area terbuka agar lebih tepat.
                </p>
              )}
            </div>
          )}

          {/* ── FOTO CARD ────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden fade-up-2">
            <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              
              {image && (
                <button onClick={() => setIsCameraOpen(true)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition active:scale-95 ${iconBg}`}>
                  <RefreshCw size={12} /> Foto Ulang
                </button>
              )}
            </div>

            <div className="p-5">
              {!image ? (
                <div className="flex flex-col items-center py-6">
                  <div className={`relative w-36 h-44 rounded-xl flex items-center justify-center mb-5 ${isCheckIn ? "bg-blue-50" : "bg-orange-50"}`}>
                    {[["top-2 left-2","border-t-2 border-l-2"],["top-2 right-2","border-t-2 border-r-2"],
                      ["bottom-2 left-2","border-b-2 border-l-2"],["bottom-2 right-2","border-b-2 border-r-2"]
                    ].map(([pos, border], i) => (
                      <div key={i} className={`absolute w-5 h-5 ${pos} ${border} ${isCheckIn ? "border-blue-400" : "border-orange-400"} rounded-sm`} />
                    ))}
                    <div className={isCheckIn ? "text-blue-300" : "text-orange-300"}>
                      <ScanLine size={48} strokeWidth={1.2} />
                    </div>
                  </div>
                  <p className="text-slate-700 font-bold text-base mb-1">Ambil Foto Wajah</p>
                  <p className="text-slate-400 text-sm text-center mb-5 max-w-[220px] leading-relaxed">
                    Pastikan wajah terlihat jelas dan pencahayaan cukup
                  </p>
                  <button onClick={() => setIsCameraOpen(true)}
                    className={`flex items-center gap-2.5 bg-gradient-to-r ${btnGradient} text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg active:scale-95 transition-all hover:shadow-xl`}>
                    <Camera size={19} /> Buka Kamera
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-[240px] mx-auto mb-4">
                    <div className="relative rounded-3xl overflow-hidden border-4 border-slate-100 shadow-xl" style={{ aspectRatio: '300/380' }}>
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pt-8 pb-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <CheckCircle2 size={13} className="text-green-400" />
                          <p className="text-white text-xs font-semibold">Foto siap dikirim</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                      ✓ OK
                    </div>
                  </div>
                  <div className="w-full flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2.5">
                    <p className="text-slate-500 text-xs">Foto wajah berhasil diambil. Lanjut kirim absensi.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RINGKASAN ───────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-4 fade-up-3">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Ringkasan</p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">Jenis</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isCheckIn ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                  {pageTitle}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500 text-xs shrink-0">Lokasi</span>
                <span className="text-slate-700 text-xs font-semibold text-right truncate">
                  {loadingLocation ? "Mendeteksi..." : locationName || "Tidak tersedia"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">Foto</span>
                <div className="flex items-center gap-1">
                  {image
                    ? <><CheckCircle2 size={13} className="text-green-500" /><span className="text-green-600 text-xs font-semibold">Sudah diambil</span></>
                    : <span className="text-slate-400 text-xs">Belum diambil</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* ── TOMBOL SUBMIT ───────────────────────────── */}
          <div className="fade-up-3">
            <button onClick={handleAttendance} disabled={!canSubmit}
              className={`w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2.5 transition-all ${
                canSubmit
                  ? `bg-gradient-to-r ${submitGradient} shadow-lg active:scale-[0.98] hover:shadow-xl`
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}>
              {loading ? (
                <><RefreshCw size={18} className="animate-spin" /> Memproses Absensi...</>
              ) : canSubmit ? (
                <><Send size={18} /> Kirim {pageTitle}</>
              ) : !image ? (
                <><Camera size={18} /> Ambil Foto Dahulu</>
              ) : outsideRadius ? (
                <><MapPinOff size={18} /> Di Luar Radius Kantor</>
              ) : (
                <><MapPin size={18} /> Menunggu Lokasi GPS...</>
              )}
            </button>
            {!canSubmit && !loading && (
              <p className="text-center text-slate-400 text-xs mt-2">
                {!image && !location ? "Ambil foto & tunggu GPS aktif"
                : !image ? "Foto wajah belum diambil"
                : outsideRadius ? `Mendekatlah ${formatDistance(metersToGo)} lagi ke area kantor`
                : "Menunggu GPS..."}
              </p>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

const ATTENDANCE_TYPES = ['check-in', 'check-out'];

export default function AttendancePage() {
  // hanya /attendance/check-in dan /attendance/check-out yang valid
  const { type } = useParams<{ type: string }>();
  if (!ATTENDANCE_TYPES.includes(type)) notFound();
  return <AuthGuard><AttendanceContent /></AuthGuard>;
}