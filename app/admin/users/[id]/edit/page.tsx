"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import {
  ArrowLeft, User, Mail, CreditCard,
  Lock, Eye, EyeOff, CheckCircle2, AlertCircle
} from "lucide-react";

function EditUserContent() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [form, setForm] = useState({
    name: "", email: "", nik: "",
    password: "", role: "user", is_active: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        const u = res.data;
        setForm({
          name: u.name || "",
          email: u.email || "",
          nik: u.nik || "",
          password: "",
          role: u.role || "user",
          is_active: u.is_active ?? true,
        });
      } catch {
        router.push("/admin/users");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password && form.password.length < 6) {
      setError("Password minimal 6 karakter."); return;
    }

    setSaving(true);
    try {
      const payload: any = {
        name: form.name,
        email: form.email || undefined,
        nik: form.nik || undefined,
        role: form.role,
        is_active: form.is_active,
      };
      if (form.password) payload.password = form.password;

      await api.put(`/users/${userId}`, payload);
      setSuccess(true);
      setTimeout(() => router.push("/admin/users"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Berhasil Diperbarui!</h2>
          <p className="text-slate-500 text-sm">Kembali ke daftar pegawai...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-slate-800 text-white pt-8 pb-14 px-6 rounded-b-[2.5rem] shadow-lg">
        <div className="flex items-center gap-3">
          <Link href={`/admin/users/${userId}`} className="p-2 bg-white/10 rounded-full active:scale-95 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Edit Pegawai</h1>
            <p className="text-slate-400 text-xs">Ubah data user</p>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Nama Lengkap *</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="name" type="text" required value={form.name} onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">NIK</label>
              <div className="relative">
                <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="nik" type="text" value={form.nik} onChange={handleChange}
                  placeholder="Opsional"
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="Opsional"
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Password Baru</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange}
                  placeholder="Kosongkan jika tidak ingin ganti"
                  className="w-full pl-9 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Role *</label>
              <select name="role" value={form.role} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="user">User (Karyawan)</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Toggle Aktif */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="font-semibold text-slate-700 text-sm">Status Akun</p>
                <p className="text-xs text-slate-400">Nonaktifkan untuk memblokir akses</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_active" checked={form.is_active}
                  onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <button type="submit" disabled={saving}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                saving ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
              }`}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function EditUserPage() {
  return <AuthGuard requireAdmin><EditUserContent /></AuthGuard>;
}