import pool from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { VerifyOrderActions } from "./verify-order-actions";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  visit_date: string;
  status: string;
  total_amount: number;
  ticket_name: string;
  qty: number;
  payment_id: number | null;
  payment_status: string | null;
  proof_image_url: string | null;
  customer_note: string | null;
  reported_paid_at: string | null;
  verified_by: string | null;
  created_at: string;
};

async function getOrders(): Promise<OrderRow[]> {
  const [rows] = await pool.query(`
    SELECT
      o.id,
      o.order_code,
      o.customer_name,
      o.customer_phone,
      DATE_FORMAT(o.visit_date, '%Y-%m-%d') AS visit_date,
      o.status,
      o.total_amount,
      tt.name AS ticket_name,
      oi.qty,
      p.id AS payment_id,
      p.status AS payment_status,
      p.proof_image_url,
      p.customer_note,
      p.reported_paid_at,
      p.verified_by,
      o.created_at
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN ticket_types tt ON tt.id = oi.ticket_type_id
    LEFT JOIN payments p ON p.order_id = o.id
    ORDER BY
      (p.reported_paid_at IS NOT NULL AND o.status = 'PENDING') DESC,
      o.created_at DESC
    LIMIT 100
  `);
  return rows as OrderRow[];
}

function formatRupiah(n: number) {
  return `Rp ${Number(n).toLocaleString("id-ID")}`;
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    USED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-200 text-gray-600",
  };
  return <Badge className={map[status] ?? ""}>{status}</Badge>;
}

export default async function AdminPesananPage() {
  const orders = await getOrders();
  const needsVerification = orders.filter(
    (o) => o.status === "PENDING" && o.reported_paid_at
  );
  const others = orders.filter(
    (o) => !(o.status === "PENDING" && o.reported_paid_at)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Verifikasi Pembayaran</h1>
        <p className="text-muted-foreground text-sm">
          Daftar pesanan yang sudah melapor "Saya Sudah Bayar" dan menunggu kamu
          cek mutasi rekening/QRIS secara manual.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perlu Diverifikasi ({needsVerification.length})</CardTitle>
          <CardDescription>
            Cek bukti transfer &amp; mutasi, lalu tekan Setujui atau Tolak.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {needsVerification.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Tidak ada pesanan yang perlu diverifikasi saat ini. 🎉
            </p>
          ) : (
            <div className="space-y-4">
              {needsVerification.map((o) => (
                <div
                  key={o.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 md:items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">
                      #{o.order_code} — {o.customer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {o.qty}x {o.ticket_name} · {formatRupiah(o.total_amount)} · Tgl kunjungan{" "}
                      {o.visit_date}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      WA: {o.customer_phone} · Lapor bayar: {o.reported_paid_at}
                    </p>
                    {o.customer_note && (
                      <p className="text-sm italic text-muted-foreground">
                        Catatan: "{o.customer_note}"
                      </p>
                    )}
                    {o.proof_image_url && (
                      <a
                        href={o.proof_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2"
                      >
                        <img
                          src={o.proof_image_url}
                          alt="Bukti transfer"
                          className="h-28 rounded-md border object-cover"
                        />
                      </a>
                    )}
                  </div>
                  <VerifyOrderActions orderId={o.id} orderCode={o.order_code} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tiket</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Tgl Kunjungan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Diverifikasi Oleh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {others.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.order_code}</TableCell>
                    <TableCell>{o.customer_name}</TableCell>
                    <TableCell>
                      {o.qty}x {o.ticket_name}
                    </TableCell>
                    <TableCell>{formatRupiah(o.total_amount)}</TableCell>
                    <TableCell>{o.visit_date}</TableCell>
                    <TableCell>{statusBadge(o.status)}</TableCell>
                    <TableCell>{o.verified_by ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
