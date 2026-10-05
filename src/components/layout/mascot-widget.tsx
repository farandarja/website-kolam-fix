"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const MASCOT_LINES = [
  "Halo! Yuk main air bareng aku! 🎈",
  "Jangan lupa pakai pelampung ya! 🛟",
  "Tiket keluarga lagi hemat lho! 🎟️",
  "Kolam hangat cocok buat santai 🌊",
  "Follow sosmed kami buat info promo! 📣",
  "Air segeeer, ayo berenang! 💦",
  "Klik menu Fasilitas buat lihat detailnya!",
];

export function MascotWidget() {
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [excited, setExcited] = useState(false);
  const bubbleTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const excitedTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function speak(text: string) {
    setBubbleText(text);
    if (bubbleTimeout.current) clearTimeout(bubbleTimeout.current);
    bubbleTimeout.current = setTimeout(() => setBubbleText(null), 3200);
  }

  function randomLine() {
    return MASCOT_LINES[Math.floor(Math.random() * MASCOT_LINES.length)];
  }

  useEffect(() => {
    const firstGreeting = setTimeout(() => speak(randomLine()), 1200);
    const loop = setInterval(() => {
      setBubbleText((current) => {
        if (current) return current; // jangan potong bubble yang lagi tampil
        speak(randomLine());
        return current;
      });
    }, 9000);
    return () => {
      clearTimeout(firstGreeting);
      clearInterval(loop);
      if (bubbleTimeout.current) clearTimeout(bubbleTimeout.current);
      if (excitedTimeout.current) clearTimeout(excitedTimeout.current);
    };
  }, []);

  function handleClick() {
    setExcited(false);
    // trigger reflow supaya animasi bisa diulang walau class-nya sama
    requestAnimationFrame(() => setExcited(true));
    if (excitedTimeout.current) clearTimeout(excitedTimeout.current);
    excitedTimeout.current = setTimeout(() => setExcited(false), 1700);
    speak(randomLine());
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2 select-none">
      {bubbleText && (
        <div className="max-w-[190px] rounded-2xl rounded-br-sm bg-white px-3.5 py-2 text-xs font-semibold text-foreground shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          {bubbleText}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        aria-label="Maskot Sirkus Waterplay"
        className={`h-24 w-24 md:h-28 md:w-28 cursor-pointer drop-shadow-xl transition-transform ${
          excited ? "animate-mascot-bounce" : "animate-mascot-float"
        }`}
      >
        <Image
          src="/images/mascot/badut.png"
          alt="Maskot Sirkus Waterplay"
          width={200}
          height={200}
          className="h-full w-full object-contain"
          priority
        />
      </button>
    </div>
  );
}
