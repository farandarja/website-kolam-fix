"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

export function VerifyOrderActions({
  orderId,
  orderCode,
}: {
  orderId: number;
  orderCode: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function act(action: "approve" | "reject") {
    if (action === "reject") {
      const confirmed = window.confirm(
        `Tolak pembayaran untuk order #${orderCode}? Order akan ditandai gagal.`
      );
      if (!confirmed) return;
    }
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Gagal memproses",
          description: data?.error ?? "Terjadi kesalahan",
          variant: "destructive",
        });
        setLoading(null);
        return;
      }
      toast({
        title: action === "approve" ? "Pembayaran disetujui" : "Pembayaran ditolak",
        description: `Order #${orderCode} berhasil diperbarui.`,
      });
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message ?? "Terjadi kesalahan",
        variant: "destructive",
      });
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2 shrink-0">
      <Button
        size="sm"
        className="gap-1"
        onClick={() => act("approve")}
        disabled={loading !== null}
      >
        <Check className="h-4 w-4" />
        {loading === "approve" ? "Memproses..." : "Setujui"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="gap-1"
        onClick={() => act("reject")}
        disabled={loading !== null}
      >
        <X className="h-4 w-4" />
        {loading === "reject" ? "Memproses..." : "Tolak"}
      </Button>
    </div>
  );
}
