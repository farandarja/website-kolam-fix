"use client";

import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tent,
  ShowerHead,
  Lock,
  UtensilsCrossed,
  Car,
  MoonStar,
} from "lucide-react";

type Facility = {
  name: string;
  icon: ReactNode;
  desc: string; // teks singkat di kartu
  detail: string; // penjelasan lengkap di jendela detail
  images: string[]; // kosong = tampil kotak "Foto segera hadir"
};

const facilities: Facility[] = [
  {
    name: "Area Bermain Anak",
    icon: <Tent className="h-5 w-5" />,
    desc: "Zona bermain khusus si kecil dengan lantai rubber yang aman dan nyaman.",
    detail:
      "Zona bermain khusus si kecil dengan konsep ala pertunjukan sirkus dan lantai rubber yang aman dan nyaman. Karena berada di dalam ruangan, anak-anak terlindung dari kepanasan dan kehujanan, jadi orang tua bisa mendampingi dengan tenang.",
    images: [
      "/images/fasilitas/bermain-anak/1.png",
      "/images/fasilitas/bermain-anak/2.png",
      "/images/fasilitas/bermain-anak/3.png",
    ],
  },
  {
    name: "Kamar Bilas",
    icon: <ShowerHead className="h-5 w-5" />,
    desc: "Bilas dan ganti pakaian dengan bersih dan nyaman setelah berenang.",
    detail:
      "Kamar bilas dan toilet yang bersih tersedia di berbagai area, memudahkan pengunjung membilas badan dan berganti pakaian setelah puas bermain air.",
    images: ["/images/fasilitas/kamar-bilas/1.png"],
  },
  {
    name: "Loker",
    icon: <Lock className="h-5 w-5" />,
    desc: "Titip barang bawaan dengan aman, jadi bermain air bisa lebih tenang.",
    detail:
      "Titip barang bawaan dan barang berharga di loker yang kami sediakan, sehingga Anda dan keluarga bisa bermain air dengan lebih tenang.",
    images: ["/images/fasilitas/loker/1.png"],
  },
  {
    name: "Food Court",
    icon: <UtensilsCrossed className="h-5 w-5" />,
    desc: "Isi tenaga setelah berenang, tersedia aneka makanan dan minuman.",
    detail:
      "Isi tenaga setelah berenang dengan aneka makanan dan minuman yang tersedia di food court. Kedai kopi juga tersedia untuk bersantai bersama keluarga.",
    images: [
      "/images/fasilitas/food-court/1.png",
      "/images/fasilitas/food-court/2.png",
    ],
  },
  {
    name: "Area Parkir",
    icon: <Car className="h-5 w-5" />,
    desc: "Parkir kendaraan mudah, jadi datang bersama keluarga makin praktis.",
    detail:
      "Area parkir untuk kendaraan pengunjung, sehingga datang bersama keluarga terasa lebih praktis.",
    // Belum ada foto asli. Kalau sudah ada, isi misalnya:
    // images: ["/images/fasilitas/parkir/1.png", "/images/fasilitas/parkir/2.png"],
    images: [],
  },
  {
    name: "Mushola",
    icon: <MoonStar className="h-5 w-5" />,
    desc: "Tempat sholat yang bersih dan nyaman, jadi ibadah tetap tenang di sela bermain.",
    detail:
      "Tempat sholat yang bersih dan nyaman, sehingga ibadah tetap tenang di sela bermain.",
    // Belum ada foto asli. Kalau sudah ada, isi misalnya:
    // images: ["/images/fasilitas/mushola/1.png"],
    images: [],
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

/** Kotak pengganti kalau fasilitas belum punya foto. */
function NoPhoto({ icon, label }: { icon: ReactNode; label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-200 to-sky-100 text-primary/50 [&>svg]:h-14 [&>svg]:w-14">
      {icon}
      {label && (
        <span className="text-sm font-semibold text-[#132447]/60">{label}</span>
      )}
    </div>
  );
}

/** Slider foto di jendela detail: bisa di-swipe, ada titik penanda. */
function PhotoSlider({ facility }: { facility: Facility }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (facility.images.length === 0) {
    return (
      <div className="aspect-[16/10] w-full">
        <NoPhoto icon={facility.icon} label="Foto segera hadir" />
      </div>
    );
  }

  const many = facility.images.length > 1;

  return (
    <div className="relative">
      <Carousel setApi={setApi} opts={{ loop: many }}>
        <CarouselContent className="ml-0">
          {facility.images.map((src, i) => (
            <CarouselItem key={src} className="pl-0">
              <div className="relative aspect-[16/10] w-full bg-secondary">
                <Image
                  src={src}
                  alt={`${facility.name} ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 672px, 100vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {many && (
          <>
            <CarouselPrevious className="left-3 border-0 bg-white/90 shadow-md" />
            <CarouselNext className="right-3 border-0 bg-white/90 shadow-md" />
          </>
        )}
      </Carousel>

      {many && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {facility.images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Foto ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-2 rounded-full shadow transition-all ${
                i === current ? "w-5 bg-white" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FasilitasPage() {
  const [selected, setSelected] = useState<Facility | null>(null);
  const others = selected
    ? facilities.filter((f) => f.name !== selected.name)
    : [];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-extrabold text-[#132447] md:text-5xl">
            Fasilitas Kami
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Semua yang Anda butuhkan agar liburan keluarga seru dan nyaman. Pilih
            fasilitas untuk melihat foto dan penjelasannya.
          </p>
        </div>

        {/* FASILITAS PENDUKUNG */}
        <section id="fasilitas-pendukung">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => setSelected(f)}
                className="group overflow-hidden rounded-3xl bg-white text-left shadow-md transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {f.images[0] ? (
                      <Image
                        src={f.images[0]}
                        alt={f.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <NoPhoto icon={f.icon} />
                    )}
                  </div>
                  <span className="absolute -bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-md">
                    {f.icon}
                  </span>
                </div>

                <div className="px-5 pb-6 pt-9">
                  <h3 className="font-headline text-lg font-bold text-[#132447]">
                    {f.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary transition-all group-hover:gap-2">
                    Lihat Detail <span aria-hidden="true">→</span>
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-[#132447]/70">
              Juga tersedia:
            </span>
            {MORE_FACILITIES.map((name) => (
              <span
                key={name}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#132447] shadow-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* DETAIL FASILITAS */}
        <Dialog
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
        >
          <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-3xl p-0 [&>button]:z-10 [&>button]:rounded-full [&>button]:bg-black/50 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100">
            {selected && (
              <div className="max-h-[90vh] overflow-y-auto">
                <PhotoSlider key={selected.name} facility={selected} />

                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                      {selected.icon}
                    </span>
                    <div>
                      <DialogTitle className="font-headline text-2xl font-extrabold text-[#132447]">
                        {selected.name}
                      </DialogTitle>
                      <DialogDescription className="mt-2 text-base leading-relaxed text-muted-foreground">
                        {selected.detail}
                      </DialogDescription>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#132447]/10 pt-5">
                    <p className="text-sm font-bold text-[#132447]">
                      Fasilitas lainnya
                    </p>
                    <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {others.map((o) => (
                        <button
                          key={o.name}
                          type="button"
                          onClick={() => setSelected(o)}
                          className="flex shrink-0 items-center gap-3 rounded-2xl bg-secondary/60 py-2 pl-2 pr-4 text-left transition-colors hover:bg-secondary"
                        >
                          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white text-primary">
                            {o.images[0] ? (
                              <Image
                                src={o.images[0]}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center">
                                {o.icon}
                              </span>
                            )}
                          </span>
                          <span className="text-sm font-semibold text-[#132447]">
                            {o.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}