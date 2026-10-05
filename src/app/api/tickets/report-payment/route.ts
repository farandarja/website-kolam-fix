import { randomBytes } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import pool from "@/lib/db";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const orderCode = String(formData.get("orderCode") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim().slice(0, 255);
    const proofFile = formData.get("proof") as File | null;

    if (!orderCode) {
      return Response.json({ error: "Kode order wajib diisi" }, { status: 400 });
    }

    const [rows] = await pool.query(
      `SELECT o.id, o.status FROM orders o WHERE o.order_code = ? LIMIT 1`,
      [orderCode]
    );
    const order = Array.isArray(rows) ? (rows[0] as any) : null;
    if (!order) {
      return Response.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }
    if (order.status !== "PENDING") {
      return Response.json(
        { error: `Order ini sudah berstatus ${order.status}, tidak perlu lapor bayar lagi.` },
        { status: 409 }
      );
    }

    let proofImageUrl: string | null = null;

    if (proofFile && proofFile.size > 0) {
      if (!ALLOWED_TYPES.includes(proofFile.type)) {
        return Response.json(
          { error: "Format bukti bayar harus gambar (PNG/JPG/WEBP)" },
          { status: 400 }
        );
      }
      if (proofFile.size > MAX_FILE_SIZE) {
        return Response.json({ error: "Ukuran gambar maksimal 5MB" }, { status: 400 });
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads", "bukti-bayar");
      await mkdir(uploadDir, { recursive: true });

      const ext = proofFile.type === "image/png" ? "png" : proofFile.type === "image/webp" ? "webp" : "jpg";
      const fileName = `${orderCode}-${randomBytes(6).toString("hex")}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      const buffer = Buffer.from(await proofFile.arrayBuffer());
      await writeFile(filePath, buffer);

      proofImageUrl = `/uploads/bukti-bayar/${fileName}`;
    }

    await pool.execute(
      `UPDATE payments
       SET proof_image_url = COALESCE(?, proof_image_url),
           customer_note = ?,
           reported_paid_at = NOW()
       WHERE order_id = ?
       ORDER BY id DESC LIMIT 1`,
      [proofImageUrl, note || null, order.id]
    );

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error("REPORT PAYMENT ERROR:", err);
    return Response.json({ error: "Server error", message: err?.message ?? "unknown" }, { status: 500 });
  }
}
