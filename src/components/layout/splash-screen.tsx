"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Layar loading yang muncul sesaat ketika website pertama kali dibuka
 * di browser (Chrome dsb), supaya pengunjung tahu halaman sedang
 * diproses/dimuat — bukan macet.
 *
 * Otomatis hilang begitu halaman selesai dimuat (window "load") ATAU
 * setelah durasi minimum tercapai, mana yang lebih lama, supaya
 * animasinya tidak terasa "kedip" kalau koneksi sangat cepat.
 */
const MIN_VISIBLE_MS = 900;

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const start = Date.now();
    let finished = false;

    function hide() {
      if (finished) return;
      finished = true;
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        setFadingOut(true);
        window.setTimeout(() => setVisible(false), 400); // durasi fade-out
      }, remaining);
    }

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide);
    }
    // Jaga-jaga kalau event "load" tidak pernah terpicu (mis. resource lambat)
    const safetyTimer = window.setTimeout(hide, 4000);

    return () => {
      window.removeEventListener("load", hide);
      window.clearTimeout(safetyTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Memuat halaman"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 transition-opacity duration-400 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative">
        <div className="animate-splash-bounce">
          <Image
            src="/images/icon.png"
            alt="Sirkus Waterplay"
            width={110}
            height={110}
            priority
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3 w-16 rounded-full bg-black/10 animate-splash-shadow" />
      </div>

      <p className="mt-8 font-bold text-primary text-lg tracking-wide animate-pulse">
        Memuat Sirkus Waterplay...
      </p>

      <div className="mt-4 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-primary animate-splash-dot [animation-delay:0ms]" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary animate-splash-dot [animation-delay:150ms]" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary animate-splash-dot [animation-delay:300ms]" />
      </div>

      {/* garis ombak dekoratif di bagian bawah */}
      <svg
        className="absolute bottom-0 left-0 h-14 animate-splash-wave"
        viewBox="0 0 2400 60"
        preserveAspectRatio="none"
        style={{ width: "200%" }}
      >
        <path
          d="M0,30 C150,58 350,0 600,28 C850,56 1050,4 1200,30 L1200,60 L0,60 Z"
          fill="#57C2F0"
          opacity="0.5"
        />
        <path
          d="M1200,30 C1350,58 1550,0 1800,28 C2050,56 2250,4 2400,30 L2400,60 L1200,60 Z"
          fill="#57C2F0"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
