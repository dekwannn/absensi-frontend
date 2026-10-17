'use client';

import React, { useRef, useState } from 'react';
import { 
  LogIn, LogOut, Bell, ArrowRight, CheckCircle2, 
  Instagram, Download, Smartphone, Zap, X, 
  ShieldCheck, LogOut as LogOutIcon, ChevronLeft, 
  Navigation, RefreshCw, Send, MapPin, Camera,
  CalendarDays, Clock, Filter, TrendingUp, AlertCircle, CheckCircle
} from 'lucide-react';

// ─── DESIGN SYSTEM ──────────────────────────────────────────────────────────
const FONT_URL = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=DM+Sans:wght@400;500;600;700;800&display=swap');`;

const THEME = {
  bg: '#f8fafc',        // Background utama canvas
  primary: '#3b82f6',   // Blue 600
  primaryDark: '#2563eb', // Blue 700
  secondary: '#1e293b', // Slate 800
  accent: '#10b981',    // Green 500
  warning: '#f97316',   // Orange 500
  danger: '#ef4444',    // Red 500
  muted: '#64748b',     // Slate 500
  border: '#e2e8f0',    // Slate 200
  light: '#f1f5f9'      // Slate 100
};

const fHeading = "'Bricolage Grotesque', sans-serif";
const fBody = "'DM Sans', sans-serif";

// ─── DUMMY DATA ────────────────────────────────────────────────────────────
const MOCK_HISTORY = [
  { id: 1, date: "2026-03-31", check_in: "2026-03-31T07:55:00", check_out: "2026-03-31T17:05:00", checkin_status: "on_time", checkin_label: "Tepat Waktu" },
  { id: 2, date: "2026-03-30", check_in: "2026-03-30T08:15:00", check_out: "2026-03-30T17:10:00", checkin_status: "late", checkin_label: "Terlambat" }
];

const MOCK_LOGS = [
  { id: 1, date: "31 Mar", in: "07:55", out: "17:05", status: "on_time", label: "Tepat Waktu", complete: true },
  { id: 2, date: "30 Mar", in: "08:15", out: "17:10", status: "late", label: "Terlambat", complete: true },
  { id: 3, date: "29 Mar", in: "07:50", out: "17:00", status: "on_time", label: "Tepat Waktu", complete: true },
  { id: 4, date: "28 Mar", in: "07:58", out: "16:55", status: "on_time", label: "Tepat Waktu", complete: true },
];

// ─── REUSABLE COMPONENTS ────────────────────────────────────────────────────
const Canvas = ({ children, bg = THEME.bg, gridOpacity = 0.5 }: { children: React.ReactNode, bg?: string, gridOpacity?: number }) => (
  <div style={{ 
    width: 1080, height: 1350, background: bg, 
    position: 'relative', overflow: 'hidden', flexShrink: 0 
  }}>
    <div style={{ 
      position: 'absolute', inset: 0, opacity: gridOpacity,
      backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
      backgroundSize: '40px 40px' 
    }} />
    {children}
  </div>
);

const PhoneFrame = ({ children, scale = 1, rotation = 0, opacity = 1, shadowX = 0 }: { children: React.ReactNode, scale?: number, rotation?: number, opacity?: number, shadowX?: number }) => (
  <div style={{ 
    width: 390, height: 800, background: '#ffffff', borderRadius: 48, 
    border: '12px solid #1e293b', position: 'relative', overflow: 'hidden', 
    boxShadow: `${shadowX}px 40px 80px rgba(15, 23, 42, 0.15)`, zIndex: 100, 
    display: 'flex', flexDirection: 'column',
    transform: `scale(${scale}) rotate(${rotation}deg)`,
    opacity: opacity,
    transformOrigin: 'center center'
  }}>
    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 120, height: 26, background: '#1e293b', borderRadius: '0 0 18px 18px', zIndex: 110 }} />
    {children}
  </div>
);

