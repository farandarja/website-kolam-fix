import { z } from "zod";
import { randomBytes } from "crypto";
import pool from "@/lib/db";
import { DATE_ONLY_REGEX, getTicketTier, todayInJakarta, MAX_GUESTS } from "@/lib/ticket-pricing";

const PurchaseSchema = z.object({
  visitDate: z.string().regex(DATE_ONLY_REGEX, "Format tanggal harus YYYY-MM-DD"),
  guests: z.number().int().min(1).max(MAX_GUESTS),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

function makeOrderCode() {
  return "WP" + randomBytes(5).toString("hex").toUpperCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = PurchaseSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Validasi gagal", details: parsed.error.flatten() }, { status: 400 });
    }

    const { visitDate, guests, name, email, phone } = parsed.data;

    // tarif ditentukan SERVER dari tanggal (client tidak bisa menentukan harga)
    let tier;
    try {
      tier = getTicketTier(visitDate);
    } catch {
      return Response.json({ error: "Tanggal kunjungan tidak valid" }, { status: 400 });
    }
    if (visitDate < todayInJakarta()) {
      return Response.json({ error: "Tanggal kunjungan tidak boleh di masa lalu" }, { status: 400 });
    }

    // ambil baris jenis tiket dari DB (untuk relasi order_items)
    const [rows] = await pool.query(
      "SELECT id, code, name FROM ticket_types WHERE code = ? LIMIT 1",
      [tier.code]
    );
    const ticket = Array.isArray(rows) ? (rows[0] as any) : null;
    if (!ticket) {
      return Response.json(
        { error: `Jenis tiket "${tier.code}" belum ada di database. Jalankan migration_harga_tiket.sql.` },
        { status: 500 }
      );
    }

    const orderCode = makeOrderCode();
    const visitDateOnly = visitDate;
    const unitPrice = tier.price;
    const totalAmount = unitPrice * guests;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1) insert order PENDING (menunggu bayar QRIS mandiri, bukan Midtrans)
      const [orderRes] = await conn.execute(
        `INSERT INTO orders
          (order_code, user_id, customer_name, customer_email, customer_phone, visit_date, status, total_amount, qr_token)
         VALUES (?, NULL, ?, ?, ?, ?, 'PENDING', ?, ?)`,
        [
          orderCode,
          name,
          email,
          phone,
          visitDateOnly,
          totalAmount,
          randomBytes(24).toString("hex"), // qr_token
        ]
      );
      const orderId = (orderRes as any).insertId as number;

      // 2) insert item
      await conn.execute(
        `INSERT INTO order_items (order_id, ticket_type_id, qty, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)`,
        [orderId, ticket.id, guests, unitPrice, totalAmount]
      );

      // 3) buat baris payment PENDING — pembayaran QRIS mandiri, menunggu
      //    pengunjung upload bukti & admin verifikasi manual (lihat /admin/pesanan)
      await conn.execute(
        `INSERT INTO payments (order_id, method, amount, status)
         VALUES (?, 'QRIS', ?, 'PENDING')`,
        [orderId, totalAmount]
      );

      await conn.commit();

      return Response.json({
        ok: true,
        orderCode,
        paymentUrl: `/beli-tiket/pembayaran/${orderCode}`,
      });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("PURCHASE ERROR:", err);
    return Response.json({ error: "Server error", message: err?.message ?? "unknown" }, { status: 500 });
  }
}
