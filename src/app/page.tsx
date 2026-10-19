'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  ShieldCheck,
  Users,
  PartyPopper,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ClipboardList,
  CreditCard,
  BadgeCheck,
  Tent,
  ShowerHead,
  Lock,
  UtensilsCrossed,
  Car,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { attractions, news } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { WaveDivider } from '@/components/layout/wave-divider';
import { TICKET_TIERS, formatRupiah } from '@/lib/ticket-pricing';

const trustBadges = [
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: 'Aman & Nyaman',
    desc: 'Kolam renang bersih dan terawat setiap hari',
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: 'Cocok untuk Semua',
    desc: 'Anak-anak, remaja hingga dewasa',
  },
  {
    icon: <PartyPopper className="h-7 w-7" />,
    title: 'Tema Sirkus Ceria',
    desc: 'Suasana penuh warna dan menyenangkan',
  },
  {
    icon: <Sparkles className="h-7 w-7" />,
    title: 'Fasilitas Lengkap',
    desc: 'Musala, loker, food court, spot foto dan banyak lagi',
  },
];

const bookingSteps = [
  {
    icon: <CalendarDays className="h-6 w-6" />,
    title: 'Pilih Tanggal',
    desc: 'Pilih tanggal kunjungan, harga menyesuaikan hari secara otomatis.',
  },
  {
    icon: <ClipboardList className="h-6 w-6" />,
    title: 'Isi Data',
    desc: 'Tentukan jumlah tamu, lalu isi nama, email, dan nomor telepon.',
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Bayar',
    desc: 'Selesaikan pembayaran dengan metode yang tersedia.',
  },
  {
    icon: <BadgeCheck className="h-6 w-6" />,
    title: 'Terima E-Tiket',
    desc: 'Tunjukkan QR e-tiket di pintu masuk, tanpa antre di loket.',
  },
];

// Taruh file logo di public/images/payment/ dengan nama sesuai `src` di bawah.
// Kalau file belum ada, otomatis tampil teks nama sebagai pengganti.
const paymentLogos = [
  { name: 'BRI', src: '/images/payment/BRI.svg' },
  { name: 'OVO', src: '/images/payment/OVO.svg' },
  { name: 'DANA', src: '/images/payment/Dana.svg' },
  { name: 'GoPay', src: '/images/payment/gopay.svg' },
  { name: 'ShopeePay', src: '/images/payment/shopeepay.svg' },
];

const facilitiesPreview = [
  { name: 'Area Bermain Anak', icon: <Tent className="h-10 w-10 md:h-12 md:w-12" /> },
  { name: 'Kamar Bilas', icon: <ShowerHead className="h-10 w-10 md:h-12 md:w-12" /> },
  { name: 'Loker', icon: <Lock className="h-10 w-10 md:h-12 md:w-12" /> },
  { name: 'Food Court', icon: <UtensilsCrossed className="h-10 w-10 md:h-12 md:w-12" /> },
  { name: 'Area Parkir', icon: <Car className="h-10 w-10 md:h-12 md:w-12" /> },
];

