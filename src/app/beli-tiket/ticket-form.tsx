"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CalendarIcon, User, Mail, Phone, Minus, Plus } from "lucide-react";
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
import { formatRupiah, getTicketTier, MAX_GUESTS } from "@/lib/ticket-pricing";

const formSchema = z.object({
  visitDate: z.date({
    required_error: "Tanggal kunjungan harus diisi.",
  }),
  guests: z.number().int().min(1, "Minimal 1 tamu").max(MAX_GUESTS, `Maksimal ${MAX_GUESTS} tamu`),
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
      guests: 1
    },
  });

  // harga otomatis mengikuti tanggal kunjungan
  const visitDate = form.watch("visitDate");
  const guests = form.watch("guests") || 1;
  const tier = visitDate ? getTicketTier(format(visitDate, "yyyy-MM-dd")) : null;
  const total = tier ? tier.price * guests : 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/tickets/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitDate: format(values.visitDate, "yyyy-MM-dd"),
          guests: values.guests,
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
        
        <FormField
  control={form.control}
  name="guests"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Jumlah Tamu</FormLabel>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          disabled={Number(field.value) <= 1}
          onClick={() => field.onChange(Math.max(1, (Number(field.value) || 1) - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <FormControl>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="h-11 w-20 rounded-full text-center text-lg font-bold"
            value={field.value}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              if (digits === "") {
                field.onChange(""); // boleh dikosongkan saat mengetik
                return;
              }
              field.onChange(Math.min(Number(digits), MAX_GUESTS));
            }}
            onBlur={() => {
              if (!field.value || Number(field.value) < 1) field.onChange(1);
              field.onBlur();
            }}
          />
        </FormControl>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          disabled={Number(field.value) >= MAX_GUESTS}
          onClick={() => field.onChange(Math.min(MAX_GUESTS, (Number(field.value) || 0) + 1))}
        >
          <Plus className="h-4 w-4" />
        </Button>

        <span className="text-xs text-muted-foreground">maks. {MAX_GUESTS} orang</span>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>

        {tier && visitDate && (
  <div className="rounded-2xl bg-secondary px-4 py-4 text-sm">
    <p className="font-semibold">
      {format(visitDate, "EEEE, d MMMM yyyy", { locale: id })}
    </p>
    <div className="mt-3 space-y-1 text-muted-foreground">
      <div className="flex justify-between">
        <span>Tarif {tier.days}</span>
        <span>{formatRupiah(tier.price)} / orang</span>
      </div>
      <div className="flex justify-between">
        <span>Jumlah tamu</span>
        <span>× {guests}</span>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-3">
      <span className="font-bold">Total bayar</span>
      <span className="text-xl font-extrabold text-primary">{formatRupiah(total)}</span>
    </div>
    <p className="mt-1 text-right text-xs text-muted-foreground">
      {formatRupiah(tier.price)} × {guests} = {formatRupiah(total)}
    </p>
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
              ? `Bayar Sekarang • ${formatRupiah(total)}`
              : "Bayar Sekarang"}
        </Button>
      </form>
    </Form>
  );
}
