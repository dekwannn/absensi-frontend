// public/sw.js
// ⚠️ File ini HARUS ada di folder /public (bukan /app atau /src)

const REMINDERS = [
  {
    hour: 6, minute: 50,
    title: "🕐 Absen Masuk Sebentar Lagi",
    body: "Absen masuk dibuka 10 menit lagi pukul 07:00. Bersiaplah!",
    tag: "checkin-open",
  },
  {
    hour: 7, minute: 50,
    title: "⚠️ Hampir Terlambat!",
    body: "Batas tepat waktu 10 menit lagi (08:00). Segera absen masuk!",
    tag: "checkin-ontime",
  },
  {
    hour: 8, minute: 50,
    title: "🚨 Absen Masuk Mau Tutup!",
    body: "Absen masuk ditutup 10 menit lagi pukul 09:00. Kesempatan terakhir!",
    tag: "checkin-close",
  },
  {
    hour: 16, minute: 20,
    title: "🏠 Waktunya Pulang Sebentar Lagi",
    body: "Absen pulang dibuka 10 menit lagi pukul 16:30.",
    tag: "checkout-open",
  },
];

const notifiedToday = new Set();

const checkAndNotify = () => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const todayStr = now.toISOString().slice(0, 10);

  REMINDERS.forEach(reminder => {
    const key = `${todayStr}-${reminder.tag}`;
    if (h === reminder.hour && m === reminder.minute && !notifiedToday.has(key)) {
      notifiedToday.add(key);
      self.registration.showNotification(reminder.title, {
        body: reminder.body,
        icon: "/icon-192x192.png",
        badge: "/icon-72x72.png",
        vibrate: [200, 100, 200, 100, 200],
        tag: reminder.tag,
        renotify: false,
        requireInteraction: false,
        data: { url: "/user/dashboard" },
      });
    }
  });
};

self.addEventListener("install", () => {
  console.log("[GeoFace SW] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("[GeoFace SW] Activated");
  event.waitUntil(self.clients.claim());
  setInterval(checkAndNotify, 30000);
  checkAndNotify();
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/user/dashboard";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            return client.navigate(targetUrl);
          }
        }
        return self.clients.openWindow(targetUrl);
      })
  );
});