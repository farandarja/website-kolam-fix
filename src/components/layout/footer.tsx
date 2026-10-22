import Link from "next/link";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { WaveDivider } from "@/components/layout/wave-divider";


export function Footer() {
    const socialLinks = [
    { name: "Instagram", icon: "/images/social/instagram.svg", href: "https://instagram.com/sirkuswaterplay" },
    { name: "TikTok", icon: "/images/social/tiktok.svg", href: "https://www.tiktok.com/@sirkuswaterplayjatiasih?_r=1&_t=ZS-93h0vWDXcUk" },
    { name: "WhatsApp", icon: "/images/social/whatsapp.svg", href: "https://wa.me/628176988578" },
  ];

  const navLinks = [
    { href: "/wahana", label: "Wahana" },
    { href: "/fasilitas", label: "Fasilitas" },
    { href: "/berita", label: "Berita" },
    { href: "/beli-tiket", label: "Tiket" },
  ];

  return (
    <footer className="bg-[#1E3A63] text-slate-200">
      <WaveDivider bg="hsl(var(--background))" wave="#1E3A63" />
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="/images/icon.png" alt="Sirkus Waterplay" width={40} height={40} className="object-contain rounded-full bg-white" />
              <span className="text-xl font-bold font-headline text-white">Sirkus Waterplay</span>
            </Link>
            <p className="text-sm text-slate-400">
              Destinasi wisata air terbaik untuk keseruan tak terlupakan bersama keluarga. Indoor Waterpark, ngga keujanan ngga kepanasan, ada kolam air hangat, sauna, bisa pijat refleksi, baby spa dan salon muslimah, kedai kopi juga ada.
            </p>
          </div>
          <div>
            <h4 className="font-semibold font-accent mb-4 text-white">Navigasi</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold font-accent mb-4 text-white">Informasi</h4>
            <div className="text-sm text-slate-400 space-y-2">
              <p>
                <strong className="text-slate-200">Alamat:</strong><br />
                Jl. Wibawa Mukti II No.4, RT.001/RW.5, Jatiasih, Kec. Jatiasih, Kota Bekasi, Jawa Barat 17423
              </p>
              <p>
                <strong className="text-slate-200">Jam Buka:</strong><br />
                Weekdays: 08:00 - 17:00 WIB<br />
                Weekend: 08:00 - 17:30 WIB
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold font-accent mb-4 text-white">Ikuti Kami</h4>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform hover:scale-110"
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={24}
                    height={24}
                    unoptimized
                    className="h-6 w-6 object-contain"
                  />
                </a>
              ))}
            </div>

            <a
              href="https://maps.app.goo.gl/YUb3HGWaUmKqd5x87"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white hover:text-primary"
            >
              <MapPin className="h-4 w-4" />
              Lihat di Google Maps
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Sirkus Waterplay. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}