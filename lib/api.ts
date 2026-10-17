import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://2b5b-2001-448a-5010-216-75c6-7829-dfa8-1dbe.ngrok-free.app/api/v1";

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