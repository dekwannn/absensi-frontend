// hooks/useNotification.ts
"use client";

import { useEffect, useState } from "react";

export type NotifPermission = "default" | "granted" | "denied";

export function useNotification() {
  const [permission, setPermission] = useState<NotifPermission>("default");
  const [swReady, setSwReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    setPermission(Notification.permission as NotifPermission);
  }, []);

  // Daftarkan Service Worker
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then(reg => {
        console.log("[SW] Registered:", reg.scope);
        setSwReady(true);
      })
      .catch(err => console.error("[SW] Registration failed:", err));
  }, []);

  // Minta izin notifikasi
  const requestPermission = async (): Promise<NotifPermission> => {
    if (!("Notification" in window)) return "denied";
    const result = await Notification.requestPermission();
    setPermission(result as NotifPermission);
    return result as NotifPermission;
  };

  // Kirim test notifikasi sekarang
  const sendTestNotification = () => {
    if (permission !== "granted") return;
    new Notification("✅ Notifikasi Aktif!", {
      body: "Kamu akan menerima pengingat absensi sesuai jadwal.",
      icon: "/icon-192x192.png",
    });
  };

  return { permission, swReady, requestPermission, sendTestNotification };
}