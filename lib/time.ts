// Semua tanggal & jam absensi mengikuti zona waktu kantor (WITA, UTC+8),
// sama seperti backend — bukan zona waktu HP/laptop pengguna.
export const OFFICE_TZ = "Asia/Makassar";

const partsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: OFFICE_TZ,
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

function witaParts(date: Date) {
  const parts = partsFormatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value ?? "00";
  return { year: get("year"), month: get("month"), day: get("day"), hour: Number(get("hour")), minute: Number(get("minute")) };
}

/** Tanggal hari ini (WITA) dalam format YYYY-MM-DD — sama dengan field `date` dari backend. */
export function witaDateStr(date: Date = new Date()): string {
  const { year, month, day } = witaParts(date);
  return `${year}-${month}-${day}`;
}

/** Bulan ini (WITA) dalam format YYYY-MM. */
export function witaMonthStr(date: Date = new Date()): string {
  return witaDateStr(date).slice(0, 7);
}

/** Menit sejak tengah malam WITA, untuk dibandingkan dengan jadwal "HH:MM". */
export function witaMinutesNow(date: Date = new Date()): number {
  const { hour, minute } = witaParts(date);
  return hour * 60 + minute;
}

export function hmToMinutes(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

// "YYYY-MM-DD" diperlakukan sebagai tanggal kalender murni (tengah hari UTC),
// supaya tidak bergeser hari di zona waktu mana pun.
const calendarDate = (dateStr: string) => new Date(`${dateStr.slice(0, 10)}T12:00:00Z`);

/** Geser tanggal "YYYY-MM-DD" sebanyak `days` hari. */
export function shiftDateStr(dateStr: string, days: number): string {
  const d = calendarDate(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = Minggu … 6 = Sabtu */
export function weekdayOf(dateStr: string): number {
  return calendarDate(dateStr).getUTCDay();
}

/** Format tanggal kalender "YYYY-MM-DD" (atau "YYYY-MM-01") dalam bahasa Indonesia. */
export function formatDate(dateStr: string, options: Intl.DateTimeFormatOptions): string {
  return calendarDate(dateStr).toLocaleDateString("id-ID", { ...options, timeZone: "UTC" });
}

/** Format jam dari timestamp ISO (mis. check_in) dalam WITA. */
export function formatTime(iso?: string | null, fallback = "--:--", withSeconds = false): string {
  if (!iso) return fallback;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit", ...(withSeconds && { second: "2-digit" }), timeZone: OFFICE_TZ,
  });
}

/** Format tanggal dari objek Date (mis. jam dinding) dalam WITA. */
export function formatNowDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString("id-ID", { ...options, timeZone: OFFICE_TZ });
}
