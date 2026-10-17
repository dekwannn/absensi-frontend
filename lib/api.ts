import axios from "axios";

// Atur alamat backend lewat NEXT_PUBLIC_API_URL (.env.local / env Vercel).
// Fallback hanya untuk development lokal.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

if (!process.env.NEXT_PUBLIC_API_URL && typeof window !== "undefined") {
  console.warn(`NEXT_PUBLIC_API_URL belum diatur, memakai ${BASE_URL}`);
}

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