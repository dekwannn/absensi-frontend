"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getErrorDetail } from "@/lib/errors";
import { api } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import {
  ArrowLeft, ScanFace, Trash2, Upload,
  CheckCircle2, XCircle, AlertCircle, Pencil, X
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  username: string;
  email?: string;
  nik?: string;
  role: string;
  is_active: boolean;
  has_face: boolean;
}

function UserDetailContent() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => { fetchUser(); }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${userId}`);
      setUser(res.data);
    } catch {
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
    setSuccessMsg("");
  };

  const handleEnroll = async () => {
    if (!selectedFile) return;
    setEnrolling(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      await api.post(`/users/${userId}/enroll-face`, formData);
      setSuccessMsg("Wajah berhasil didaftarkan!");
      setPreview(null);
      setSelectedFile(null);
      await fetchUser();
    } catch (err) {
      setError(getErrorDetail(err, "Gagal mendaftarkan wajah."));
    } finally {
      setEnrolling(false);
    }
  };

  const handleRemoveFace = async () => {
    setRemoving(true);
    setError("");
    try {
      await api.delete(`/users/${userId}/enroll-face`);
      setSuccessMsg("Data wajah berhasil dihapus.");
      await fetchUser();
    } catch (err) {
      setError(getErrorDetail(err, "Gagal menghapus wajah."));
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-slate-800 text-white pt-8 pb-14 px-6 rounded-b-[2.5rem] shadow-lg">
        <div className="flex items-center gap-3">
          <Link href="/admin/users" className="p-2 bg-white/10 rounded-full active:scale-95 transition">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-slate-400 text-xs">@{user.username} · {user.role}</p>
          </div>
          <Link href={`/admin/users/${userId}/edit`}>
            <button className="p-2 bg-white/10 rounded-full active:scale-95 transition">
              <Pencil size={18} />
            </button>
          </Link>
        </div>
      </header>

      <main className="px-6 -mt-6 space-y-4">

        {/* Info Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${
              user.role === "admin" ? "bg-slate-800 text-white" : "bg-blue-100 text-blue-700"
            }`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg">{user.name}</h2>
              <p className="text-slate-400 text-sm">@{user.username}</p>
              {user.nik && <p className="text-slate-400 text-xs">NIK: {user.nik}</p>}
              {user.email && <p className="text-slate-400 text-xs">{user.email}</p>}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              user.role === "admin" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-600"
            }`}>{user.role}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              user.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}>{user.is_active ? "Aktif" : "Nonaktif"}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              user.has_face ? "bg-purple-50 text-purple-600" : "bg-slate-100 text-slate-500"
            }`}>
              {user.has_face ? "✓ Wajah Terdaftar" : "✗ Belum Ada Wajah"}
            </span>
          </div>
        </div>

        {/* Status/Error */}
        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle2 size={16} /> <p>{successMsg}</p>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle size={16} /> <p>{error}</p>
          </div>
        )}

        {/* Face Enrollment */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ScanFace size={20} className="text-blue-600" />
            Manajemen Wajah
          </h3>

          {/* Status wajah */}
          <div className={`p-4 rounded-2xl mb-4 flex items-center gap-3 ${
            user.has_face ? "bg-purple-50 border border-purple-100" : "bg-slate-50 border border-slate-200"
          }`}>
            {user.has_face
              ? <CheckCircle2 size={20} className="text-purple-600 shrink-0" />
              : <XCircle size={20} className="text-slate-400 shrink-0" />
            }
            <div>
              <p className="font-semibold text-sm text-slate-700">
                {user.has_face ? "Wajah sudah terdaftar" : "Wajah belum terdaftar"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {user.has_face
                  ? "User dapat melakukan absensi dengan wajah"
                  : "Upload foto untuk mendaftarkan wajah user"}
              </p>
            </div>
          </div>

          {/* Upload area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {preview ? (
            <div className="mb-4">
              <div className="relative w-full max-w-[200px] mx-auto">
                <img src={preview} alt="Preview" className="w-full rounded-2xl border-4 border-slate-200 shadow" />
                <button
                  onClick={() => { setPreview(null); setSelectedFile(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition active:scale-95 ${
                  enrolling ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {enrolling ? "Mendaftarkan..." : "Daftarkan Wajah Ini"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition active:scale-95"
            >
              <Upload size={24} />
              <span className="text-sm font-medium">Upload Foto Wajah</span>
              <span className="text-xs">JPG, PNG — pastikan wajah terlihat jelas</span>
            </button>
          )}

          {/* Remove face */}
          {user.has_face && (
            <button
              onClick={handleRemoveFace}
              disabled={removing}
              className="w-full mt-3 py-3 rounded-xl border border-red-200 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition active:scale-95"
            >
              <Trash2 size={16} />
              {removing ? "Menghapus..." : "Hapus Data Wajah"}
            </button>
          )}
        </div>

      </main>
    </div>
  );
}

export default function UserDetailPage() {
  return <AuthGuard requireAdmin><UserDetailContent /></AuthGuard>;
}