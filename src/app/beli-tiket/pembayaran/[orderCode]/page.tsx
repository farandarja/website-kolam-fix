import pool from "@/lib/db";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { paymentConfig } from "@/lib/payment-config";
import { ReportPaymentForm } from "./report-payment-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function formatRupiah(n: number) {
  return `Rp ${Number(n).toLocaleString("id-ID")}`;
}

export default async function PembayaranPage({
  params,
}: {
  params: Promise<{ orderCode: string }>;
}) {
  const { orderCode } = await params;

  const [rows] = await pool.query(
    `
    SELECT
      o.order_code,
      o.status,
      o.total_amount,
      tt.name AS ticket_name,
      oi.qty,
      p.reported_paid_at
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN ticket_types tt ON tt.id = oi.ticket_type_id
    LEFT JOIN payments p ON p.order_id = o.id
    WHERE o.order_code = ?
    ORDER BY p.id DESC
    LIMIT 1
    `,
    [orderCode]
  );

  const order = Array.isArray(rows) ? (rows[0] as any) : null;

  if (!order) {
    return (
      <div className="container mx-auto max-w-2xl py-16 px-4 text-center">
        <h1 className="text-3xl font-bold">Order tidak ditemukan</h1>
        <p className="text-muted-foreground mt-2">Kode: {orderCode}</p>
      </div>
    );
  }

  // Kalau sudah lunas / dipakai, arahkan langsung ke halaman e-tiket.
  if (order.status === "PAID" || order.status === "USED") {
    redirect(`/beli-tiket/konfirmasi?order=${encodeURIComponent(orderCode)}`);
  }

  const alreadyReported = Boolean(order.reported_paid_at);
  const totalLabel = formatRupiah(order.total_amount);

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-xl py-16 lg:py-20 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          Selesaikan Pembayaran
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          Order ID: <b>#{order.order_code}</b>
        </p>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Scan QRIS atau Transfer Bank</CardTitle>
            <CardDescription>
              {order.status === "CANCELLED"
                ? "Order ini sudah dibatalkan / ditolak. Silakan buat pesanan baru."
                : "Pembayaran diproses langsung oleh Sirkus Waterplay, tanpa pihak ketiga — tidak ada biaya admin tambahan."}
            </CardDescription>
          </CardHeader>

          {order.status !== "CANCELLED" && (
            <CardContent className="space-y-6">
              <div className="space-y-1 text-center">
                <p className="text-sm text-muted-foreground">
                  {order.qty}x {order.ticket_name}
                </p>
                <p className="text-2xl font-bold text-primary">{totalLabel}</p>
              </div>

              <div className="flex justify-center">
                <div className="border rounded-xl p-3 bg-white">
                  <Image
                    src={paymentConfig.qrisImagePath}
                    alt="QRIS Sirkus Waterplay"
                    width={240}
                    height={240}
                  />
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Bisa discan pakai GoPay, OVO, DANA, ShopeePay, atau m-banking apa saja.
              </p>

              <Separator />

              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Atau transfer manual ke:</p>
                <p className="font-semibold">
                  {paymentConfig.bank.bankName} — {paymentConfig.bank.accountNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  a.n. {paymentConfig.bank.accountHolder}
                </p>
              </div>

              <Separator />

              <ReportPaymentForm orderCode={order.order_code} alreadyReported={alreadyReported} />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
