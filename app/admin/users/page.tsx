"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import {
  ArrowLeft, Plus, Search, Pencil, Trash2,
  CheckCircle2, XCircle, ScanFace, RefreshCw, User
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

function UsersContent() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Gagal menghapus user.");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.nik || "").includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">

      {/* Header */}
      <header className="relative bg-slate-800 text-white pt-8 pb-14 px-6 rounded-b-[2.5rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl" />
        <div className="flex items-center gap-3 relative z-10">
          <Link href="/admin/dashboard" className="p-2 bg-white/10 rounded-full active:scale-95 transition">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Data Pegawai</h1>
            <p className="text-slate-400 text-xs">{users.length} total pegawai</p>
          </div>
          <button onClick={fetchUsers} className="p-2 bg-white/10 rounded-full active:scale-95 transition">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      <main className="px-6 -mt-6 space-y-4">

        {/* Search + Add */}
        <div className="flex gap-3 z-50">
          <div className="relative flex-1 text-slate-500">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, username, NIK..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <Link href="/admin/users/create">
            <button className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition">
              <Plus size={20} />
            </button>
          </Link>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
            <User className="mx-auto text-slate-300 mb-2" size={36} />
            <p className="text-slate-500 font-medium">Tidak ada pegawai ditemukan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(user => (
              <div key={user.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        user.role === "admin" ? "bg-slate-800 text-white" : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400">@{user.username} {user.nik ? `· ${user.nik}` : ""}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            user.role === "admin" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-600"
                          }`}>
                            {user.role}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            user.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                          }`}>
                            {user.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            user.has_face ? "bg-purple-50 text-purple-600" : "bg-slate-100 text-slate-500"
                          }`}>
                            {user.has_face ? "✓ Wajah" : "✗ Wajah"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <Link href={`/admin/users/${user.id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition active:scale-95">
                        <ScanFace size={14} />
                        Kelola Wajah
                      </button>
                    </Link>
                    <Link href={`/admin/users/${user.id}/edit`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-semibold transition active:scale-95">
                        <Pencil size={14} />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(user.id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-semibold transition active:scale-95"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Hapus User?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">
              Tindakan ini tidak dapat dibatalkan. Semua data user akan dihapus.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold active:scale-95 transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold active:scale-95 transition disabled:opacity-50"
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return <AuthGuard requireAdmin><UsersContent /></AuthGuard>;
}