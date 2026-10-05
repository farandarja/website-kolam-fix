import Image from "next/image";

/**
 * Next.js otomatis menampilkan komponen ini saat pengunjung pindah
 * halaman (klik menu, dsb) dan konten halaman baru masih diproses
 * di server — jadi pengunjung selalu lihat sesuatu yang "bergerak",
 * bukan layar putih kosong / macet.
 */
export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <div className="relative h-20 w-20">
        <Image
          src="/images/icon.png"
          alt="Memuat"
          fill
          className="object-contain animate-bounce"
          priority
        />
      </div>
      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-primary animate-splash-dot [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-primary animate-splash-dot [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-primary animate-splash-dot [animation-delay:300ms]" />
      </div>
      <p className="text-sm text-muted-foreground font-medium">Memuat...</p>
    </div>
  );
}
