"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import { witaMonthStr, formatTime as formatWitaTime, formatDate as formatCalendarDate } from "@/lib/time";
import { ArrowLeft, RefreshCw, CalendarDays, Clock, MapPin, X } from "lucide-react";
import LocationMap from "@/components/LocationMap";
import { distanceMeters, formatDistance, type Office } from "@/lib/geo";

interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: string;
  // lokasi check-in
  latitude?: number | null;
  longitude?: number | null;
  distance?: number | null;
  // lokasi check-out
  checkout_latitude?: number | null;
  checkout_longitude?: number | null;
  checkout_distance?: number | null;
}

interface Place {
  lat: number;
  lng: number;
  distance?: number | null;
}

const toPlace = (lat?: number | null, lng?: number | null, distance?: number | null): Place | null =>
  lat != null && lng != null ? { lat, lng, distance } : null;

// Record lama (sebelum ada field checkout_*) menimpa lokasi check-in saat check-out,
// jadi latitude/longitude di record itu sebenarnya lokasi check-out.
function getPlaces(r: AttendanceRecord) {
  const legacy = !!r.check_out && r.checkout_latitude == null;
  const stored = toPlace(r.latitude, r.longitude, r.distance);
  return {
    checkIn:  legacy ? null : stored,
    checkOut: legacy ? stored : toPlace(r.checkout_latitude, r.checkout_longitude, r.checkout_distance),
  };
}

const googleMapsUrl = (p: Place) => `https://www.google.com/maps?q=${p.lat},${p.lng}`;

// Buka peta kecil di halaman ini; bila data kantor belum ada, langsung ke Google Maps
function PlaceLink({ place, onOpen }: { place: Place | null; onOpen?: (place: Place) => void }) {
  if (!place) return null;
  const label = place.distance != null ? `${Math.round(place.distance)} m dari kantor` : "Lihat peta";
  const className = "mt-0.5 flex items-center gap-1 text-xs text-blue-500 hover:underline";
  if (onOpen) {
    return (
      <button type="button" onClick={() => onOpen(place)} title="Lihat di peta" className={className}>
        <MapPin size={11} /> {label}
      </button>
    );
  }
  return (
    <a href={googleMapsUrl(place)} target="_blank" rel="noopener noreferrer" title="Buka di Google Maps" className={className}>
      <MapPin size={11} /> {label}
    </a>
  );
}

function PlaceMapModal({ office, place, title, onClose }: { office: Office; place: Place; title: string; onClose: () => void }) {
  const distance = distanceMeters(place.lat, place.lng, office.lat, office.lng);
  const inside = distance <= office.radius;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <p className="font-bold text-sm text-slate-800">{title}</p>
          <button type="button" onClick={onClose} aria-label="Tutup peta" className="p-1 rounded-full hover:bg-slate-100">
            <X size={18} className="text-slate-500" />
          </button>
        </div>
        <LocationMap office={office} point={{ lat: place.lat, lng: place.lng }} inside={inside} pointLabel={title} className="h-72 w-full" />
        <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs">
          <span className={inside ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
            {formatDistance(distance)} dari kantor {inside ? "(dalam radius)" : "(di luar radius)"}
          </span>
          <a href={googleMapsUrl(place)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline shrink-0">
            Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

function AttendanceContent() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(witaMonthStr());
  const [office, setOffice] = useState<Office | null>(null);
  const [mapView, setMapView] = useState<{ place: Place; title: string } | null>(null);

  useEffect(() => {
    api.get("/attendance/office")
      .then((res) => {
        const d = res.data.data;
        setOffice({ lat: d.latitude, lng: d.longitude, radius: d.radius });
      })
      .catch(() => { /* tanpa data kantor, link lokasi membuka Google Maps */ });
  }, []);

  // ambil hanya data bulan yang dipilih (filter di backend), muat ulang saat bulan diganti
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance", { params: { month } });
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const formatTime = (t?: string) => formatWitaTime(t, "-");

  const formatDate = (d: string) => formatCalendarDate(d, { weekday: "short", day: "numeric", month: "short" });

  const filtered = data
    .filter(a => a.date?.startsWith(month));

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="relative bg-slate-800 text-white pt-8 pb-14 px-6 rounded-b-[2.5rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl" />
        <div className="flex items-center gap-3 relative z-10">
          <Link href="/admin/dashboard" className="p-2 bg-white/10 rounded-full active:scale-95 transition">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Rekap Absensi</h1>
            <p className="text-slate-400 text-xs">{filtered.length} record ditemukan</p>
          </div>
          <button onClick={fetchData} className="p-2 bg-white/10 rounded-full active:scale-95 transition">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      <main className="px-6 -mt-6 space-y-4">
        {/* Filter */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Filter Bulan</label>
            <input type="month" value={month} onChange={e => setMonth(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Summary bulan ini */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-xl font-bold text-slate-800">{filtered.length}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-xl font-bold text-green-600">{filtered.filter(a => a.check_in && a.check_out).length}</p>
            <p className="text-xs text-slate-400">Lengkap</p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-xl font-bold text-orange-500">{filtered.filter(a => a.check_in && !a.check_out).length}</p>
            <p className="text-xs text-slate-400">Belum Out</p>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
            <CalendarDays className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-500 font-medium">Belum ada data absensi</p>
            <p className="text-slate-400 text-sm">pada bulan yang dipilih</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(record => {
              const isComplete = record.check_in && record.check_out;
              const hasIn = !!record.check_in;
              const places = getPlaces(record);
              return (
                <div key={record.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        {formatDate(record.date)} · ID: ...{record.user_id.slice(-8)}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      isComplete ? "bg-green-100 text-green-600"
                      : hasIn ? "bg-orange-100 text-orange-500"
                      : "bg-red-100 text-red-500"
                    }`}>
                      {isComplete ? "Lengkap" : hasIn ? "Belum Out" : "Absen"}
                    </span>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Clock size={13} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Masuk</p>
                        <p className="font-semibold text-sm text-slate-700">{formatTime(record.check_in)}</p>
                        <PlaceLink place={places.checkIn} onOpen={office ? (p) => setMapView({ place: p, title: `Lokasi masuk · ${formatDate(record.date)}` }) : undefined} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-orange-50 rounded-lg">
                        <Clock size={13} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Keluar</p>
                        <p className="font-semibold text-sm text-slate-700">{formatTime(record.check_out)}</p>
                        <PlaceLink place={places.checkOut} onOpen={office ? (p) => setMapView({ place: p, title: `Lokasi keluar · ${formatDate(record.date)}` }) : undefined} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {mapView && office && (
        <PlaceMapModal office={office} place={mapView.place} title={mapView.title} onClose={() => setMapView(null)} />
      )}
    </div>
  );
}

export default function AdminAttendancePage() {
  return <AuthGuard requireAdmin><AttendanceContent /></AuthGuard>;
}