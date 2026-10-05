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
  Clock,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Ticket,
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
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import { attractions, news } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { WaveDivider } from '@/components/layout/wave-divider';

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

const tickets = [
  {
    name: 'Tiket Anak',
    price: 'Rp 40.000',
    unit: '/ orang',
    features: ['Tinggi maks. 120 cm', 'Akses semua wahana anak'],
    accent: 'from-[#FFF3D6] to-[#FFE1A8]',
    badgeColor: 'text-[#E68A00]',
    buttonClass: 'bg-[#FFA726] hover:bg-[#FB8C00] text-white',
    href: '/beli-tiket',
    cta: 'Pilih Tiket',
  },
  {
    name: 'Tiket Dewasa',
    price: 'Rp 60.000',
    unit: '/ orang',
    features: ['Di atas 120 cm', 'Akses semua wahana'],
    accent: 'from-[#DCF1FF] to-[#BEE6FF]',
    badgeColor: 'text-[#0B84D6]',
    buttonClass: 'bg-[#29ABE2] hover:bg-[#1E96C8] text-white',
    href: '/beli-tiket',
    cta: 'Pilih Tiket',
  },
  {
    name: 'Paket Keluarga',
    price: 'Rp 180.000',
    unit: '/ paket',
    features: ['Hemat untuk keluarga', 'Akses semua wahana'],
    extra: 'Anak semua wahana Free',
    accent: 'from-[#FFE3ED] to-[#FFC9DD]',
    badgeColor: 'text-primary',
    buttonClass: 'bg-primary hover:bg-primary/90 text-white',
    href: '/beli-tiket',
    cta: 'Pilih Paket',
  },
];

const bookingSteps = [
  { icon: <CalendarDays className="h-6 w-6" />, label: 'Pilih Tanggal' },
  { icon: <Ticket className="h-6 w-6" />, label: 'Pilih Tiket' },
  { icon: <ClipboardList className="h-6 w-6" />, label: 'Isi Data' },
  { icon: <CreditCard className="h-6 w-6" />, label: 'Pembayaran' },
  { icon: <BadgeCheck className="h-6 w-6" />, label: 'E-Tiket' },
];

const paymentMethods = [
  { label: 'BRI', className: 'bg-[#00529C] text-white' },
  { label: 'OVO', className: 'bg-[#4C2A86] text-white' },
  { label: 'DANA', className: 'bg-[#118EEA] text-white' },
  { label: 'gopay', className: 'bg-[#00AED6] text-white' },
  { label: 'ShopeePay', className: 'bg-[#EE4D2D] text-white' },
];

const facilitiesPreview = [
  { name: 'Area Bermain Anak', icon: <Tent className="h-7 w-7" /> },
  { name: 'Kamar Bilas', icon: <ShowerHead className="h-7 w-7" /> },
  { name: 'Loker', icon: <Lock className="h-7 w-7" /> },
  { name: 'Food Court', icon: <UtensilsCrossed className="h-7 w-7" /> },
  { name: 'Area Parkir', icon: <Car className="h-7 w-7" /> },
];

const galleryPreview = [
  { id: 'galeri-1', src: '/images/galeri/kolam1.png' },
  { id: 'galeri-2', src: '/images/galeri/kolam2.png' },
  { id: 'galeri-3', src: '/images/galeri/kolam3.png' },
];

