"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Eye, EyeOff, AlertCircle, ScanFace, MapPin, AtSign } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<"identifier" | "password" | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(identifier, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login gagal. Periksa email/username dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex flex-col font-sans overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .auth-page { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatDot {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .anim-1 { animation: fadeSlideUp 0.45s ease forwards; }
        .anim-2 { animation: fadeSlideUp 0.45s ease 0.08s forwards; opacity: 0; }
        .anim-3 { animation: fadeSlideUp 0.45s ease 0.16s forwards; opacity: 0; }
        .anim-4 { animation: fadeSlideUp 0.45s ease 0.24s forwards; opacity: 0; }
        .dot-1 { animation: floatDot 3s ease-in-out infinite; }
        .dot-2 { animation: floatDot 3s ease-in-out 1s infinite; }
        .dot-3 { animation: floatDot 3s ease-in-out 2s infinite; }
      `}</style>

      <div className="auth-page flex flex-col min-h-screen">

        {/* ── HERO ──────────────────────────────────────────── */}
        <div className="relative bg-blue-600 pt-14 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-8 w-36 h-36 bg-indigo-500/25 rounded-full blur-2xl" />
          <div className="absolute top-10 right-8 w-2 h-2 bg-white/40 rounded-full dot-1" />
          <div className="absolute top-16 right-20 w-1.5 h-1.5 bg-white/30 rounded-full dot-2" />
          <div className="absolute top-8 right-32 w-1 h-1 bg-white/20 rounded-full dot-3" />

          <div className="relative z-10 anim-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/30">
                <ScanFace size={20} className="text-white" />
              </div>
              <span className="text-white font-extrabold text-base tracking-tight">GeoFace</span>
            </div>
            <h1 className="text-white font-extrabold text-3xl leading-tight mb-2">
              Halo,<br />Selamat Datang!
            </h1>
            <p className="text-blue-200 text-sm leading-relaxed">
              Sistem absensi berbasis wajah &<br />lokasi real-time
            </p>
          </div>

          
        </div>

        {/* ── FORM ─────────────────────────────────────────── */}
        <div className="flex-1 bg-[#f0f4ff] -mt-5 rounded-t-[2rem] px-6 pt-8 pb-10 relative z-10">

          <div className="mb-6 anim-3">
            <h2 className="text-slate-800 font-extrabold text-xl">Masuk ke Akun</h2>
            <p className="text-slate-400 text-sm mt-1">Gunakan email atau username kamu</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 anim-3">
              <div className="bg-red-100 text-red-600 p-1 rounded-lg shrink-0 mt-0.5">
                <AlertCircle size={14} />
              </div>
              <p className="text-sm text-red-700 font-medium leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 anim-3">

            {/* Email / Username */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Email / Username
              </label>
              <div className={`flex items-center gap-3 bg-white border-2 rounded-2xl px-4 py-3.5 transition-all duration-200 ${
                focused === "identifier"
                  ? "border-blue-500 shadow-lg shadow-blue-100"
                  : "border-slate-200 shadow-sm"
              }`}>
                <AtSign size={18} className={`transition-colors duration-200 shrink-0 ${
                  focused === "identifier" ? "text-blue-500" : "text-slate-300"
                }`} />
                <input
                  type="text"
                  placeholder="Masukkan email atau username"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  onFocus={() => setFocused("identifier")}
                  onBlur={() => setFocused(null)}
                  className="flex-1 text-slate-800 text-sm font-medium placeholder:text-slate-300 focus:outline-none bg-transparent"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 ml-1">
                Bisa menggunakan email atau username
              </p>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <span className="text-[11px] text-blue-500 font-semibold cursor-pointer hover:text-blue-700 transition">
                  Lupa password?
                </span>
              </div>
              <div className={`flex items-center gap-3 bg-white border-2 rounded-2xl px-4 py-3.5 transition-all duration-200 ${
                focused === "password"
                  ? "border-blue-500 shadow-lg shadow-blue-100"
                  : "border-slate-200 shadow-sm"
              }`}>
                <Lock size={18} className={`transition-colors duration-200 shrink-0 ${
                  focused === "password" ? "text-blue-500" : "text-slate-300"
                }`} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className="flex-1 text-slate-800 text-sm font-medium placeholder:text-slate-300 focus:outline-none bg-transparent"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-300 hover:text-slate-500 transition-colors shrink-0">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-white text-sm transition-all duration-200 ${
                  loading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-200"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Memproses...
                  </span>
                ) : "Masuk Sekarang"}
              </button>
            </div>
          </form>

          {/* Register link */}
          <div className="mt-8 anim-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs font-medium">Belum punya akun?</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <Link href="/register" className="block">
              <div className="w-full py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-center font-bold text-slate-600 text-sm hover:border-blue-300 hover:text-blue-600 transition-all active:scale-[0.98]">
                Daftar Akun Baru
              </div>
            </Link>
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-7 leading-relaxed anim-4">
            Dengan masuk, kamu menyetujui penggunaan data<br />wajah & lokasi untuk keperluan absensi.
          </p>
        </div>
      </div>
    </div>
  );
}