/**
 * KONFIGURASI PEMBAYARAN — QRIS & Rekening Milik Sendiri
 * ========================================================
 * Website ini TIDAK memakai payment gateway pihak ketiga (Midtrans, dll)
 * supaya tidak ada biaya admin tambahan untuk pengunjung.
 *
 * Alurnya: pengunjung scan QRIS resmi milik Sirkus Waterplay (atau
 * transfer ke rekening di bawah), lalu klik "Saya Sudah Bayar" dan
 * upload bukti transfer. Admin lalu memeriksa mutasi rekening/QRIS
 * secara manual dan menekan "Verifikasi" di halaman /admin/pesanan.
 *
 * >>> WAJIB DIISI SEBELUM WEBSITE DIPAKAI SUNGGUHAN <<<
 * 1. Ganti QRIS_IMAGE_PATH dengan gambar QRIS statis asli dari bank/
 *    penyedia QRIS kamu (taruh filenya di public/images/payment/).
 * 2. Isi data rekening bank di bawah dengan data asli.
 */

export const paymentConfig = {
  // Path gambar QRIS statis milik Sirkus Waterplay sendiri.
  // TODO: ganti dengan file QRIS asli, taruh di public/images/payment/qris-sirkus.png (atau .svg)
  qrisImagePath: "/images/payment/qris-sirkus.svg",

  bank: {
    // TODO: isi dengan data rekening resmi Sirkus Waterplay
    bankName: "Nama Bank",
    accountNumber: "0000000000",
    accountHolder: "PT/CV Sirkus Waterplay",
  },

  // Nomor WhatsApp admin untuk konfirmasi manual jika pengunjung
  // mengalami kendala saat upload bukti bayar.
  // TODO: isi nomor WhatsApp admin dengan format 62xxxxxxxxxx
  adminWhatsapp: "628176988578",

  // Batas waktu bagi pengunjung untuk membayar sebelum order
  // dianggap kedaluwarsa (dalam menit). Pengecekan kedaluwarsa
  // dilakukan di halaman pembayaran & saat admin membuka daftar pesanan.
  paymentExpiryMinutes: 60,
};
