"use client";

import { useState } from "react";

// ── SVG ICONS ────────────────────────────────────────────────────────────────
const IconFace = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 9V6a2 2 0 012-2h3M15 4h3a2 2 0 012 2v3M21 15v3a2 2 0 01-2 2h-3M9 20H6a2 2 0 01-2-2v-3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="9" cy="10" r="1.5" fill={color}/>
    <circle cx="15" cy="10" r="1.5" fill={color}/>
    <path d="M8.5 14.5s1 1.5 3.5 1.5 3.5-1.5 3.5-1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconPin = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" fill={color}/>
  </svg>
);
const IconClock = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/>
    <path d="M12 7v5l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconCheck = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconX = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconArrow = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconShield = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6L12 2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconBell = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconChart = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="12" width="4" height="9" rx="1" fill={color} opacity=".4"/>
    <rect x="10" y="6" width="4" height="15" rx="1" fill={color} opacity=".7"/>
    <rect x="17" y="2" width="4" height="19" rx="1" fill={color}/>
  </svg>
);
const IconLogIn = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconLogOut = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconCamera = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke={color} strokeWidth="1.8"/>
  </svg>
);
const IconStar = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconWifi = ({ size = 24, color = "#ef4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M1 6s5.3-4 11-4 11 4 11 4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M5 10s3.5-3 7-3 7 3 7 3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M9 14s1.5-1.5 3-1.5 3 1.5 3 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="18" r="1.5" fill={color}/>
    <line x1="2" y1="2" x2="22" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconFile = ({ size = 24, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// ── BRAND ────────────────────────────────────────────────────────────────────
function Brand({ size = "md" }) {
  const s = size === "lg" ? { icon: 52, name: 26 } : { icon: 38, name: 18 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: s.icon, height: s.icon,
        background: "linear-gradient(135deg,#2563eb,#6366f1)",
        borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <IconFace size={Math.round(s.icon * 0.52)} />
      </div>
      <span style={{
        fontFamily: "'Syne',sans-serif",
        fontSize: s.name, fontWeight: 800, color: "#fff", letterSpacing: -0.5,
      }}>
        Geo<span style={{ color: "#60a5fa" }}>Face</span>
      </span>
    </div>
  );
}

// ── SLIDE COUNTER ────────────────────────────────────────────────────────────
function Counter({ current, total }) {
  return (
    <div style={{
      position: "absolute", top: 44, right: 52,
      fontSize: 13, fontWeight: 700,
      color: "rgba(255,255,255,0.25)", letterSpacing: 1, zIndex: 10,
    }}>
      <span style={{ color: "rgba(255,255,255,0.55)" }}>{current}</span> / {total}
    </div>
  );
}

// ── BG DOTS ──────────────────────────────────────────────────────────────────
function DotsBg({ opacity = 0.1 }) {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "radial-gradient(circle,rgba(59,130,246,.13) 1.5px,transparent 1.5px)",
      backgroundSize: "28px 28px", opacity,
    }} />
  );
}

// ── PHONE MOCKUP (shared) ─────────────────────────────────────────────────────
function PhoneMockup({ children }) {
  return (
    <div style={{ position: "relative" }}>
      {/* glow */}
      <div style={{
        position: "absolute", inset: -50,
        background: "radial-gradient(ellipse at center,rgba(59,130,246,0.22) 0%,transparent 65%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        width: 280, background: "#0f172a",
        borderRadius: 44, border: "2px solid rgba(255,255,255,0.12)",
        overflow: "hidden", position: "relative",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.05)",
      }}>
        {/* notch */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 88, height: 26, background: "#0a0e1a",
          borderRadius: "0 0 18px 18px", zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <div style={{ width: 8, height: 8, background: "#1e293b", borderRadius: "50%" }} />
          <div style={{ width: 20, height: 5, background: "#1e293b", borderRadius: 4 }} />
        </div>
        <div style={{ background: "#f0f4ff", paddingTop: 30, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {children}
        </div>
        {/* home indicator */}
        <div style={{ height: 28, background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 80, height: 4, background: "#cbd5e1", borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — COVER
// ═══════════════════════════════════════════════════════════════════════════════
function Slide1() {
  return (
    <div style={{
      width: 1080, height: 1080, background: "#050919",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      <DotsBg opacity={1} />
      <div style={{ position: "absolute", top: -200, left: -150, width: 800, height: 800, background: "radial-gradient(circle,rgba(37,99,235,0.22) 0%,transparent 60%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -200, right: -100, width: 700, height: 700, background: "radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 60%)", borderRadius: "50%" }} />
      {/* grid lines */}
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.12),transparent)" }} />
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg,transparent,rgba(59,130,246,0.1),transparent)" }} />
      <Counter current="01" total="08" />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 72px" }}>
        {/* tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: 30, padding: "8px 22px", marginBottom: 44,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#60a5fa", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Sistem Absensi Modern
          </span>
        </div>

        {/* logo */}
        <div style={{
          width: 104, height: 104,
          background: "linear-gradient(135deg,#2563eb,#6366f1)",
          borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 36px",
          boxShadow: "0 0 60px rgba(59,130,246,0.4)",
        }}>
          <IconFace size={54} />
        </div>

        {/* title */}
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 96, lineHeight: 1, fontWeight: 900, color: "#fff", letterSpacing: -4, marginBottom: 14 }}>
          <span style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Geo</span>
          <span style={{ color: "#fff" }}>Face</span>
        </div>

        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: -0.5, marginBottom: 52 }}>
          Absen Wajah + Lokasi Real-time
        </div>

        {/* pills */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 60, flexWrap: "wrap" }}>
          {[
            { icon: <IconFace size={18} />, label: "Face Recognition" },
            { icon: <IconPin size={18} />, label: "GPS Verified" },
            { icon: <IconShield size={18} />, label: "Anti-Cheat" },
          ].map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 24px", borderRadius: 30,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
            }}>
              {p.icon}
              <span style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* stats */}
        <div style={{ display: "flex", alignItems: "center", gap: 44, justifyContent: "center" }}>
          {[
            { val: "99%", label: "Akurasi Wajah" },
            { val: "0.3s", label: "Verifikasi" },
            { val: "24/7", label: "Monitoring" },
          ].map((s, i) => (
            <>
              {i > 0 && <div key={`d${i}`} style={{ width: 1, height: 48, background: "rgba(255,255,255,0.08)" }} />}
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                  <span style={{ color: "#60a5fa" }}>{s.val}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 6, fontWeight: 600, letterSpacing: .5, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — PROBLEM
// ═══════════════════════════════════════════════════════════════════════════════
function Slide2() {
  const problems = [
    {
      icon: <IconFile size={24} color="#ef4444" />,
      bg: "rgba(239,68,68,0.12)",
      accent: "#ef4444",
      title: "Absensi Manual = Rawan Manipulasi",
      desc: "Titip absen ke teman, tanda tangan palsu, atau data yang tidak akurat sudah jadi budaya di banyak tempat kerja.",
    },
    {
      icon: <IconWifi size={24} color="#f59e0b" />,
      bg: "rgba(245,158,11,0.1)",
      accent: "#f59e0b",
      title: "Rekap Data Lambat & Tidak Real-time",
      desc: "HR harus rekap manual setiap bulan. Tidak ada visibilitas langsung siapa hadir dan siapa yang absen.",
    },
    {
      icon: <IconPin size={24} color="#f97316" />,
      bg: "rgba(249,115,22,0.1)",
      accent: "#f97316",
      title: "Lokasi Kerja Tidak Terverifikasi",
      desc: "Karyawan bisa absen dari mana saja tanpa ada validasi apakah mereka benar-benar berada di lokasi kerja.",
    },
  ];
  return (
    <div style={{ width: 1080, height: 1080, background: "#07060e", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: "64px 72px" }}>
      <DotsBg opacity={0.6} />
      <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, background: "radial-gradient(circle,rgba(239,68,68,0.12) 0%,transparent 60%)", borderRadius: "50%" }} />
      <Counter current="02" total="08" />

      {/* header */}
      <div style={{ position: "relative", zIndex: 10, marginBottom: 52 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Brand />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 32, height: 3, background: "#ef4444", borderRadius: 2 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", letterSpacing: 2, textTransform: "uppercase" }}>Masalah Yang Ada</span>
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 62, lineHeight: 1.05, fontWeight: 900, color: "#fff", letterSpacing: -2.5 }}>
          Sistem Lama<br /><span style={{ color: "#ef4444" }}>Sudah Tidak Cukup.</span>
        </div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", marginTop: 14, lineHeight: 1.6, fontWeight: 500 }}>
          Masalah klasik absensi konvensional yang terus berulang setiap harinya.
        </div>
      </div>

      {/* cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, flex: 1, position: "relative", zIndex: 10 }}>
        {problems.map((p, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 24, padding: "32px 28px",
            display: "flex", flexDirection: "column",
            borderTop: `3px solid ${p.accent}`,
            position: "relative",
          }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 72, fontWeight: 900, color: "rgba(255,255,255,0.03)", position: "absolute", top: 16, right: 20, lineHeight: 1 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              {p.icon}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.35, marginBottom: 12 }}>{p.title}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{p.desc}</div>
            <div style={{ marginTop: "auto", paddingTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconX size={14} color={p.accent} />
                <span style={{ fontSize: 12, color: p.accent, fontWeight: 700 }}>Belum terselesaikan</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — SOLUTION
// ═══════════════════════════════════════════════════════════════════════════════
function Slide3() {
  return (
    <div style={{ width: 1080, height: 1080, background: "#020d1f", position: "relative", overflow: "hidden", display: "flex" }}>
      <DotsBg />
      <div style={{ position: "absolute", top: -100, left: -100, width: 700, height: 700, background: "radial-gradient(circle,rgba(37,99,235,0.2) 0%,transparent 60%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -150, right: -50, width: 600, height: 600, background: "radial-gradient(circle,rgba(16,185,129,0.12) 0%,transparent 60%)", borderRadius: "50%" }} />
      <Counter current="03" total="08" />

      {/* LEFT */}
      <div style={{ width: 480, padding: "64px 0 64px 72px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <div style={{ marginBottom: 18 }}><Brand /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 32, height: 3, background: "#22c55e", borderRadius: 2 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", letterSpacing: 2, textTransform: "uppercase" }}>Solusi Kami</span>
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 58, lineHeight: 1.06, fontWeight: 900, color: "#fff", letterSpacing: -2, marginBottom: 18 }}>
          Satu App,<br /><span style={{ color: "#60a5fa" }}>Semua</span><br />Terjawab.
        </div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 36 }}>
          GeoFace menggabungkan <strong style={{ color: "rgba(255,255,255,0.7)" }}>Face Recognition AI</strong> + <strong style={{ color: "rgba(255,255,255,0.7)" }}>GPS Real-time</strong> dalam satu alur absensi yang simpel dan anti-manipulasi.
        </div>
        {[
          { icon: <IconCheck size={14} color="#22c55e" />, text: "Tidak bisa titip absen — wajah tidak bisa dipalsukan" },
          { icon: <IconCheck size={14} color="#22c55e" />, text: "Validasi lokasi otomatis saat proses absen" },
          { icon: <IconCheck size={14} color="#22c55e" />, text: "Data langsung tercatat & bisa diakses kapanpun" },
          { icon: <IconCheck size={14} color="#22c55e" />, text: "Laporan statistik kehadiran real-time untuk HR" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              {item.icon}
            </div>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontWeight: 500 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* RIGHT – phone */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <PhoneMockup>
          {/* success screen inside phone */}
          <div style={{ background: "linear-gradient(135deg,#2563eb,#6366f1)", padding: "40px 20px", textAlign: "center", minHeight: 520, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 88, height: 88, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 0 16px rgba(255,255,255,0.15)" }}>
              <IconCheck size={42} color="#22c55e" />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Absensi Berhasil</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 16 }}>Selamat Pagi! 👋</div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "12px 20px", marginBottom: 12 }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>07:52</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>Kamis, 31 Maret 2025</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
              <IconPin size={12} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>Singaraja, Bali ✓</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, maxWidth: 200 }}>
              Halo Budi Santoso, absensi masuk berhasil tercatat!
            </div>
            <div style={{ marginTop: 24, width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <IconLogIn size={16} color="#2563eb" />
                <span style={{ fontSize: 12, fontWeight: 800, color: "#1d4ed8" }}>Kembali ke Dashboard</span>
              </div>
            </div>
          </div>
        </PhoneMockup>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — FITUR: FACE RECOGNITION
// ═══════════════════════════════════════════════════════════════════════════════
function Slide4() {
  return (
    <div style={{ width: 1080, height: 1080, background: "#04111f", position: "relative", overflow: "hidden", display: "flex" }}>
      <DotsBg />
      <div style={{ position: "absolute", top: -50, right: -50, width: 700, height: 700, background: "radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 60%)", borderRadius: "50%" }} />
      <Counter current="04" total="08" />

      {/* LEFT – phone mockup: camera view */}
      <div style={{ width: 480, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10, padding: "0 0 0 60px" }}>
        <PhoneMockup>
          {/* Camera fullscreen simulation */}
          <div style={{ background: "#0f0f0f", minHeight: 520, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "20px 16px" }}>
            {/* top label */}
            <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "10px 20px", border: "1px solid rgba(255,255,255,0.15)", textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", marginBottom: 2 }}>Verifikasi Wajah</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Posisikan wajah dalam frame</div>
            </div>

            {/* frame */}
            <div style={{ width: 200, height: 250, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* corner brackets */}
              {[
                { top: -2, left: -2, borderTop: "4px solid #fff", borderLeft: "4px solid #fff", borderRadius: "3px 0 0 0" },
                { top: -2, right: -2, borderTop: "4px solid #fff", borderRight: "4px solid #fff", borderRadius: "0 3px 0 0" },
                { bottom: -2, left: -2, borderBottom: "4px solid #fff", borderLeft: "4px solid #fff", borderRadius: "0 0 0 3px" },
                { bottom: -2, right: -2, borderBottom: "4px solid #fff", borderRight: "4px solid #fff", borderRadius: "0 0 3px 0" },
              ].map((style, i) => (
                <div key={i} style={{ position: "absolute", width: 30, height: 30, ...style }} />
              ))}
              {/* face silhouette */}
              <div style={{ width: 90, height: 110, background: "rgba(255,255,255,0.06)", borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 20 }}>
                <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                  <div style={{ width: 10, height: 10, background: "#60a5fa", borderRadius: "50%", boxShadow: "0 0 8px #3b82f6" }} />
                  <div style={{ width: 10, height: 10, background: "#60a5fa", borderRadius: "50%", boxShadow: "0 0 8px #3b82f6" }} />
                </div>
              </div>
              {/* scan line */}
              <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#60a5fa,transparent)", top: "40%", opacity: 0.7 }} />
              {/* scanning dots */}
              <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i === 1 ? "#60a5fa" : "rgba(96,165,250,0.4)" }} />)}
              </div>
            </div>

            {/* bottom controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconX size={18} color="#fff" />
              </div>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px rgba(255,255,255,0.2)" }}>
                <IconCamera size={28} color="#3b82f6" />
              </div>
              <div style={{ width: 40 }} />
            </div>
          </div>
        </PhoneMockup>
      </div>

      {/* RIGHT – feature detail */}
      <div style={{ flex: 1, padding: "64px 72px 64px 48px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <div style={{ marginBottom: 16 }}><Brand /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 3, background: "#6366f1", borderRadius: 2 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", letterSpacing: 2, textTransform: "uppercase" }}>Fitur Utama 01</span>
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 56, lineHeight: 1.05, fontWeight: 900, color: "#fff", letterSpacing: -2, marginBottom: 18 }}>
          Face<br /><span style={{ color: "#818cf8" }}>Recognition</span><br />AI
        </div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, marginBottom: 36 }}>
          Kamera frontal menangkap wajah karyawan dan membandingkannya dengan database secara instan. Tidak bisa ditipu foto atau video.
        </div>

        {[
          { label: "Akurasi deteksi", val: "99.2%", color: "#6366f1" },
          { label: "Waktu proses", val: "< 0.3 detik", color: "#22c55e" },
          { label: "Anti-spoofing", val: "Aktif", color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{s.label}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.val}</span>
          </div>
        ))}

        <div style={{ marginTop: 36, display: "flex", gap: 12 }}>
          <div style={{ flex: 1, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <IconFace size={22} color="#818cf8" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Liveness Detection</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Deteksi wajah nyata vs foto</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — FITUR: GPS LOCATION
// ═══════════════════════════════════════════════════════════════════════════════
function Slide5() {
  return (
    <div style={{ width: 1080, height: 1080, background: "#031209", position: "relative", overflow: "hidden", display: "flex" }}>
      <DotsBg />
      <div style={{ position: "absolute", top: -100, left: -100, width: 700, height: 700, background: "radial-gradient(circle,rgba(16,185,129,0.14) 0%,transparent 60%)", borderRadius: "50%" }} />
      <Counter current="05" total="08" />

      {/* RIGHT – phone (check-in page) */}
      <div style={{ width: 520, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <PhoneMockup>
          {/* Check-in page */}
          <div style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)", padding: "16px 16px 0", minHeight: 100 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconArrow size={14} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Absensi Masuk</div>
              </div>
            </div>
          </div>
          {/* location card */}
          <div style={{ padding: "0 10px", marginTop: -16 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "12px 14px", border: "1px solid #bbf7d0", boxShadow: "0 4px 20px rgba(34,197,94,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, background: "#dcfce7", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconPin size={18} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontSize: 8, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Lokasi Anda</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0f172a" }}>Singaraja, Bali</div>
                <div style={{ fontSize: 9, color: "#64748b" }}>-8.1119, 115.0882 ✓ GPS Aktif</div>
              </div>
            </div>
          </div>
          {/* map visual */}
          <div style={{ margin: "10px 10px 0", background: "#e2e8f0", borderRadius: 14, height: 130, overflow: "hidden", position: "relative" }}>
            {/* fake map */}
            <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(6,1fr)", gridTemplateRows: "repeat(5,1fr)" }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} style={{ border: "0.5px solid rgba(0,0,0,0.06)", background: i % 7 === 0 ? "#f1f5f9" : i % 11 === 0 ? "#e2e8f0" : "transparent" }} />
              ))}
            </div>
            {/* roads */}
            <div style={{ position: "absolute", top: "40%", left: 0, right: 0, height: 8, background: "rgba(255,255,255,0.7)", borderTop: "1px solid rgba(0,0,0,0.08)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "45%", width: 6, background: "rgba(255,255,255,0.7)", borderLeft: "1px solid rgba(0,0,0,0.08)" }} />
            {/* pin */}
            <div style={{ position: "absolute", top: "30%", left: "43%", transform: "translate(-50%,-100%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, background: "#2563eb", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", boxShadow: "0 4px 12px rgba(37,99,235,0.5)", border: "3px solid #fff" }} />
              <div style={{ width: 50, height: 50, background: "rgba(37,99,235,0.15)", borderRadius: "50%", position: "absolute", top: -11 }} />
            </div>
            <div style={{ position: "absolute", top: 8, right: 8, background: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 9, fontWeight: 700, color: "#16a34a", border: "1px solid #bbf7d0" }}>
              ✓ Dalam jangkauan
            </div>
          </div>
          {/* radius info */}
          <div style={{ margin: "8px 10px 0", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "8px 12px", display: "flex", gap: 8, alignItems: "center" }}>
            <IconShield size={14} color="#16a34a" />
            <span style={{ fontSize: 9, fontWeight: 700, color: "#15803d" }}>Radius valid: 100m dari lokasi kantor</span>
          </div>
          <div style={{ margin: "8px 10px", background: "#3b82f6", borderRadius: 24, padding: "3px", display: "flex", alignItems: "center" }}>
            <div style={{ width: 40, height: 40, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <IconArrow size={14} color="#3b82f6" />
            </div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>Geser untuk Absen Masuk</div>
          </div>
        </PhoneMockup>
      </div>

      {/* LEFT – text */}
      <div style={{ flex: 1, padding: "64px 72px 64px 52px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <div style={{ marginBottom: 16 }}><Brand /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 3, background: "#22c55e", borderRadius: 2 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399", letterSpacing: 2, textTransform: "uppercase" }}>Fitur Utama 02</span>
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 56, lineHeight: 1.05, fontWeight: 900, color: "#fff", letterSpacing: -2, marginBottom: 18 }}>
          GPS <span style={{ color: "#34d399" }}>Real-Time</span><br />Verification
        </div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, marginBottom: 32 }}>
          Setiap absensi divalidasi koordinat GPS karyawan. Jika tidak berada dalam radius lokasi kerja, absen otomatis ditolak.
        </div>
        {[
          { icon: <IconPin size={16} color="#34d399" />, title: "Radius Zona Kerja", desc: "Bisa dikonfigurasi per lokasi, default 100m" },
          { icon: <IconShield size={16} color="#60a5fa" />, title: "Anti GPS Spoofing", desc: "Deteksi lokasi palsu secara otomatis" },
          { icon: <IconBell size={16} color="#f59e0b" />, title: "Log Lokasi Tercatat", desc: "Setiap koordinat disimpan saat absen" },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {f.icon}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — FITUR: DASHBOARD & SWIPE
// ═══════════════════════════════════════════════════════════════════════════════
function Slide6() {
  return (
    <div style={{ width: 1080, height: 1080, background: "#08060e", position: "relative", overflow: "hidden", display: "flex" }}>
      <DotsBg />
      <div style={{ position: "absolute", bottom: -100, right: -100, width: 700, height: 700, background: "radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 60%)", borderRadius: "50%" }} />
      <Counter current="06" total="08" />

      {/* LEFT – text */}
      <div style={{ width: 460, padding: "64px 0 64px 72px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <div style={{ marginBottom: 16 }}><Brand /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 3, background: "#a78bfa", borderRadius: 2 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", letterSpacing: 2, textTransform: "uppercase" }}>Fitur Utama 03</span>
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 52, lineHeight: 1.05, fontWeight: 900, color: "#fff", letterSpacing: -2, marginBottom: 18 }}>
          Dashboard<br /><span style={{ color: "#a78bfa" }}>Lengkap</span> &<br />Swipe Absen
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, marginBottom: 28 }}>
          Karyawan bisa lihat rekap kehadiran, status real-time, dan lakukan absen hanya dengan satu gestur swipe.
        </div>
        {[
          { color: "#a78bfa", label: "Kalender 7 hari dengan indikator kehadiran" },
          { color: "#60a5fa", label: "Kartu jam masuk & keluar otomatis" },
          { color: "#34d399", label: "Riwayat absensi lengkap per bulan" },
          { color: "#f59e0b", label: "Swipe button anti-klik-tidak-sengaja" },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{f.label}</span>
          </div>
        ))}
      </div>

      {/* RIGHT – phone dashboard */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <PhoneMockup>
          {/* Header */}
          <div style={{ background: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#3b82f6,#6366f1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>BS</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#0f172a" }}>Budi Santoso</div>
                <div style={{ fontSize: 9, color: "#94a3b8" }}>Karyawan</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[<IconBell size={12} color="#64748b" />, <IconLogOut size={12} color="#ef4444" />].map((ic, i) => (
                <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: i === 1 ? "#fef2f2" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>{ic}</div>
              ))}
            </div>
          </div>
          {/* Dates */}
          <div style={{ display: "flex", gap: 4, padding: "8px 10px 4px" }}>
            {[
              { day: "Sen", date: "28", hasDot: true },
              { day: "Sel", date: "29", hasDot: true },
              { day: "Rab", date: "30", hasDot: true },
              { day: "Kam", date: "31", selected: true },
              { day: "Jum", date: "01", future: true },
              { day: "Sab", date: "02", future: true },
              { day: "Min", date: "03", future: true },
            ].map((d, i) => (
              <div key={i} style={{ flex: 1, borderRadius: 10, padding: "5px 2px", textAlign: "center", background: d.selected ? "#2563eb" : "#fff", border: d.selected ? "none" : "1px solid #e2e8f0", opacity: d.future ? 0.3 : 1 }}>
                <div style={{ fontSize: 7, color: d.selected ? "rgba(255,255,255,0.6)" : "#94a3b8", fontWeight: 600 }}>{d.day}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: d.selected ? "#fff" : "#0f172a" }}>{d.date}</div>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: d.hasDot ? "#3b82f6" : "transparent", margin: "2px auto 0" }} />
              </div>
            ))}
          </div>
          {/* Cards */}
          <div style={{ padding: "6px 10px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Absensi Hari ini</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                  <div style={{ width: 18, height: 18, background: "#3b82f6", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><IconLogIn size={10} /></div>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#2563eb" }}>Absen Masuk</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>07:52</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: "#16a34a", marginTop: 2 }}>Tepat Waktu</div>
              </div>
              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                  <div style={{ width: 18, height: 18, background: "#f97316", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><IconLogOut size={10} /></div>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#ea580c" }}>Absen Keluar</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>17:03</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: "#16a34a", marginTop: 2 }}>Pulang Normal</div>
              </div>
            </div>
          </div>
          {/* status */}
          <div style={{ margin: "8px 10px 0", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "7px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <IconCheck size={12} color="#22c55e" />
            <span style={{ fontSize: 8, fontWeight: 700, color: "#15803d" }}>Absensi hari ini sudah lengkap</span>
          </div>
          {/* swipe */}
          <div style={{ margin: "8px 10px", background: "#3b82f6", borderRadius: 24, padding: "3px", display: "flex", alignItems: "center" }}>
            <div style={{ width: 40, height: 40, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconArrow size={14} color="#3b82f6" />
            </div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>Geser untuk Absen Keluar</div>
          </div>
        </PhoneMockup>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — FITUR: STATISTIK & RIWAYAT
// ═══════════════════════════════════════════════════════════════════════════════
function Slide7() {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
  const vals =   [18, 21, 20, 22, 19, 22];
  const max = 22;

  return (
    <div style={{ width: 1080, height: 1080, background: "#030d0a", position: "relative", overflow: "hidden", display: "flex" }}>
      <DotsBg />
      <div style={{ position: "absolute", top: -50, right: -100, width: 600, height: 600, background: "radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 60%)", borderRadius: "50%" }} />
      <Counter current="07" total="08" />

      {/* LEFT */}
      <div style={{ width: 460, padding: "64px 0 64px 72px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <div style={{ marginBottom: 16 }}><Brand /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 3, background: "#f59e0b", borderRadius: 2 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", letterSpacing: 2, textTransform: "uppercase" }}>Fitur Utama 04</span>
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 52, lineHeight: 1.05, fontWeight: 900, color: "#fff", letterSpacing: -2, marginBottom: 18 }}>
          Laporan &<br /><span style={{ color: "#fbbf24" }}>Statistik</span><br />Kehadiran
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, marginBottom: 32 }}>
          Karyawan punya dashboard riwayat lengkap. Admin bisa monitor seluruh kehadiran tim secara real-time.
        </div>

        {/* stat boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { val: "22", label: "Hari Hadir", unit: "hari", color: "#60a5fa" },
            { val: "91%", label: "Tepat Waktu", unit: "", color: "#34d399" },
            { val: "20", label: "Absen Lengkap", unit: "hari", color: "#a78bfa" },
            { val: "2", label: "Terlambat", unit: "hari", color: "#f87171" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 16px" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}> {s.unit}</span></div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 6, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT – phone riwayat */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <PhoneMockup>
          {/* header */}
          <div style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)", padding: "16px 14px 56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 26, height: 26, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconArrow size={12} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Riwayat Absensi</div>
                <div style={{ fontSize: 9, color: "#93c5fd" }}>Budi Santoso</div>
              </div>
            </div>
            {/* month filter */}
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 9, color: "#93c5fd", fontWeight: 700 }}>Pilih Bulan</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", marginLeft: "auto" }}>Maret 2025</span>
            </div>
          </div>
          {/* summary card */}
          <div style={{ margin: "-28px 10px 0", background: "#fff", borderRadius: 20, padding: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", position: "relative", zIndex: 5 }}>
            {/* ring + stats */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {/* ring */}
              <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" width={60} height={60} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3.5"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray="91 100" strokeLinecap="round"/>
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#0f172a" }}>91%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>Absen Lengkap</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#0f172a" }}>22 hari hadir</div>
              </div>
            </div>
            {/* bars */}
            <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 40 }}>
              {vals.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ width: "100%", height: `${(v / max) * 36}px`, background: i === 5 ? "#3b82f6" : "#e2e8f0", borderRadius: "3px 3px 0 0" }} />
                  <div style={{ fontSize: 7, color: "#94a3b8", fontWeight: 600 }}>{months[i]}</div>
                </div>
              ))}
            </div>
          </div>
          {/* list */}
          <div style={{ padding: "10px 10px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Log Absensi</div>
            {[
              { date: "Rab, 30 Mar", badge: "Tepat Waktu", badgeColor: "#dcfce7", badgeText: "#15803d", in: "07:48", out: "17:01", ok: true },
              { date: "Sel, 29 Mar", badge: "Terlambat", badgeColor: "#fee2e2", badgeText: "#dc2626", in: "08:24", out: "17:05", ok: true },
              { date: "Sen, 28 Mar", badge: "Tepat Waktu", badgeColor: "#dcfce7", badgeText: "#15803d", in: "07:55", out: "17:00", ok: true },
            ].map((r, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "8px", marginBottom: 5, display: "flex", alignItems: "center", gap: 6, borderLeft: `3px solid ${r.badge === "Terlambat" ? "#ef4444" : "#3b82f6"}` }}>
                <div style={{ minWidth: 52 }}>
                  <div style={{ fontSize: 8, fontWeight: 800, color: "#334155" }}>{r.date}</div>
                  <span style={{ fontSize: 7, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: r.badgeColor, color: r.badgeText }}>{r.badge}</span>
                </div>
                <div style={{ width: 1, height: 24, background: "#f1f5f9" }} />
                {[{ label: "Masuk", val: r.in, color: "#3b82f6" }, { label: "Keluar", val: r.out, color: "#f97316" }].map((t, ti) => (
                  <div key={ti} style={{ flex: 1, display: "flex", alignItems: "center", gap: 3 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 5, background: ti === 0 ? "#eff6ff" : "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {ti === 0 ? <IconLogIn size={8} color={t.color} /> : <IconLogOut size={8} color={t.color} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 7, color: "#94a3b8" }}>{t.label}</div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#0f172a" }}>{t.val}</div>
                    </div>
                  </div>
                ))}
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconCheck size={10} color="#15803d" />
                </div>
              </div>
            ))}
          </div>
        </PhoneMockup>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — CTA
// ═══════════════════════════════════════════════════════════════════════════════
function Slide8() {
  return (
    <div style={{ width: 1080, height: 1080, background: "#050919", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <DotsBg />
      <div style={{ position: "absolute", top: -200, left: -150, width: 800, height: 800, background: "radial-gradient(circle,rgba(37,99,235,0.22) 0%,transparent 60%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -200, right: -100, width: 700, height: 700, background: "radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 60%)", borderRadius: "50%" }} />
      <Counter current="08" total="08" />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 88px" }}>
        {/* stars */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 28 }}>
          {[0,1,2,3,4].map(i => <IconStar key={i} size={24} color="#fbbf24" />)}
        </div>

        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 72, lineHeight: 1.02, fontWeight: 900, color: "#fff", letterSpacing: -3, marginBottom: 20 }}>
          Siap Upgrade<br />Sistem Absensi<br />
          <span style={{ background: "linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Kantor Kamu?</span>
        </div>

        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 52, maxWidth: 640, margin: "0 auto 52px" }}>
          GeoFace siap diimplementasikan untuk perusahaan kamu. Tidak perlu hardware tambahan — cukup smartphone dan koneksi internet.
        </div>

        {/* feature recap */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 56 }}>
          {[
            { icon: <IconFace size={22} />, label: "Face Recognition" },
            { icon: <IconPin size={22} />, label: "GPS Real-Time" },
            { icon: <IconChart size={22} />, label: "Statistik Lengkap" },
            { icon: <IconBell size={22} />, label: "Notifikasi Pintar" },
          ].map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "22px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 48, height: 48, background: "rgba(59,130,246,0.15)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{f.icon}</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ background: "linear-gradient(135deg,#2563eb,#6366f1)", borderRadius: 20, padding: "18px 48px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 0 40px rgba(59,130,246,0.35)" }}>
            <IconArrow size={22} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>Hubungi Kami Sekarang</span>
          </div>
        </div>

        {/* brand footer */}
        <div style={{ marginTop: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.07)" }} />
          <Brand size="md" />
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.07)" }} />
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>
          Face Recognition · GPS Verification · Real-time Attendance
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CAROUSEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const SLIDES = [
  { id: 1, label: "Cover", component: <Slide1 /> },
  { id: 2, label: "Problem", component: <Slide2 /> },
  { id: 3, label: "Solusi", component: <Slide3 /> },
  { id: 4, label: "Face Recognition", component: <Slide4 /> },
  { id: 5, label: "GPS", component: <Slide5 /> },
  { id: 6, label: "Dashboard", component: <Slide6 /> },
  { id: 7, label: "Statistik", component: <Slide7 /> },
  { id: 8, label: "CTA", component: <Slide8 /> },
];

export default function GeoFaceCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => Math.max(0, i - 1));
  const next = () => setCurrent(i => Math.min(SLIDES.length - 1, i + 1));

  return (
    <div style={{ background: "#06091a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px 60px", gap: 24, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* STICKY CONTROLS */}
      <div style={{
        position: "sticky", top: 16, zIndex: 100,
        background: "rgba(6,9,26,0.9)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24,
        padding: "10px 20px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <button onClick={prev} disabled={current === 0} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", cursor: current === 0 ? "not-allowed" : "pointer", opacity: current === 0 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>‹</button>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {SLIDES.map((s, i) => (
            <div key={i} onClick={() => setCurrent(i)} style={{ height: 8, width: i === current ? 24 : 8, borderRadius: 4, background: i === current ? "#3b82f6" : "rgba(255,255,255,0.2)", cursor: "pointer", transition: "all .3s" }} />
          ))}
        </div>

        <button onClick={next} disabled={current === SLIDES.length - 1} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", cursor: current === SLIDES.length - 1 ? "not-allowed" : "pointer", opacity: current === SLIDES.length - 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>›</button>

        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 600, minWidth: 120, textAlign: "center" }}>
          {String(current + 1).padStart(2, "0")} / {SLIDES.length} — {SLIDES[current].label}
        </span>

        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>1080 × 1080px</span>
      </div>

      {/* SLIDE TAB LABELS */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
            background: i === current ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
            border: i === current ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.07)",
            color: i === current ? "#60a5fa" : "rgba(255,255,255,0.35)",
            transition: "all .2s",
          }}>
            {String(i + 1).padStart(2,"0")} {s.label}
          </button>
        ))}
      </div>

      {/* ACTIVE SLIDE */}
      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
        {SLIDES[current].component}
      </div>

      {/* HINT */}
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.7 }}>
        Klik label slide atau gunakan tombol ‹ › untuk navigasi<br/>
        Screenshot tiap slide untuk upload ke Instagram Carousel
      </div>
    </div>
  );
}