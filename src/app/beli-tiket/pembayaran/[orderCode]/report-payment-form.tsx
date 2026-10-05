"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, UploadCloud } from "lucide-react";

export function ReportPaymentForm({
  orderCode,
  alreadyReported,
}: {
  orderCode: string;
  alreadyReported: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(alreadyReported);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Polling status setiap 5 detik setelah pengunjung lapor bayar,
  // supaya begitu admin verifikasi, halaman otomatis pindah ke e-tiket.
  useEffect(() => {
    if (!submitted) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tickets/status?order=${encodeURIComponent(orderCode)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "PAID" || data.status === "USED") {
          clearInterval(interval);
          router.push(`/beli-tiket/konfirmasi?order=${encodeURIComponent(orderCode)}`);
        }
      } catch {
        // diamkan saja, coba lagi di interval berikutnya
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [submitted, orderCode, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("orderCode", orderCode);
      formData.append("note", note);
      if (file) formData.append("proof", file);

      const res = await fetch("/api/tickets/report-payment", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Gagal mengirim laporan",
          description: data?.error ?? "Terjadi kesalahan",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setSubmitted(true);
      toast({
        title: "Laporan terkirim",
        description: "Terima kasih! Admin akan memverifikasi pembayaranmu secepatnya.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message ?? "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-3 py-4">
        <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto" />
        <p className="font-semibold">Laporan pembayaran sudah kami terima</p>
        <p className="text-sm text-muted-foreground">
          Admin sedang memeriksa mutasi. Halaman ini akan otomatis pindah ke e-tiket
          begitu pembayaranmu terverifikasi.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Menunggu verifikasi admin...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-medium text-center">
        Sudah scan &amp; bayar? Konfirmasi di bawah ini.
      </p>

      <div className="space-y-2">
        <Label htmlFor="proof">Bukti Transfer (opsional, tapi disarankan)</Label>
        <div
          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/40 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">
            {file ? file.name : "Klik untuk upload screenshot bukti bayar"}
          </p>
          <Input
            ref={fileInputRef}
            id="proof"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Catatan (opsional)</Label>
        <Textarea
          id="note"
          placeholder="Contoh: transfer dari BCA a.n. Budi"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Mengirim..." : "Saya Sudah Bayar"}
      </Button>
    </form>
  );
}
