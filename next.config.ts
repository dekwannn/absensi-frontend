import os from "node:os";
import type { NextConfig } from "next";

// Request ke /api/v1/* diteruskan oleh server Next.js ke backend FastAPI.
// Jadi browser (termasuk HP di jaringan yang sama) cukup menjangkau frontend saja,
// backend boleh tetap hanya mendengarkan 127.0.0.1, dan tidak perlu CORS.
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

// Mode dev Next.js menolak resource dev dari origin selain localhost, sehingga halaman
// yang dibuka lewat IP laptop atau tunnel ngrok (mis. dari HP) tampil tanpa JavaScript.
// Izinkan semua IP laptop ini dan domain ngrok; hanya berlaku untuk `next dev`.
const localIps = Object.values(os.networkInterfaces())
  .flat()
  .filter((i): i is os.NetworkInterfaceInfo => !!i && i.family === "IPv4" && !i.internal)
  .map((i) => i.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: [...localIps, "*.ngrok-free.app", "*.ngrok.app"],
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${BACKEND_URL}/api/v1/:path*` },
    ];
  },
};

export default nextConfig;
