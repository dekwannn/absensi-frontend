import axios from "axios";

// Default "/api/v1": lewat proxy Next.js (lihat rewrites di next.config.ts),
// jadi bisa dibuka dari laptop maupun HP di jaringan yang sama.
// Isi NEXT_PUBLIC_API_URL dengan URL lengkap hanya bila ingin memanggil backend langsung.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true', 
  }
});

// Otomatis sisipkan token di setiap request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure ngrok header is always present
    config.headers['ngrok-skip-browser-warning'] = 'true';
  }
  return config;
});

// Kalau 401 → otomatis logout & redirect ke login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);