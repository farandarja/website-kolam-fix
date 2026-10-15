/**
 * Sumber tunggal harga tiket. Ubah harga / hari HANYA di file ini:
 * dipakai oleh form beli tiket, halaman harga, dan API pembelian.
 */

export type TicketTierCode = "Weekdays" | "Jumat" | "Weekends";

export type TicketTier = {
  code: TicketTierCode; // harus sama dengan kolom `code` di tabel ticket_types
  listLabel: string; // label di kartu "Harga Tiket Masuk"
  days: string;
  price: number;
};

export const TICKET_TIERS: Record<TicketTierCode, TicketTier> = {
  Weekdays: { code: "Weekdays", listLabel: "Weekdays (Senin-Kamis)", days: "Senin-Kamis", price: 30000 },
  Jumat: { code: "Jumat", listLabel: "Jumat", days: "Jumat", price: 20000 },
  Weekends: { code: "Weekends", listLabel: "Weekends (Sabtu-Minggu)", days: "Sabtu-Minggu", price: 40000 },
};

/**
 * Tanggal libur nasional / libur sekolah (format "YYYY-MM-DD") yang memakai
 * harga Weekends walaupun jatuh di hari kerja. Contoh: "2026-12-25".
 */
export const HOLIDAY_DATES: string[] = [];

export const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Tentukan tarif dari tanggal "YYYY-MM-DD" (tanpa pengaruh zona waktu). */
export function getTicketTier(dateOnly: string): TicketTier {
  if (!DATE_ONLY_REGEX.test(dateOnly)) throw new Error("Format tanggal tidak valid");
  const d = new Date(`${dateOnly}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== dateOnly) {
    throw new Error("Tanggal tidak valid");
  }
  if (HOLIDAY_DATES.includes(dateOnly)) return TICKET_TIERS.Weekends;
  const day = d.getUTCDay(); // 0 = Minggu ... 6 = Sabtu
  if (day === 5) return TICKET_TIERS.Jumat;
  if (day === 0 || day === 6) return TICKET_TIERS.Weekends;
  return TICKET_TIERS.Weekdays;
}

/** Tanggal hari ini di WIB, format "YYYY-MM-DD". */
export function todayInJakarta(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

export function formatRupiah(amount: number): string {
  return "Rp " + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