function PaymentLogo({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex h-14 w-24 items-center justify-center rounded-xl border border-[#132447]/10 bg-white px-3 shadow-sm">
      {failed ? (
        <span className="text-xs font-bold text-[#132447]/60">{name}</span>
      ) : (
        <Image
          src={src}
          alt={`Logo ${name}`}
          width={80}
          height={32}
          className="h-8 w-auto max-w-full object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function Home() {
  const heroImages = PlaceHolderImages.filter((img) => img.id.startsWith('hero'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const candidSwiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const heroImage = heroImages[currentIndex];
  const featuredAttractions = attractions.slice(0, 8);
  const latestNews = news.slice(0, 2);

  const candidPreview = PlaceHolderImages.filter((img) =>
    img.id.startsWith('candid-')
  ).slice(0, 8);

  return (
    <div className="flex flex-col overflow-x-clip">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFD8E4] via-[#BFE8FF] to-[#BFF3D0]">
        {/* candy stripe top border, seperti tenda sirkus */}
        <div
          className="h-3 md:h-4 w-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #FF4B7D 0 24px, #FFFFFF 24px 48px)',
          }}
        />

        {/* dekorasi balon */}
        <span className="pointer-events-none absolute left-10 top-6 hidden text-4xl opacity-80 md:block animate-mascot-float">
          🎈
        </span>
        <span
          className="pointer-events-none absolute right-8 top-40 hidden text-4xl opacity-80 md:block animate-mascot-float"
          style={{ animationDelay: '0.6s' }}
        >
          🎈
        </span>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-12 md:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 lg:px-8">
          {/* LEFT: copy */}
          <div className="relative z-10 text-center lg:text-left">
            <span className="inline-block rounded-full bg-white/70 px-4 py-1.5 text-sm font-bold text-primary shadow-sm backdrop-blur">
              Selamat Datang di
            </span>
            <h1 className="font-headline mt-4 text-4xl font-extrabold leading-[1.1] md:text-5xl lg:text-6xl">
              <span className="text-[#132447]">Kolam Renang</span>
              <br />
              <span className="letter-animate">
                {'SIRKUS'.split('').map((char, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                    {char}
                  </span>
                ))}
                <span className="text-[#FF4B7D]">WATERPLAY</span>
              </span>
            </h1>
            <p className="font-body mx-auto mt-5 max-w-lg text-base font-semibold leading-relaxed text-[#132447]/80 lg:mx-0">
              Indoor waterpark pertama di Indonesia dibangun tahun 2013 adalah tempat rekreasi yang sangat cocok untuk anak-anak. 
              Didesain dengan konsep ala pertunjukan sirkus, Waterboom ini juga melindungi anak-anak dari kepanasan dan kehujanan, ada kolam air panas, lantai dari rubber yang safety dan nyaman. 
              Ada fasilitas sauna dan Mom n Baby Spa membuat Sirkus Waterplay menjadi tempat favorite bagi keluarga
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {['♨️ Kolam air panas', '🧖 Sauna & Baby Spa', '🛡️ Lantai rubber aman'].map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-[#132447] shadow-sm md:text-sm"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: hero image */}
          <div className="relative w-full">
            <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] bg-white/50" />
            <div className="relative aspect-[5/4] w-full rotate-1 overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl transition-transform duration-500 hover:rotate-0">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover transition-opacity duration-700"
                  priority
                />
              )}
            </div>
          </div>
        </div>

        {/* ===== trust badges card, "floating" di bawah hero ===== */}
        <div className="container relative z-20 mx-auto px-4 pb-10 md:-mb-16 md:pb-0">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 rounded-3xl bg-white p-6 shadow-xl md:grid-cols-4 md:gap-6 md:p-8">
            {trustBadges.map((b) => (
              <div key={b.title} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  {b.icon}
                </div>
                <p className="font-accent text-sm font-bold text-[#132447]">
                  {b.title}
                </p>
                <p className="text-xs leading-snug text-muted-foreground">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* ================= HARGA TIKET & CARA PESAN ================= */}
      <section className="border-y border-[#132447]/5 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            {/* KIRI: harga */}
            <div>
              <h2 className="font-headline flex items-center gap-2 text-2xl font-extrabold text-[#132447] md:text-3xl">
                <Star className="h-6 w-6 fill-accent text-accent" />
                Harga Tiket
              </h2>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                Harga menyesuaikan hari kunjungan dan berlaku untuk semua umur.
              </p>

              <div className="mt-6 space-y-3">
                {Object.values(TICKET_TIERS).map((t) => (
                  <div
                    key={t.code}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#132447]/5 bg-background px-5 py-4"
                  >
                    <div>
                      <p className="font-accent text-base font-bold text-[#132447]">{t.code}</p>
                      <p className="text-sm font-semibold text-muted-foreground">{t.days}</p>
                    </div>
                    <p className="text-right">
                      <span className="text-2xl font-extrabold text-primary">
                        {formatRupiah(t.price)}
                      </span>
                      <span className="ml-1 text-sm font-semibold text-muted-foreground">/ orang</span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                *Tarif Weekends juga berlaku pada hari libur nasional dan libur sekolah.
              </p>
            </div>

            {/* KANAN: cara pesan */}
            <div>
              <h2 className="font-headline flex items-center gap-2 text-2xl font-extrabold text-[#132447] md:text-3xl">
                <Star className="h-6 w-6 fill-accent text-accent" />
                Cara Pesan Tiket
              </h2>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                Empat langkah mudah, tanpa antre di loket.
              </p>

              <ol className="mt-6">
                {bookingSteps.map((step, i) => (
                  <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                    {i < bookingSteps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-0.5 bg-primary/20"
                      />
                    )}
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-accent text-base font-bold text-white ring-4 ring-white">
                      {i + 1}
                    </span>
                    <div className="pt-1.5">
                      <h3 className="flex items-center gap-2 font-accent text-base font-bold text-[#132447]">
                        <span className="text-primary [&>svg]:h-4 [&>svg]:w-4">{step.icon}</span>
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <Button
                asChild
                size="lg"
                className="mt-8 rounded-full bg-primary px-8 font-accent text-base font-bold shadow-lg shadow-primary/30 hover:bg-primary/90"
              >
                <Link href="/beli-tiket">Pesan Tiket Sekarang</Link>
              </Button>
            </div>
          </div>

          {/* METODE PEMBAYARAN: satu baris, di tengah */}
          <div className="mt-14 border-t border-[#132447]/5 pt-8 text-center">
            <p className="text-sm font-bold text-[#132447]">Metode Pembayaran</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:flex-nowrap md:gap-4">
              {paymentLogos.map((p) => (
                <PaymentLogo key={p.name} name={p.name} src={p.src} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= WAHANA UNGGULAN ================= */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="font-headline flex items-center gap-2 text-2xl font-extrabold text-[#132447] md:text-3xl">
              <Star className="h-6 w-6 fill-accent text-accent" />
              Wahana Unggulan
            </h2>
            <Button asChild className="hidden rounded-full bg-primary font-accent font-bold hover:bg-primary/90 sm:inline-flex">
              <Link href="/wahana">Lihat Semua Wahana</Link>
            </Button>
          </div>

          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination]}
              onSwiper={(s) => (swiperRef.current = s)}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              loop
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              pagination={{ clickable: true, el: '.wahana-pagination' }}
              className="!pb-2"
            >
              {featuredAttractions.map((attraction) => {
                const image = PlaceHolderImages.find((img) => img.id === attraction.imageId);
                return (
                  <SwiperSlide key={attraction.id}>
                    <div className="overflow-hidden rounded-3xl bg-white shadow-md transition-shadow hover:shadow-xl">
                      {image && (
                        <div className="relative h-40 w-full">
                          <Image
                            src={image.imageUrl}
                            alt={attraction.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-headline text-base font-bold text-primary">
                          {attraction.name}
                        </h3>
                        <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                          {attraction.description}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <button
              aria-label="Sebelumnya"
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute -left-3 top-1/3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Selanjutnya"
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute -right-3 top-1/3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="wahana-pagination mt-4 flex justify-center gap-1.5 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-primary/30 [&_.swiper-pagination-bullet-active]:bg-primary" />

          <div className="mt-6 text-center sm:hidden">
            <Button asChild className="rounded-full bg-primary font-accent font-bold hover:bg-primary/90">
              <Link href="/wahana">Lihat Semua Wahana</Link>
            </Button>
          </div>
        </div>
      </section>

      <WaveDivider bg="hsl(var(--background))" wave="#CDEBFF" />

      {/* ================= FASILITAS ================= */}
      <section className="bg-[#FDDDE8] py-14 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-headline mb-10 flex items-center justify-center gap-3 text-center text-2xl font-extrabold text-[#132447] md:text-3xl">
            <Star className="h-6 w-6 fill-accent text-accent" />
            Fasilitas Kami
            <Star className="h-6 w-6 fill-accent text-accent" />
          </h2>

          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {facilitiesPreview.map((f) => (
              <div key={f.name} className="group flex flex-col items-center gap-4 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-primary shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl md:h-28 md:w-28">
                  {f.icon}
                </div>
                <p className="text-sm font-bold text-[#132447] md:text-base">{f.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild className="rounded-full bg-primary font-accent font-bold hover:bg-primary/90">
              <Link href="/fasilitas">Selengkapnya</Link>
            </Button>
          </div>
        </div>
      </section>

      <WaveDivider bg="#CDEBFF" wave="hsl(var(--background))" flip />

      {/* ================= GALERI CANDID ================= */}
      <section className="bg-background pt-14 md:pt-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="font-headline flex items-center gap-2 text-2xl font-extrabold text-[#132447] md:text-3xl">
              <Star className="h-6 w-6 fill-accent text-accent" />
              Galeri Candid
            </h2>
            <Button asChild className="hidden rounded-full bg-primary font-accent font-bold hover:bg-primary/90 sm:inline-flex">
              <Link href="/candid">Lihat Semua Galeri</Link>
            </Button>
          </div>

          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination]}
              onSwiper={(sw) => (candidSwiperRef.current = sw)}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              loop
              loopAdditionalSlides={4}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true, el: '.candid-pagination' }}
              className="!pb-2"
            >
              {candidPreview.map((img) => (
                <SwiperSlide key={img.id}>
                  <Link
                    href="/candid"
                    className="group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-white/60 shadow-md transition-shadow hover:shadow-xl"
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.description}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              aria-label="Sebelumnya"
              onClick={() => candidSwiperRef.current?.slidePrev()}
              className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Selanjutnya"
              onClick={() => candidSwiperRef.current?.slideNext()}
              className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="candid-pagination mt-4 flex justify-center gap-1.5 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-primary/30 [&_.swiper-pagination-bullet-active]:bg-primary" />

          <div className="mt-6 text-center sm:hidden">
            <Button asChild className="rounded-full bg-primary font-accent font-bold hover:bg-primary/90">
              <Link href="/candid">Lihat Semua Galeri</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= PROMO & INFO ================= */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="font-headline flex items-center gap-2 text-2xl font-extrabold text-[#132447] md:text-3xl">
              <Star className="h-6 w-6 fill-accent text-accent" />
              Promo & Info Terbaru
            </h2>
            <Button asChild className="hidden rounded-full bg-primary font-accent font-bold hover:bg-primary/90 sm:inline-flex">
              <Link href="/berita">Lihat Semua Berita</Link>
            </Button>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            {latestNews.map((item) => {
              const image = PlaceHolderImages.find((img) => img.id === item.imageId);
              return (
                <Link
                  href={`/berita/${item.slug}`}
                  key={item.id}
                  className="flex gap-4 rounded-3xl bg-white p-4 shadow-md transition-shadow hover:shadow-xl"
                >
                  {image && (
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                      <Image src={image.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-center">
                    <span
                      className={`mb-1 inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white ${
                        item.category === 'Promo' ? 'bg-primary' : 'bg-emerald-500'
                      }`}
                    >
                      {item.category}
                    </span>
                    <h3 className="font-headline text-sm font-bold leading-snug text-[#132447]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <span className="mt-1 flex items-center gap-1 text-xs font-bold text-primary">
                      Baca Selengkapnya <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button asChild className="rounded-full bg-primary font-accent font-bold hover:bg-primary/90">
              <Link href="/berita">Lihat Semua Berita</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
