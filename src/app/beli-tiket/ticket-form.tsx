"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CalendarIcon, User, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { formatRupiah, getTicketTier } from "@/lib/ticket-pricing";

const formSchema = z.object({
  visitDate: z.date({
    required_error: "Tanggal kunjungan harus diisi.",
  }),
  name: z.string().min(2, { message: "Nama harus memiliki minimal 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  phone: z.string().min(10, { message: "Nomor telepon minimal 10 digit." }),
});

export function TicketForm() {
  const router = useRouter();
  const { toast } = useToast();

  // ✅ kontrol popover kalender
  const [dateOpen, setDateOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // harga otomatis mengikuti tanggal kunjungan
  const visitDate = form.watch("visitDate");
  const tier = visitDate ? getTicketTier(format(visitDate, "yyyy-MM-dd")) : null;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/tickets/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitDate: format(values.visitDate, "yyyy-MM-dd"),
          name: values.name,
          email: values.email,
          phone: values.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Gagal membuat transaksi",
          description: data?.error ?? "Terjadi kesalahan",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Transaksi dibuat",
        description: "Mengarahkan ke halaman pembayaran QRIS...",
      });

      router.push(data.paymentUrl);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message ?? "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="visitDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Pilih Tanggal Kunjungan</FormLabel>

              {/* ✅ Popover controlled */}
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (!date) return;
                      field.onChange(date);
                      // ✅ auto close setelah pilih tanggal
                      setDateOpen(false);
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                    locale={id}
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        {tier && visitDate && (
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-secondary px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Harga tiket ({tier.days})</p>
              <p className="text-sm font-semibold">
                {format(visitDate, "EEEE, d MMMM yyyy", { locale: id })}
              </p>
            </div>
            <p className="text-xl font-extrabold text-primary">{formatRupiah(tier.price)}</p>
          </div>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="pl-10" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Email</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} className="pl-10" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input type="tel" placeholder="081234567890" {...field} className="pl-10" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Memproses..."
            : tier
              ? `Bayar Sekarang • ${formatRupiah(tier.price)}`
              : "Bayar Sekarang"}
        </Button>
      </form>
    </Form>
  );
}
