"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Tent,
  ShowerHead,
  Lock,
  UtensilsCrossed,
  Car,
  MoonStar,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Facility = {
  name: string;
  desc: string;
  images: string[];
  icon: ReactNode;
};

const facilities: Facility[] = [
  {
    name: "Area Bermain Anak",
    desc: "Zona bermain khusus si kecil dengan lantai rubber yang aman dan nyaman.",
    images: [
      "/images/fasilitas/bermain-anak/1.png",
      "/images/fasilitas/bermain-anak/2.png",
      "/images/fasilitas/bermain-anak/3.png",
    ],
    icon: <Tent className="h-5 w-5" />,
  },
  {
    name: "Kamar Bilas",
    desc: "Bilas dan ganti pakaian dengan bersih dan nyaman setelah berenang.",
    images: ["/images/fasilitas/kamar-bilas/1.png"],
    icon: <ShowerHead className="h-5 w-5" />,
  },
  {
    name: "Loker",
    desc: "Titip barang bawaan dengan aman, jadi bermain air bisa lebih tenang.",
    images: ["/images/fasilitas/loker/1.png"],
    icon: <Lock className="h-5 w-5" />,
  },
  {
    name: "Food Court",
    desc: "Isi tenaga setelah berenang, tersedia aneka makanan dan minuman.",
    images: [
      "/images/fasilitas/food-court/1.png",
      "/images/fasilitas/food-court/2.png",
    ],
    icon: <UtensilsCrossed className="h-5 w-5" />,
  },
  {
    name: "Area Parkir",
    desc: "Parkir kendaraan mudah, jadi datang bersama keluarga makin praktis.",
    // Belum ada foto asli. Kalau sudah ada, isi misalnya:
    // images: ["/images/fasilitas/parkir/1.png"],
    images: [],
    icon: <Car className="h-5 w-5" />,
  },
  {
    name: "Mushola",
    desc: "Tempat sholat yang bersih dan nyaman, jadi ibadah tetap tenang di sela bermain.",
    // Belum ada foto asli. Kalau sudah ada, isi misalnya:
    // images: ["/images/fasilitas/mushola/1.png"],
    images: [],
    icon: <MoonStar className="h-5 w-5" />,
  },
];

// Fasilitas lain yang belum punya kartu sendiri. Ubah/tambah sesuai kenyataan.
const MORE_FACILITIES = [
  "Sauna",
  "Baby Spa",
  "Pijat Refleksi",
  "Salon Muslimah",
  "Kedai Kopi",
];

export function FacilityCards() {
  const [selected, setSelected] = useState<Facility | null>(null);
  const [index, setIndex] = useState(0);

  const open = (f: Facility) => {
    setIndex(0);
    setSelected(f);
  };

  useEffect(() => {
    if (!selected) return;
    const count = selected.images.length;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (count > 1 && e.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (count > 1 && e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + count) % count);
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  const count = selected?.images.length ?? 0;

  return (
    <>
      <div className="flex flex-wrap justify-center gap-5">
        {facilities.map((f) => (
          <button
            key={f.name}
            type="button"
            onClick={() => open(f)}
            className="group w-[calc(50%-0.625rem)] overflow-hidden rounded-3xl bg-white text-left shadow-md transition duration-300 hover:-translate-y-1.5 hover:shadow-xl md:w-[calc(33.333%-0.85rem)]"
          >
            <div className="relative">
              <div className="relative h-28 w-full overflow-hidden sm:h-36 lg:h-44">
                {f.images[0] ? (
                  <Image
                    src={f.images[0]}
                    alt={f.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-200 to-sky-100 text-primary/40 [&>svg]:h-14 [&>svg]:w-14">
                    {f.icon}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-5 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-md">
                {f.icon}
              </span>
            </div>

            <div className="px-4 pb-5 pt-8">
              <h3 className="font-headline text-base font-bold text-[#132447]">
                {f.name}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
                {f.desc}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary transition-all group-hover:gap-2">
                {f.images.length > 0 ? "Lihat foto" : "Lihat detail"}{" "}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm font-semibold text-[#132447]/70">
          Juga tersedia:
        </span>
        {MORE_FACILITIES.map((name) => (
          <span
            key={name}
            className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#132447] shadow-sm"
          >
            {name}
          </span>
        ))}
      </div>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#132447] shadow-md transition-colors hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[16/9] w-full bg-slate-100">
              {count > 0 ? (
                <Image
                  key={selected.images[index]}
                  src={selected.images[index]}
                  alt={`${selected.name} ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-sky-200 to-sky-100 text-primary/50 [&>svg]:h-16 [&>svg]:w-16">
                  {selected.icon}
                  <span className="text-sm font-semibold text-[#132447]/60">
                    Foto segera hadir
                  </span>
                </div>
              )}

              {count > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Foto sebelumnya"
                    onClick={() => setIndex((i) => (i - 1 + count) % count)}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#132447] shadow-md transition-transform hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Foto berikutnya"
                    onClick={() => setIndex((i) => (i + 1) % count)}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#132447] shadow-md transition-transform hover:scale-110"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {selected.images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Foto ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={`h-2 rounded-full transition-all ${
                          i === index ? "w-5 bg-white" : "w-2 bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-start gap-4 p-5 md:p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                {selected.icon}
              </span>
              <div className="flex-1">
                <h3 className="font-headline text-xl font-bold text-[#132447]">
                  {selected.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {selected.desc}
                </p>
              </div>
              <Link
                href="/fasilitas"
                className="hidden shrink-0 self-center text-sm font-bold text-primary hover:underline sm:block"
              >
                Semua fasilitas →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}