import axios from "axios";

interface ApiErrorBody {
  detail?: unknown;
  code?: unknown;
}

/** Pesan error dari backend (`detail`), atau `fallback` bila tidak ada. */
export function getErrorDetail(err: unknown, fallback = ""): string {
  if (axios.isAxiosError<ApiErrorBody>(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string" && detail) return detail;
  }
  return fallback;
}

/** Kode error stabil dari backend (mis. "FACE_MISMATCH"), atau null. */
export function getErrorCode(err: unknown): string | null {
  if (axios.isAxiosError<ApiErrorBody>(err)) {
    const code = err.response?.data?.code;
    if (typeof code === "string") return code;
  }
  return null;
}

/** true bila request terkirim tapi server tidak menjawab (offline, server mati, CORS). */
export function isNetworkError(err: unknown): boolean {
  return axios.isAxiosError(err) && !err.response && !!err.request;
}
