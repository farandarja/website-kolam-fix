import { z } from "zod";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { ADMIN_COOKIE_NAME, isValidAdminSessionValue } from "@/lib/admin-auth";

const VerifySchema = z.object({
  action: z.enum(["approve", "reject"]),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Route ini juga sudah dilindungi middleware, tapi kita cek ulang di sini
  // sebagai lapisan keamanan kedua (defense in depth).
  const store = await cookies();
  const sessionValue = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidAdminSessionValue(sessionValue)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminUsername = sessionValue?.split(".")[0] ?? "admin";

  const { id } = await params;
  const orderId = Number(id);
  if (!orderId) {
    return Response.json({ error: "ID order tidak valid" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = VerifySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Aksi tidak valid" }, { status: 400 });
  }
  const { action } = parsed.data;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT o.id, o.status FROM orders o WHERE o.id = ? LIMIT 1 FOR UPDATE`,
      [orderId]
    );
    const order = Array.isArray(rows) ? (rows[0] as any) : null;
    if (!order) {
      await conn.rollback();
      return Response.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }
    if (order.status !== "PENDING") {
      await conn.rollback();
      return Response.json(
        { error: `Order sudah berstatus ${order.status}, tidak bisa diproses ulang.` },
        { status: 409 }
      );
    }

    if (action === "approve") {
      await conn.execute(`UPDATE orders SET status = 'PAID' WHERE id = ?`, [orderId]);
      await conn.execute(
        `UPDATE payments
         SET status = 'PAID', paid_at = NOW(), verified_by = ?, verified_at = NOW()
         WHERE order_id = ?
         ORDER BY id DESC LIMIT 1`,
        [adminUsername, orderId]
      );
    } else {
      await conn.execute(`UPDATE orders SET status = 'CANCELLED' WHERE id = ?`, [orderId]);
      await conn.execute(
        `UPDATE payments
         SET status = 'FAILED', verified_by = ?, verified_at = NOW()
         WHERE order_id = ?
         ORDER BY id DESC LIMIT 1`,
        [adminUsername, orderId]
      );
    }

    await conn.commit();
    return Response.json({ ok: true });
  } catch (err: any) {
    await conn.rollback();
    return Response.json({ error: "Server error", message: err?.message ?? "unknown" }, { status: 500 });
  } finally {
    conn.release();
  }
}
