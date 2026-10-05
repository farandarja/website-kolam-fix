import { z } from "zod";
import { randomBytes } from "crypto";
import pool from "@/lib/db";

const PurchaseSchema = z.object({
  ticketType: z.enum(["Weekdays", "Weekends"]),
  visitDate: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

function makeOrderCode() {
  return "WP" + randomBytes(5).toString("hex").toUpperCase();
}

function toDateOnlyString(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new Error("visitDate tidak valid");
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = PurchaseSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Validasi gagal", details: parsed.error.flatten() }, { status: 400 });
    }

    const { ticketType, visitDate, name, email, phone } = parsed.data;

    // ambil harga ticket dari DB
    const [rows] = await pool.query(
      "SELECT id, code, name, price FROM ticket_types WHERE code = ? LIMIT 1",
      [ticketType]
    );
    const ticket = Array.isArray(rows) ? (rows[0] as any) : null;
    if (!ticket) return Response.json({ error: "Jenis tiket tidak ditemukan" }, { status: 404 });

    const orderCode = makeOrderCode();
    const visitDateOnly = toDateOnlyString(visitDate);
    const totalAmount = Number(ticket.price);

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
         VALUES (?, ?, 1, ?, ?)`,
        [orderId, ticket.id, totalAmount, totalAmount]
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
