-- ============================================================
-- MIGRASI: Midtrans -> QRIS Mandiri (verifikasi manual admin)
-- ============================================================
-- Jalankan file ini HANYA JIKA kamu sudah punya database
-- website_kolam yang lama (pakai skema Midtrans).
-- Kalau database masih baru / belum ada isinya sama sekali,
-- cukup jalankan ulang website_kolam.sql saja, TIDAK PERLU
-- menjalankan file migrasi ini.
-- ============================================================

USE website_kolam;

ALTER TABLE payments
  DROP FOREIGN KEY fk_payments_order;

ALTER TABLE payments
  DROP COLUMN provider_ref,
  DROP COLUMN snap_token,
  DROP COLUMN redirect_url,
  DROP COLUMN midtrans_transaction_id,
  DROP COLUMN midtrans_status,
  MODIFY COLUMN method VARCHAR(50) NOT NULL DEFAULT 'QRIS',
  ADD COLUMN proof_image_url VARCHAR(255) NULL AFTER status,
  ADD COLUMN customer_note VARCHAR(255) NULL AFTER proof_image_url,
  ADD COLUMN reported_paid_at DATETIME NULL AFTER customer_note,
  ADD COLUMN verified_by VARCHAR(150) NULL AFTER reported_paid_at,
  ADD COLUMN verified_at DATETIME NULL AFTER verified_by;

ALTER TABLE payments
  ADD CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE;

-- Tandai transaksi lama yang masih PENDING di Midtrans sebagai
-- "perlu dicek manual", karena Midtrans sudah tidak dipakai lagi.
UPDATE payments SET method = 'QRIS' WHERE method = 'MIDTRANS_SNAP';
