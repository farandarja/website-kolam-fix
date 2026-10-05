import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderCode = searchParams.get("order")?.trim();
  if (!orderCode) {
    return Response.json({ error: "Kode order wajib diisi" }, { status: 400 });
  }

  const [rows] = await pool.query(
    `SELECT o.status, p.reported_paid_at
     FROM orders o
     LEFT JOIN payments p ON p.order_id = o.id
     WHERE o.order_code = ?
     ORDER BY p.id DESC
     LIMIT 1`,
    [orderCode]
  );
  const order = Array.isArray(rows) ? (rows[0] as any) : null;
  if (!order) {
    return Response.json({ error: "Order tidak ditemukan" }, { status: 404 });
  }

  return Response.json({
    status: order.status,
    reportedPaidAt: order.reported_paid_at,
  });
}
