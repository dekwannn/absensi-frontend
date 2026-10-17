"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  Lock, Eye, EyeOff, AlertCircle, CheckCircle2,
  ScanFace, MapPin, User, AtSign, CreditCard, ArrowLeft, Check
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", username: "", email: "", nik: "",
    password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const passwordMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordStrong = form.password.length >= 6;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Konfirmasi password tidak cocok."); return; }
    if (form.password.length < 6) { setError("Password minimal 6 karakter."); return; }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        username: form.username,
        email: form.email || undefined,
        nik: form.nik || undefined,
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex flex-col items-center justify-center p-6 font-sans">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          .auth-page { font-family: 'Plus Jakarta Sans', sans-serif; }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.5); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .success-icon { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          .success-text { animation: fadeUp 0.4s ease 0.3s forwards; opacity: 0; }
        `}</style>
        <div className="auth-page text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 success-icon border-4 border-green-200">
            <CheckCircle2 size={44} className="text-green-600" />
          </div>
          <div className="success-text">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Akun Berhasil Dibuat!</h2>
            <p className="text-slate-500 text-sm mb-1">Selamat datang di GeoFace, <span className="font-bold text-slate-700">{form.name}</span>!</p>
            <p className="text-slate-400 text-xs">Mengarahkan ke halaman login...</p>
            <div className="mt-5 flex justify-center">
              <div className="h-1 w-32 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ animation: "expandWidth 2.5s linear forwards" }} />
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes expandWidth { from { width: 0% } to { width: 100% } }
        `}</style>
      </div>
    );
  }

  const inputClass = (name: string) =>
    `flex items-center gap-3 bg-white border-2 rounded-2xl px-4 py-3 transition-all duration-200 ${
      focused === name
        ? "border-blue-500 shadow-lg shadow-blue-100"
        : "border-slate-200 shadow-sm"
    }`;

  const iconClass = (name: string) =>
    `transition-colors duration-200 shrink-0 ${focused === name ? "text-blue-500" : "text-slate-300"}`;

  const inputInner = "flex-1 text-slate-800 text-sm font-medium placeholder:text-slate-300 focus:outline-none bg-transparent";

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex flex-col font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .auth-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatDot {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        .anim-1 { animation: fadeSlideUp 0.45s ease forwards; }
        .anim-2 { animation: fadeSlideUp 0.45s ease 0.08s forwards; opacity: 0; }
        .anim-3 { animation: fadeSlideUp 0.45s ease 0.16s forwards; opacity: 0; }
        .anim-4 { animation: fadeSlideUp 0.45s ease 0.24s forwards; opacity: 0; }
        .dot-1 { animation: floatDot 3s ease-in-out infinite; }
        .dot-2 { animation: floatDot 3s ease-in-out 1s infinite; }
      `}</style>

      <div className="auth-page flex flex-col min-h-screen">

        {/* ── HERO — lebih compact dari login ─────────────── */}
        <div className="relative bg-blue-600 pt-12 pb-14 px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} />
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-6 w-32 h-32 bg-indigo-500/25 rounded-full blur-2xl" />
          <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full dot-1" />
          <div className="absolute top-14 right-20 w-1.5 h-1.5 bg-white/30 rounded-full dot-2" />

          <div className="relative z-10 anim-1">
            {/* Back button */}
            <Link href="/login" className="inline-flex items-center gap-2 mb-6 text-white/70 hover:text-white transition text-sm font-medium">
              <div className="p-1.5 bg-white/15 border border-white/25 rounded-xl">
                <ArrowLeft size={14} />
              </div>
              Kembali ke Login
            </Link>

            <div className="flex items-center gap-2 mb-5">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/30">
                <ScanFace size={20} className="text-white" />
              </div>
              <span className="text-white font-extrabold text-base tracking-tight">GeoFace</span>
            </div>

            <h1 className="text-white font-extrabold text-2xl leading-tight mb-1.5">
              Buat Akun Baru
            </h1>
            <p className="text-blue-200 text-sm">Daftarkan diri untuk mulai absensi</p>
          </div>

          {/* <div className="relative z-10 flex gap-2 mt-4 anim-2">
            <div className="flex items-center gap-1.5 bg-white/15 border border-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <ScanFace size={12} className="text-white" />
              <span className="text-white text-[11px] font-semibold">Face Recognition</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 border border-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <MapPin size={12} className="text-white" />
              <span className="text-white text-[11px] font-semibold">GPS Verified</span>
            </div>
          </div> */}
        </div>

        {/* ── FORM ─────────────────────────────────────────── */}
        <div className="flex-1 bg-[#f0f4ff] -mt-5 rounded-t-[2rem] px-6 pt-7 pb-12 relative z-10">

          {/* Progress steps */}
         

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 anim-3">
              <div className="bg-red-100 text-red-600 p-1 rounded-lg shrink-0 mt-0.5">
                <AlertCircle size={14} />
              </div>
              <p className="text-sm text-red-700 font-medium leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5 anim-3">

            {/* Nama */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
              <div className={inputClass("name")}>
                <User size={17} className={iconClass("name")} />
                <input name="name" type="text" placeholder="Nama sesuai identitas" required
                  value={form.name} onChange={handleChange}
                  onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                  className={inputInner} />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Username</label>
              <div className={inputClass("username")}>
                <AtSign size={17} className={iconClass("username")} />
                <input name="username" type="text" placeholder="Pilih username unik" required
                  value={form.username} onChange={handleChange}
                  onFocus={() => setFocused("username")} onBlur={() => setFocused(null)}
                  className={inputInner} />
              </div>
            </div>

            {/* NIK + Email — 2 kolom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">NIK</label>
                <div className={inputClass("nik")}>
                  <CreditCard size={15} className={iconClass("nik")} />
                  <input name="nik" type="text" placeholder="Opsional"
                    value={form.nik} onChange={handleChange}
                    onFocus={() => setFocused("nik")} onBlur={() => setFocused(null)}
                    className={inputInner} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
                <div className={inputClass("email")}>
                  <AtSign size={15} className={iconClass("email")} />
                  <input name="email" type="email" placeholder="Opsional"
                    value={form.email} onChange={handleChange}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                    className={inputInner} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kata Sandi</label>
              <div className={inputClass("password")}>
                <Lock size={17} className={iconClass("password")} />
                <input name="password" type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter" required
                  value={form.password} onChange={handleChange}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                  className={inputInner} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-300 hover:text-slate-500 transition-colors shrink-0">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength indicator */}
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 w-8 rounded-full transition-colors ${
                        form.password.length >= i * 3
                          ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-yellow-400" : "bg-green-500"
                          : "bg-slate-200"
                      }`} />
                    ))}
                  </div>
                  <span className={`text-[11px] font-semibold ${
                    form.password.length >= 9 ? "text-green-600"
                    : form.password.length >= 6 ? "text-yellow-600"
                    : "text-red-500"
                  }`}>
                    {form.password.length >= 9 ? "Kuat" : form.password.length >= 6 ? "Cukup" : "Lemah"}
                  </span>
                </div>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Konfirmasi Sandi</label>
              <div className={`${inputClass("confirmPassword")} ${
                form.confirmPassword.length > 0
                  ? passwordMatch ? "border-green-400 shadow-green-100" : "border-red-300 shadow-red-100"
                  : ""
              }`}>
                <Lock size={17} className={iconClass("confirmPassword")} />
                <input name="confirmPassword" type={showConfirm ? "text" : "password"}
                  placeholder="Ulangi kata sandi" required
                  value={form.confirmPassword} onChange={handleChange}
                  onFocus={() => setFocused("confirmPassword")} onBlur={() => setFocused(null)}
                  className={inputInner} />
                <div className="flex items-center gap-1 shrink-0">
                  {form.confirmPassword.length > 0 && (
                    passwordMatch
                      ? <Check size={14} className="text-green-500" />
                      : <AlertCircle size={14} className="text-red-400" />
                  )}
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="text-slate-300 hover:text-slate-500 transition-colors">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {form.confirmPassword.length > 0 && !passwordMatch && (
                <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-1">Kata sandi tidak cocok</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button type="submit" disabled={loading || !passwordMatch || !passwordStrong}
                className={`w-full py-4 rounded-2xl font-bold text-white text-sm transition-all duration-200 ${
                  loading || !passwordMatch || !passwordStrong
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-200"
                }`}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Membuat Akun...
                  </span>
                ) : "Buat Akun Sekarang"}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 anim-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs font-medium">Sudah punya akun?</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <Link href="/login" className="block">
              <div className="w-full py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-center font-bold text-slate-600 text-sm hover:border-blue-300 hover:text-blue-600 transition-all active:scale-[0.98]">
                Masuk ke Akun
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}