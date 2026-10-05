import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok-icon";
import Image from "next/image";
import { WaveDivider } from "@/components/layout/wave-divider";


export function Footer() {
  const socialLinks = [
    { name: "Instagram", icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com/sirkuswaterplay" },
    { name: "TikTok", icon: <TikTokIcon className="h-5 w-5" />, href: "https://www.tiktok.com/@sirkuswaterplayjatiasih?_r=1&_t=ZS-93h0vWDXcUk" },
    { name: "WhatsApp", icon: <MessageCircle className="h-5 w-5" />, href: "https://wa.me/628176988578" },
  ];

  const navLinks = [
    { href: "/wahana", label: "Wahana" },
    { href: "/fasilitas", label: "Fasilitas" },
    { href: "/berita", label: "Berita" },
    { href: "/beli-tiket", label: "Tiket" },
  ];

  return (
    <footer className="bg-[#1E3A63] text-slate-200">
      <WaveDivider bg="#FDDDE8" wave="#1E3A63" />
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="/images/mascot/badut.png" alt="Sirkus Waterplay" width={40} height={40} className="object-contain rounded-full bg-white" />
              <span className="text-xl font-bold font-headline text-white">Sirkus Waterplay</span>
            </Link>
            <p className="text-sm text-slate-400">
              Destinasi wisata air terbaik untuk keseruan tak terlupakan bersama keluarga. Indoor Waterpark, ngga keujanan ngga kepanasan, ada kolam air hangat, sauna, gym gratis, bisa pijat refleksi, baby spa dan salon muslimah, kedai kopi juga ada.
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
                  className="p-2.5 bg-white/10 rounded-full text-slate-200 hover:text-primary hover:bg-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Sirkus Waterplay. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}