export default function Home() {
  const heroImages = PlaceHolderImages.filter((img) => img.id.startsWith('hero'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const heroImage = heroImages[currentIndex];
  const featuredAttractions = attractions.slice(0, 8);
  const latestNews = news.slice(0, 2);

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

        <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-14 md:py-20 lg:grid-cols-2">
          {/* LEFT: copy */}
          <div className="relative z-10 text-center lg:text-left">
            <span className="inline-block rounded-full bg-white/70 px-4 py-1.5 text-sm font-bold text-primary shadow-sm backdrop-blur">
              Selamat Datang di
            </span>
            <h1 className="font-headline mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              <span className="text-[#132447]">Kolam Renang</span>
              <br />
              <span className="letter-animate">
                {'SIRKUS'.split('').map((char, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                    {char}
                  </span>
                ))}
              </span>
              <br />
              <span className="text-[#FF4B7D]">WATERPLAY</span>
            </h1>
            <p className="font-body mx-auto mt-5 max-w-md text-base font-semibold text-[#132447]/80 md:mx-0 md:text-lg">
              Tempat bermain air paling seru dengan wahana lengkap dan aman
              untuk anak-anak! 💙
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary px-7 font-accent text-base font-bold shadow-lg shadow-primary/30 hover:bg-primary/90"
              >
                <Link href="/beli-tiket">Pesan Tiket Sekarang</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-accent bg-accent px-7 font-accent text-base font-bold text-accent-foreground shadow-lg shadow-accent/30 hover:bg-accent/90"
              >
                <Link href="/wahana">Lihat Wahana</Link>
              </Button>
            </div>

            {/* tag Seru! Aman! Nyaman! */}
            <div className="mt-8 hidden flex-col items-start gap-2 lg:flex">
              {['Seru!', 'Aman!', 'Nyaman!'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-r-full rounded-l-sm bg-primary/90 px-4 py-1 font-accent text-sm font-bold text-white shadow-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: mascot + rotating hero image */}
          <div className="relative mx-auto h-[300px] w-full max-w-md md:h-[420px]">
            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover transition-opacity duration-700"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            <span className="absolute -left-4 bottom-2 text-5xl drop-shadow-md">
              🦆
            </span>
            <span className="absolute -top-6 left-10 text-3xl">🏐</span>
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

      {/* ================= PILIHAN TIKET ================= */}
      <section className="bg-background pb-16 pt-14 md:pt-24 lg:pt-20">
        <div className="container mx-auto px-4">
          <h2 className="font-headline mb-10 flex items-center justify-center gap-3 text-center text-2xl font-extrabold text-[#132447] md:text-3xl">
            <Star className="h-6 w-6 fill-accent text-accent" />
            Pilihan Tiket
            <Star className="h-6 w-6 fill-accent text-accent" />
          </h2>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {tickets.map((t) => (
              <div
                key={t.name}
                className={`flex flex-col rounded-3xl bg-gradient-to-b ${t.accent} p-6 shadow-md`}
              >
                <h3 className={`font-headline text-lg font-extrabold ${t.badgeColor}`}>
                  {t.name}
                </h3>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#132447]">
                    {t.price}
                  </span>
                  <span className="text-sm font-semibold text-[#132447]/70">
                    {t.unit}
                  </span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-semibold text-[#132447]/80">
                      <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                      {f}
                    </li>
                  ))}
                  {t.extra && (
                    <li className="flex items-center gap-2 text-sm font-bold text-primary">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      {t.extra}
                    </li>
                  )}
                </ul>
                <Button asChild className={`mt-6 w-full rounded-full font-accent font-bold ${t.buttonClass}`}>
                  <Link href={t.href}>{t.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOOKING ONLINE + INFO ================= */}
      <section className="bg-secondary/60 py-14 md:py-20">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 lg:grid-cols-5">
          {/* Booking card */}
          <div className="rounded-3xl bg-white p-6 shadow-lg md:p-8 lg:col-span-3">
            <h3 className="font-headline flex items-center gap-2 text-xl font-extrabold text-[#132447] md:text-2xl">
              <Star className="h-5 w-5 fill-accent text-accent" />
              Booking Tiket Online
              <Star className="h-5 w-5 fill-accent text-accent" />
            </h3>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Mudah, cepat, dan praktis!
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-6">
              {bookingSteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary shadow-sm">
                      {step.icon}
                    </div>
                    <p className="w-20 text-xs font-bold text-[#132447]">
                      {step.label}
                    </p>
                  </div>
                  {i < bookingSteps.length - 1 && (
                    <ArrowRight className="mx-2 h-5 w-5 shrink-0 text-accent" />
                  )}
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="mt-8 w-full rounded-full bg-[#29ABE2] font-accent text-base font-bold text-white shadow-lg shadow-[#29ABE2]/30 hover:bg-[#1E96C8]"
            >
              <Link href="/beli-tiket">🎟️ Booking Sekarang</Link>
            </Button>

            <div className="mt-8">
              <p className="mb-3 text-center text-sm font-bold text-[#132447]">
                Pembayaran Aman
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {paymentMethods.map((p) => (
                  <span
                    key={p.label}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold shadow-sm ${p.className}`}
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Info column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h4 className="flex items-center gap-2 font-accent text-base font-bold text-[#132447]">
                <Clock className="h-5 w-5 text-primary" />
                Jam Operasional
              </h4>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                Senin - Jumat
                <br />
                09.00 - 17.00
                <br />
                Sabtu - Minggu & Hari Libur
                <br />
                08.00 - 18.00
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h4 className="flex items-center gap-2 font-accent text-base font-bold text-[#132447]">
                <MapPin className="h-5 w-5 text-primary" />
                Lokasi Kami
              </h4>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                Jl. Wibawa Mukti II No.4, RT.001/RW.5,
                <br />
                Jatiasih, Kota Bekasi, Jawa Barat 17423
              </p>
              <a
                href="https://maps.app.goo.gl/YUb3HGWaUmKqd5x87"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
              >
                Lihat di Maps <MapPin className="h-4 w-4" />
              </a>
            </div>

            <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-lg">
              <div className="relative h-16 w-16 shrink-0">
                <Image
                  src="/images/mascot/badut.png"
                  alt="Maskot Sirkus Waterplay"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#132447]">
                  Ikuti media sosial kami untuk info promo dan acara seru lainnya!
                </p>
                <div className="mt-2 flex gap-2">
                  {[
                    { icon: <Instagram className="h-4 w-4" />, href: 'https://instagram.com/sirkuswaterplay' },
                    { icon: <Facebook className="h-4 w-4" />, href: '#' },
                    { icon: <TikTokIcon className="h-4 w-4" />, href: 'https://www.tiktok.com/@sirkuswaterplayjatiasih' },
                    { icon: <Youtube className="h-4 w-4" />, href: '#' },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
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

      <WaveDivider bg="hsl(var(--background))" wave="hsl(var(--secondary))" />

      {/* ================= FASILITAS + GALERI ================= */}
      <section className="bg-secondary/60 py-14 md:py-20">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          {/* Fasilitas */}
          <div>
            <h2 className="font-headline mb-6 flex items-center gap-2 text-xl font-extrabold text-[#132447] md:text-2xl">
              <Star className="h-5 w-5 fill-accent text-accent" />
              Fasilitas Kami
            </h2>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
              {facilitiesPreview.map((f) => (
                <div key={f.name} className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-md">
                    {f.icon}
                  </div>
                  <p className="text-xs font-semibold text-[#132447]">{f.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center sm:text-left">
              <Button asChild className="rounded-full bg-primary font-accent font-bold hover:bg-primary/90">
                <Link href="/fasilitas">Selengkapnya</Link>
              </Button>
            </div>
          </div>

          {/* Galeri */}
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-headline flex items-center gap-2 text-xl font-extrabold text-[#132447] md:text-2xl">
                <Star className="h-5 w-5 fill-accent text-accent" />
                Galeri Keseruan
              </h2>
              <Button asChild size="sm" className="rounded-full bg-primary font-accent font-bold hover:bg-primary/90">
                <Link href="/candid">Lihat Semua Galeri</Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {galleryPreview.map((g) => (
                <div key={g.id} className="relative aspect-square overflow-hidden rounded-2xl shadow-md">
                  <Image src={g.src} alt="Galeri Sirkus Waterplay" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider bg="hsl(var(--secondary))" wave="hsl(var(--background))" flip />

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