// ─── MOCKUP CONTENT BLOCKS ──────────────────────────────────────────────────
const AppContentMock = () => {
  const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
  const fmt = (t?: string) => t ? new Date(t).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "--:--";

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', background: '#fff' }}>
      
      <div style={{ flex: 1, overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '36px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, background: THEME.light, borderRadius: '50%', overflow: 'hidden' }}>
              <img src="https://ui-avatars.com/api/?name=Widi&background=3b82f6&color=fff" alt="Avatar" style={{ width: '100%' }} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: THEME.secondary, fontSize: 15, fontWeight: 'bold' }}>Kadek Widiadnyana</h4>
              <p style={{ margin: 0, color: THEME.muted, fontSize: 11 }}>Frontend Developer</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 34, height: 34, background: THEME.light, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={16} color={THEME.muted} /></div>
            <div style={{ width: 34, height: 34, background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogOut size={16} color={THEME.danger} /></div>
          </div>
        </header>

        <div style={{ padding: '0 24px', marginBottom: 16, flexShrink: 0 }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 16, padding: '16px', display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, color: '#93c5fd' }}><X size={16} strokeWidth={2.5} /></div>
            <div style={{ background: '#dbeafe', color: '#2563eb', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={18} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, paddingRight: 10 }}>
              <h4 style={{ margin: 0, color: '#1e3a8a', fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em' }}>Aktifkan Pengingat Absensi</h4>
              <p style={{ margin: '4px 0 12px', color: '#2563eb', fontSize: 12, lineHeight: 1.45, fontWeight: 500 }}>Dapatkan notifikasi 10 menit sebelum waktu absen masuk & pulang.</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 0', borderRadius: 8, textAlign: 'center', boxShadow: '0 2px 6px rgba(37,99,235,0.2)' }}>Izinkan</div>
                <div style={{ padding: '8px 16px', background: '#fff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: 12, fontWeight: 700, borderRadius: 8, textAlign: 'center' }}>Nanti</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px', marginBottom: 20, display: 'flex', gap: 8, flexShrink: 0 }}>
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum'].map((day, i) => (
            <div key={day} style={{ flex: 1, padding: '10px 0', borderRadius: 14, textAlign: 'center', background: i === 2 ? THEME.primary : '#fff', border: i === 2 ? 'none' : `1px solid ${THEME.border}`, boxShadow: i === 2 ? '0 8px 15px rgba(59,130,246,0.3)' : 'none', transform: i === 2 ? 'scale(1.05)' : 'none' }}>
              <div style={{ fontSize: 9, color: i === 2 ? '#fff' : THEME.muted, opacity: 0.8 }}>{day}</div>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: i === 2 ? '#fff' : THEME.secondary, margin: '2px 0' }}>{24 + i}</div>
              {i < 2 && <div style={{ width: 4, height: 4, background: THEME.primary, borderRadius: '50%', margin: '2px auto 0' }} />}
            </div>
          ))}
        </div>

        <div style={{ padding: '0 24px', marginBottom: 20, flexShrink: 0 }}>
          <h3 style={{ fontSize: 14, fontWeight: 'bold', color: THEME.secondary, marginBottom: 12 }}>Absensi Hari ini</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ padding: 14, background: '#eff6ff', borderRadius: 16, border: '1px solid #dbeafe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ padding: 4, background: THEME.primary, borderRadius: 6, color: '#fff' }}><LogIn size={12} /></div>
                <span style={{ fontSize: 10, fontWeight: 600, color: THEME.primary }}>Masuk</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: THEME.secondary }}>08:00</div>
              <div style={{ fontSize: 10, color: THEME.accent, fontWeight: 600 }}>Tepat Waktu</div>
            </div>
            <div style={{ padding: 14, background: THEME.light, borderRadius: 16, border: `1px solid ${THEME.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ padding: 4, background: '#cbd5e1', borderRadius: 6, color: '#fff' }}><LogOut size={12} /></div>
                <span style={{ fontSize: 10, fontWeight: 600, color: THEME.muted }}>Keluar</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#94a3b8' }}>--:--</div>
              <div style={{ fontSize: 10, color: THEME.muted }}>Belum Absen</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: 14, fontWeight: 'bold', color: THEME.secondary }}>Riwayat Absensi</h3>
            <span style={{ fontSize: 11, color: THEME.primary, fontWeight: 600 }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOCK_HISTORY.map(item => {
              const isComplete = item.check_in && item.check_out;
              const isLate = item.checkin_status === "late";
              return (
                <div key={item.id} style={{ background: '#fff', border: `1px solid ${THEME.border}`, borderLeft: `4px solid ${isLate ? THEME.danger : THEME.primary}`, borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ minWidth: 65 }}>
                    <p style={{ fontSize: 11, fontWeight: 'bold', color: THEME.secondary, margin: '0 0 2px' }}>{fmtDate(item.date)}</p>
                    <span style={{ fontSize: 9, fontWeight: 600, color: isLate ? THEME.danger : THEME.accent, background: isLate ? '#fee2e2' : '#dcfce7', padding: '2px 6px', borderRadius: 99 }}>{item.checkin_label}</span>
                  </div>
                  <div style={{ width: 1, height: 32, background: THEME.border, margin: '0 8px' }} />
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ padding: 4, background: '#eff6ff', borderRadius: 6 }}><LogIn size={10} color={THEME.primary} /></div>
                    <div>
                      <p style={{ fontSize: 9, color: THEME.muted, margin: 0 }}>Masuk</p>
                      <p style={{ fontSize: 12, fontWeight: 'bold', color: THEME.secondary, margin: 0 }}>{fmt(item.check_in)}</p>
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ padding: 4, background: '#fff7ed', borderRadius: 6 }}><LogOutIcon size={10} color={THEME.warning} /></div>
                    <div>
                      <p style={{ fontSize: 9, color: THEME.muted, margin: 0 }}>Keluar</p>
                      <p style={{ fontSize: 12, fontWeight: 'bold', color: THEME.secondary, margin: 0 }}>{fmt(item.check_out)}</p>
                    </div>
                  </div>
                  <span style={{ background: '#dcfce7', color: THEME.accent, fontSize: 10, fontWeight: 'bold', padding: '4px 8px', borderRadius: 99, marginLeft: 8 }}>{isComplete ? "✓" : "-"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px', background: '#fff', borderTop: `1px solid ${THEME.border}`, flexShrink: 0 }}>
        <div style={{ position: 'relative', width: '100%', height: 52, background: THEME.primary, borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>Geser untuk Absen Masuk</span>
          </div>
          <div style={{ position: 'absolute', top: 4, left: 4, bottom: 4, width: 44, background: '#fff', border: `2px solid ${THEME.primary}`, borderRadius: 9999, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={18} color={THEME.primary} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CameraLocationMock = () => (
  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', background: '#f0f4ff', overflow: 'hidden' }}>
    <header style={{ padding: '40px 24px 60px', background: 'linear-gradient(135deg, #2563eb, #3b82f6, #4f46e5)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '22px 22px' }} />
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
         <div style={{ padding: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, backdropFilter: 'blur(4px)' }}>
           <ChevronLeft size={20} color="#fff" />
         </div>
         <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: 0 }}>Absensi Masuk</h1>
      </div>
    </header>

    <div style={{ flex: 1, padding: '0 20px', marginTop: -50, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', border: '1px solid #bbf7d0', boxShadow: '0 4px 15px rgba(22,163,74,0.05)' }}>
        <div style={{ padding: 8, background: '#dcfce7', borderRadius: 12 }}><Navigation size={16} color="#16a34a" /></div>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lokasi Anda</p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Singaraja, Buleleng, Bali</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Ambil Foto Wajah</p>
           <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eff6ff', padding: '6px 10px', borderRadius: 10 }}>
             <RefreshCw size={12} color="#2563eb" />
             <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb' }}>Foto Ulang</span>
           </div>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ position: 'relative', width: 170, height: 220, borderRadius: 20, overflow: 'hidden', border: '4px solid #f8fafc', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginBottom: 16 }}>
             <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" alt="Face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', padding: '24px 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
               <CheckCircle2 size={13} color="#4ade80" />
               <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>Foto siap dikirim</span>
             </div>
             <div style={{ position: 'absolute', top: -6, right: -6, background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 99, boxShadow: '0 4px 10px rgba(34,197,94,0.4)' }}>✓ OK</div>
           </div>
           <div style={{ background: '#f8fafc', borderRadius: 12, padding: '10px', width: '100%', textAlign: 'center' }}>
             <span style={{ color: '#64748b', fontSize: 11, fontWeight: 500 }}>Foto wajah berhasil diambil.</span>
           </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9', padding: '16px 20px' }}>
        <p style={{ margin: '0 0 12px', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ringkasan</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>Jenis</span>
            <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>Absensi Masuk</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>Lokasi</span>
            <span style={{ color: '#1e293b', fontSize: 12, fontWeight: 700 }}>Singaraja, Bali</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>Foto</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={13} color="#22c55e" />
              <span style={{ color: '#16a34a', fontSize: 12, fontWeight: 700 }}>Sudah diambil</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 10px 25px rgba(37,99,235,0.3)', marginTop: 'auto', marginBottom: 20 }}>
        <Send size={16} color="#fff" />
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Kirim Absensi Masuk</span>
      </div>
    </div>
  </div>
);

const HistoryContentMock = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', background: '#f0f4ff', overflow: 'hidden' }}>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none' }}>
        <header style={{ position: 'relative', background: '#2563eb', padding: '40px 24px 110px', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(96, 165, 250, 0.3)', borderRadius: '50%', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 120, height: 120, background: 'rgba(99, 102, 241, 0.3)', borderRadius: '50%', filter: 'blur(30px)' }} />
          <div style={{ position: 'absolute', top: 24, left: '50%', width: 80, height: 80, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', filter: 'blur(20px)' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 10, marginBottom: 20 }}>
            <div style={{ padding: 8, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
              <ChevronLeft size={18} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', margin: '0 0 2px' }}>Riwayat Absensi</h1>
              <p style={{ fontSize: 12, color: '#dbeafe', margin: 0 }}>Kadek Widiadnyana</p>
            </div>
            <div style={{ padding: 8, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
              <RefreshCw size={16} color="#fff" />
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 8, flexShrink: 0 }}>
              <CalendarDays size={16} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, color: '#dbeafe', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>Pilih Bulan</p>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>Maret 2026</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 10, color: '#dbeafe', fontWeight: 500, margin: 0 }}>22 hari</p>
              <p style={{ fontSize: 10, color: '#bfdbfe', margin: 0 }}>tercatat</p>
            </div>
          </div>
        </header>

        <main style={{ padding: '0 20px', marginTop: -90, position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
          
          <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(37,99,235,0.15)', overflow: 'hidden', border: '1px solid #fff' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)', padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: 0, top: 0, width: 120, height: '100%', opacity: 0.2, backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
              
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 10, marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#bfdbfe' }} />
                    <p style={{ fontSize: 10, color: '#dbeafe', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Rekap Kehadiran Bulan Ini</p>
                  </div>
                  <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 20, margin: '0 0 4px', textTransform: 'capitalize' }}>Maret 2026</h2>
                  <p style={{ color: '#bfdbfe', fontSize: 12, margin: 0 }}>Kamu tercatat hadir <strong style={{ color: '#fff' }}>22 hari</strong> bulan ini</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ position: 'relative', width: 64, height: 64 }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fff" strokeWidth="3.5" strokeDasharray="90 100" strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>90%</span>
                    </div>
                  </div>
                  <span style={{ color: '#bfdbfe', fontSize: 9, fontWeight: 500 }}>Absen Lengkap</span>
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={11} color="#bfdbfe" />
                    <span style={{ color: '#dbeafe', fontSize: 12, fontWeight: 500 }}>Ketepatan Waktu Masuk</span>
                  </div>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>81%</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '81%', background: '#fff', borderRadius: 99 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 9, color: '#bfdbfe' }}>18 hari tepat waktu</span>
                  <span style={{ fontSize: 9, color: '#93c5fd' }}>4 hari terlambat</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 20px 4px' }}>
              <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Detail Statistik</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #f1f5f9' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ background: '#eff6ff', color: '#2563eb', padding: 8, borderRadius: 12, flexShrink: 0 }}>
                  <CalendarDays size={16} />
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#2563eb', margin: '0 0 2px', lineHeight: 1 }}>22</p>
                  <p style={{ fontSize: 12, color: '#475569', fontWeight: 600, margin: 0 }}>Total Hadir</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>bulan Maret</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ background: '#f0fdf4', color: '#16a34a', padding: 8, borderRadius: 12, flexShrink: 0 }}>
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#16a34a', margin: '0 0 2px', lineHeight: 1 }}>20</p>
                  <p style={{ fontSize: 12, color: '#475569', fontWeight: 600, margin: 0 }}>Absen Lengkap</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>masuk & keluar</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRight: '1px solid #f1f5f9' }}>
                <div style={{ background: '#ecfdf5', color: '#059669', padding: 8, borderRadius: 12, flexShrink: 0 }}>
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#059669', margin: '0 0 2px', lineHeight: 1 }}>18</p>
                  <p style={{ fontSize: 12, color: '#475569', fontWeight: 600, margin: 0 }}>Tepat Waktu</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>masuk ≤ 08:00</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                <div style={{ background: '#fef2f2', color: '#ef4444', padding: 8, borderRadius: 12, flexShrink: 0 }}>
                  <AlertCircle size={16} />
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#ef4444', margin: '0 0 2px', lineHeight: 1 }}>4</p>
                  <p style={{ fontSize: 12, color: '#475569', fontWeight: 600, margin: 0 }}>Terlambat</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>masuk &gt; 08:00</p>
                </div>
              </div>

            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: '0 0 2px' }}>Log Absensi</h3>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Daftar catatan masuk & keluar kamu</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOCK_LOGS.map(item => {
              const isLate = item.status === "late";
              return (
                <div key={item.id} style={{ background: '#fff', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', borderLeft: `4px solid ${isLate ? '#f87171' : '#60a5fa'}` }}>
                  
                  <div style={{ minWidth: 64 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: '#334155', margin: '0 0 4px', lineHeight: 1.2 }}>{item.date}</p>
                    <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 99, background: isLate ? '#fee2e2' : '#dcfce7', color: isLate ? '#dc2626' : '#15803d' }}>
                      {item.label}
                    </span>
                  </div>

                  <div style={{ width: 1, height: 36, background: '#f1f5f9', flexShrink: 0 }} />

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ padding: 6, background: '#eff6ff', borderRadius: 8, flexShrink: 0 }}>
                      <LogIn size={11} color="#3b82f6" />
                    </div>
                    <div>
                      <p style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Masuk</p>
                      <p style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', margin: 0, lineHeight: 1 }}>{item.in}</p>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ padding: 6, background: '#fff7ed', borderRadius: 8, flexShrink: 0 }}>
                      <LogOut size={11} color="#f97316" />
                    </div>
                    <div>
                      <p style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>Keluar</p>
                      <p style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', margin: 0, lineHeight: 1 }}>{item.out}</p>
                    </div>
                  </div>

                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 'bold' }}>
                    ✓
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
};


// ─── SLIDE COMPONENTS ───────────────────────────────────────────────────────

const Slide1 = ({ handle }: any) => (
  <Canvas>
    <div style={{ position: 'absolute', top: -150, right: -150, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${THEME.primary}10 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: 0 }} />
    <div style={{ position: 'absolute', bottom: -150, left: -150, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${THEME.accent}08 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: 0 }} />

    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 100, right: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
      
      {/* KIRI: Copywriting */}
      <div style={{ width: 500 }}>
        <h1 style={{ fontFamily: fHeading, fontWeight: 800, fontSize: 90, lineHeight: 0.95, letterSpacing: '-0.04em', color: THEME.secondary, margin: '0 0 32px' }}>
          Absensi Kerja <br />
          <span style={{ color: THEME.primary, fontStyle: 'italic' }}>Real-time & Akurat</span>
        </h1>

        <p style={{ fontFamily: fBody, fontSize: 22, lineHeight: 1.6, color: THEME.muted, maxWidth: 480, margin: '0 0 48px' }}>
          Pantau kehadiran karyawan dengan verifikasi lokasi dan waktu yang presisi langsung dari genggaman.
        </p>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ padding: '14px 24px', borderRadius: 16, background: THEME.secondary, color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 20px rgba(30,41,59,0.15)' }}>
            <Smartphone size={20} />
            Coba Sekarang
          </div>
          <div style={{ padding: '14px 24px', borderRadius: 16, background: '#fff', border: `1px solid ${THEME.border}`, color: THEME.secondary, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={20} color={THEME.primary} />
            Fitur Utama
          </div>
        </div>
      </div>

      {/* KANAN: Phone Mockup */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: -40, borderRadius: '50%', border: `1px dashed ${THEME.border}`, transform: 'rotate(15deg)' }} />
        
        <PhoneFrame>
          <AppContentMock />
        </PhoneFrame>
      </div>

    </div>

    <div style={{ position: 'absolute', bottom: 50, left: 100, display: 'flex', alignItems: 'center', gap: 12, background: THEME.secondary, padding: '12px 28px', borderRadius: 99, zIndex: 50 }}>
      <Instagram size={20} color="#fff" />
      <span style={{ fontFamily: fBody, fontWeight: 700, fontSize: 18, color: '#fff' }}>{handle}</span>
    </div>
  </Canvas>
);

const Slide2 = ({ handle }: any) => (
  <Canvas>
    <div style={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${THEME.primary}10 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: 0 }} />

    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 100, right: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
      
      {/* KIRI: Phone Mockup (Kamera & Lokasi) */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: -40, borderRadius: '50%', border: `1px dashed ${THEME.border}`, transform: 'rotate(-15deg)' }} />
        
        <PhoneFrame>
          <CameraLocationMock />
        </PhoneFrame>

      </div>

      {/* KANAN: Copywriting */}
      <div style={{ width: 460, textAlign: 'left', paddingLeft: 20 }}>
        <h1 style={{ fontFamily: fHeading, fontWeight: 900, fontSize: 80, lineHeight: 0.95, letterSpacing: '-0.04em', color: THEME.secondary, margin: '0 0 24px' }}>
          Verifikasi <br />
          <span style={{ color: THEME.primary, fontStyle: 'italic' }}>Lokasi & Wajah</span>
        </h1>

        <p style={{ fontFamily: fBody, fontSize: 20, lineHeight: 1.6, color: THEME.muted, margin: '0 0 40px' }}>
          Absensi lebih aman dengan integrasi GPS real-time dan deteksi wajah (Selfie) untuk menghindari segala bentuk kecurangan.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: `1px solid ${THEME.border}`, borderRadius: 20, padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={24} color={THEME.primary} />
            </div>
            <div>
              <h3 style={{ fontFamily: fHeading, fontSize: 18, fontWeight: 800, color: THEME.secondary, margin: '0 0 4px' }}>Validasi Selfie</h3>
              <p style={{ fontFamily: fBody, fontSize: 14, color: THEME.muted, margin: 0 }}>Mencegah titip absen antar karyawan.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: `1px solid ${THEME.border}`, borderRadius: 20, padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={24} color={THEME.accent} />
            </div>
            <div>
              <h3 style={{ fontFamily: fHeading, fontSize: 18, fontWeight: 800, color: THEME.secondary, margin: '0 0 4px' }}>GPS Terenkripsi</h3>
              <p style={{ fontFamily: fBody, fontSize: 14, color: THEME.muted, margin: 0 }}>Mengunci koordinat lokasi absensi secara presisi.</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 50, left: 100, display: 'flex', alignItems: 'center', gap: 12, background: THEME.secondary, padding: '12px 28px', borderRadius: 99, zIndex: 50 }}>
      <Instagram size={20} color="#fff" />
      <span style={{ fontFamily: fBody, fontWeight: 700, fontSize: 18, color: '#fff' }}>{handle}</span>
    </div>
  </Canvas>
);

const Slide3 = ({ handle }: any) => (
  <Canvas>
    <div style={{ position: 'absolute', bottom: -100, left: -100, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${THEME.primary}10 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: 0 }} />

    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 100, right: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
      
      {/* KIRI: Copywriting */}
      <div style={{ width: 460, textAlign: 'left' }}>
        
        <h1 style={{ fontFamily: fHeading, fontWeight: 900, fontSize: 80, lineHeight: 0.95, letterSpacing: '-0.04em', color: THEME.secondary, margin: '0 0 24px' }}>
          Transparansi <br />
          <span style={{ color: THEME.primary, fontStyle: 'italic' }}>Rekam Jejak</span>
        </h1>

        <p style={{ fontFamily: fBody, fontSize: 20, lineHeight: 1.6, color: THEME.muted, margin: '0 0 40px' }}>
          Pantau riwayat absensi secara lengkap, dari akumulasi total kehadiran hingga rincian waktu masuk dan keluar setiap harinya.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: `1px solid ${THEME.border}`, borderRadius: 20, padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Filter size={24} color={THEME.primary} />
            </div>
            <div>
              <h3 style={{ fontFamily: fHeading, fontSize: 18, fontWeight: 800, color: THEME.secondary, margin: '0 0 4px' }}>Filter Bulanan</h3>
              <p style={{ fontFamily: fBody, fontSize: 14, color: THEME.muted, margin: 0 }}>Cari data rekapitulasi absensi spesifik per bulan.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: `1px solid ${THEME.border}`, borderRadius: 20, padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} color={THEME.primary} />
            </div>
            <div>
              <h3 style={{ fontFamily: fHeading, fontSize: 18, fontWeight: 800, color: THEME.secondary, margin: '0 0 4px' }}>Absen Masuk dan Keluar Detail</h3>
              <p style={{ fontFamily: fBody, fontSize: 14, color: THEME.muted, margin: 0 }}>Catatan waktu kedatangan dan kepulangan akurat.</p>
            </div>
          </div>
        </div>

      </div>

      {/* KANAN: Phone Mockup (Riwayat) */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: -40, borderRadius: '50%', border: `1px dashed ${THEME.border}`, transform: 'rotate(10deg)' }} />
        
        <PhoneFrame>
          <HistoryContentMock />
        </PhoneFrame>
      </div>

    </div>

    <div style={{ position: 'absolute', bottom: 50, left: 100, display: 'flex', alignItems: 'center', gap: 12, background: THEME.secondary, padding: '12px 28px', borderRadius: 99, zIndex: 50 }}>
      <Instagram size={20} color="#fff" />
      <span style={{ fontFamily: fBody, fontWeight: 700, fontSize: 18, color: '#fff' }}>{handle}</span>
    </div>
  </Canvas>
);

// ─── NEW: SLIDE 4 (SHOWCASE 3 MOCKUPS) ──────────────────────────────────────
const Slide4 = ({ handle }: any) => (
  <Canvas bg="#0f172a" gridOpacity={0.05}>
    {/* Dekorasi Background Gelap Elegan */}
    <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, ${THEME.primary}30 0%, transparent 60%)`, filter: 'blur(80px)', zIndex: 0 }} />
    <div style={{ position: 'absolute', bottom: -200, left: '20%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${THEME.accent}20 0%, transparent 60%)`, filter: 'blur(80px)', zIndex: 0 }} />

    {/* ─── TYPOGRAPHY SECTION (Diperbarui) ─── */}
    <div style={{ position: 'absolute', top: 125, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, padding: '0 40px' }}>

      {/* Main Title */}
      <h1 style={{ fontFamily: fHeading, fontWeight: 800, fontSize: 84, lineHeight: 1, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 0px' }}>
        Attendance System
      </h1>
      
      {/* Sub-Title Highlight */}
      <h2 style={{ fontFamily: fHeading, fontWeight: 500, fontSize: 36, lineHeight: 1.2, letterSpacing: '-0.02em', color: THEME.primary, margin: '0 0 28px', fontStyle: 'italic' }}>
        Face Recognition & Real-time Location
      </h2>

      {/* Deskripsi Pendukung */}
      <p style={{ fontFamily: fBody, fontSize: 20, lineHeight: 1.6, color: '#94a3b8', maxWidth: 680, margin: 0 }}>
        Solusi absensi cerdas yang mengintegrasikan validasi biometrik dan pemetaan koordinat presisi untuk produktivitas maksimal.
      </p>

    </div>

    {/* Komposisi 3 HP (Isometrik/Bertumpuk) */}
    <div style={{ position: 'absolute', bottom: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 20 }}>
      
      {/* HP Kiri (Kamera/Slide 2) */}
      <div style={{ position: 'relative', zIndex: 1, transform: 'translateX(140px) translateY(60px)' }}>
        <PhoneFrame scale={0.8} rotation={-12} shadowX={-30}>
          <CameraLocationMock />
        </PhoneFrame>
      </div>

      {/* HP Tengah (Dashboard/Slide 1) - FOKUS UTAMA */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <PhoneFrame scale={1} rotation={0} shadowX={0}>
          <AppContentMock />
        </PhoneFrame>
      </div>

      {/* HP Kanan (Riwayat/Slide 3) */}
      <div style={{ position: 'relative', zIndex: 2, transform: 'translateX(-140px) translateY(60px)' }}>
        <PhoneFrame scale={0.8} rotation={12} shadowX={30}>
          <HistoryContentMock />
        </PhoneFrame>
      </div>

    </div>

    {/* Footer IG Handle Gelap */}
    <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.1)', padding: '12px 28px', borderRadius: 99, zIndex: 50, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <Instagram size={20} color="#fff" />
      <span style={{ fontFamily: fBody, fontWeight: 700, fontSize: 16, color: '#fff' }}>{handle}</span>
    </div>
  </Canvas>
);

// ─── NEW: SLIDE 5 (ELEGANT FOCUS / IN-USE) ──────────────────────────────────
const Slide5 = ({ handle }: any) => (
  <Canvas bg="#020617" gridOpacity={0.02}>
    {/* Cinematic Glow Background */}
    <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, ${THEME.primary}25 0%, transparent 60%)`, filter: 'blur(100px)', zIndex: 0 }} />

    {/* Minimalist Elegant Typography */}
    <div style={{ position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
      <h2 style={{ fontFamily: fBody, fontSize: 14, fontWeight: 700, color: THEME.primary, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 16 }}>
        Seamless Experience
      </h2>
      <h1 style={{ fontFamily: fHeading, fontWeight: 800, fontSize: 72, lineHeight: 1.05, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
        Absensi di ujung <br /> jari Anda.
      </h1>
    </div>

    {/* Massive Phone (Focus) */}
    <div style={{ position: 'absolute', bottom: -200, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
      <PhoneFrame scale={1.25} rotation={0} shadowX={0}>
        <AppContentMock />
      </PhoneFrame>
      
      {/* "In-Use" Touch Indicator (Pulsing ring over the swipe button) */}
      <div style={{ 
        position: 'absolute', bottom: 250, left: '50%', transform: 'translateX(-50%)', 
        width: 80, height: 80, borderRadius: '50%', 
        background: 'rgba(255,255,255,0.1)', border: `2px solid ${THEME.primary}`, 
        zIndex: 150,
        boxShadow: `0 0 30px ${THEME.primary}`
      }}>
        {/* Inner dot */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 20, height: 20, background: THEME.primary, borderRadius: '50%', opacity: 0.8 }} />
      </div>
    </div>

    {/* Foreground Depth (Dark gradient at the bottom to ground the phone) */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 400, background: 'linear-gradient(to top, #020617 10%, transparent 100%)', zIndex: 30, pointerEvents: 'none' }} />

    {/* Subtle Minimalist Footer */}
    <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, zIndex: 50, opacity: 0.4 }}>
      <Instagram size={18} color="#fff" />
      <span style={{ fontFamily: fBody, fontWeight: 600, fontSize: 14, color: '#fff' }}>{handle}</span>
    </div>
  </Canvas>
);

// ─── MAIN EDITOR APP ────────────────────────────────────────────────────────
export default function AttendanceHeroSlide() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [igHandle, setIgHandle] = useState('@wandevp');

  // Tab State
  const SLIDES = [
    { id: 1, name: 'Slide 1 (Dashboard)' },
    { id: 2, name: 'Slide 2 (Kamera)' },
    { id: 3, name: 'Slide 3 (Riwayat)' },
    { id: 4, name: 'Slide 4 (Showcase)' },
    { id: 5, name: 'Slide 5 (Elegant)' } // <--- TAMBAHKAN INI
  ];
  const [activeSlide, setActiveSlide] = useState(1);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(canvasRef.current, { 
        backgroundColor: activeSlide === 4 ? '#0f172a' : '#f8fafc', // Sesuaikan BG download dengan slide aktif
        pixelRatio: 2, 
        cacheBust: true 
      });
      const link = document.createElement('a');
      link.download = `attendance-slide-${activeSlide}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { 
      console.error('Gagal mengunduh gambar:', err); 
    } finally { 
      setDownloading(false); 
    }
  };

  const renderSlide = () => {
    switch (activeSlide) {
      case 1: return <Slide1 handle={igHandle} />;
      case 2: return <Slide2 handle={igHandle} />;
      case 3: return <Slide3 handle={igHandle} />;
      case 4: return <Slide4 handle={igHandle} />;
      case 5: return <Slide5 handle={igHandle} />; // <--- TAMBAHKAN INI
      default: return <Slide1 handle={igHandle} />;
    }
  };

  return (
    <>
      <style>{`
        ${FONT_URL}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 99px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', flexDirection: 'column', fontFamily: fBody }}>
        
        {/* ── TOOLBAR ── */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontFamily: fBody, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 2 }}>
              Case Study Editor
            </p>
            <h1 style={{ fontFamily: fHeading, fontSize: 20, fontWeight: 800, color: '#fff' }}>
              Attendance UI Mockup
            </h1>
          </div>

          {/* TAB BUTTONS */}
          <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 14 }}>
            {SLIDES.map(slide => (
              <button 
                key={slide.id}
                onClick={() => setActiveSlide(slide.id)}
                style={{
                  padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: fBody, fontSize: 13, fontWeight: 700,
                  background: activeSlide === slide.id ? THEME.primary : 'transparent',
                  color: activeSlide === slide.id ? '#fff' : '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
              >
                {slide.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0 12px' }}>
              <Instagram size={16} color="#94a3b8" />
              <input 
                type="text" 
                value={igHandle} 
                onChange={e => setIgHandle(e.target.value)} 
                placeholder="@username"
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 13, padding: '10px 8px', outline: 'none', width: 120, fontFamily: fBody }} 
              />
            </div>
            <button 
              onClick={handleDownload} 
              disabled={downloading}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 8, background: THEME.primary, border: 'none', 
                borderRadius: 10, padding: '10px 20px', color: '#fff', fontSize: 13, fontWeight: 700, 
                cursor: downloading ? 'not-allowed' : 'pointer', opacity: downloading ? 0.7 : 1, fontFamily: fBody 
              }}
            >
              <Download size={16} />
              {downloading ? 'Mengekspor...' : `Save Slide ${activeSlide}`}
            </button>
          </div>
        </div>

        {/* ── CANVAS WRAPPER ── */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px', overflow: 'auto' }}>
          <div ref={canvasRef}>
            {renderSlide()}
          </div>
        </div>

      </div>
    </>
  );
}