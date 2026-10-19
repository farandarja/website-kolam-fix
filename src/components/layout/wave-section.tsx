import type { ReactNode } from "react";

/**
 * Section dengan tepi ATAS dan BAWAH sama-sama bergelombang & bergerak
 * seperti air. Gelombangnya memakai warna section ini sendiri, jadi
 * tidak peduli warna section di atas/bawahnya apa: tepinya pasti
 * melengkung, tidak ada garis lurus.
 *
 * Pakai SEBAGAI PENGGANTI section + <WaveDivider> di sekitarnya
 * (hapus WaveDivider yang tadinya ada tepat di atas & bawah section ini).
 *
 * - color  : warna latar section (juga warna gelombangnya)
 * - accent : warna garis aksen di luar tepi gelombang (null = tanpa garis)
 * - size   : "md" (default) atau "sm" untuk gelombang yang lebih pendek
 */
const SIZES = {
  md: "block h-8 md:h-[60px] lg:h-[72px]",
  sm: "block h-5 md:h-[36px] lg:h-[44px]",
} as const;

const MAIN =
  "M0,46 C240,22 480,22 720,46 C960,70 1200,70 1440,46 " +
  "C1680,22 1920,22 2160,46 C2400,70 2640,70 2880,46 L2880,81 L0,81 Z";
const ACCENT =
  "M0,31 C240,7 480,7 720,31 C960,55 1200,55 1440,31 " +
  "C1680,7 1920,7 2160,31 C2400,55 2640,55 2880,31 L2880,81 L0,81 Z";

function Edge({
  color,
  accent,
  position,
  size,
}: {
  color: string;
  accent: string | null;
  position: "top" | "bottom";
  size: "md" | "sm";
}) {
  const isTop = position === "top";
  const SIZE = SIZES[size];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 z-10 w-full"
      style={
        isTop
          ? { bottom: "calc(100% - 1px)" }
          : { top: "calc(100% - 1px)" }
      }
    >
      <div
        className="relative w-full overflow-hidden leading-[0]"
        style={{
          transform: isTop ? "none" : "scale(-1, -1)",
        }}
      >
        {accent && (
          <svg
            viewBox="0 0 2880 80"
            preserveAspectRatio="none"
            className={`${SIZE} absolute bottom-0 left-0 animate-wave-scroll-slow motion-reduce:animate-none`}
            style={{ width: "200%" }}
          >
            <path d={ACCENT} fill={accent} />
          </svg>
        )}
        <svg
          viewBox="0 0 2880 80"
          preserveAspectRatio="none"
          className={`${SIZE} relative animate-wave-scroll motion-reduce:animate-none`}
          style={{ width: "200%" }}
        >
          <path d={MAIN} fill={color} />
        </svg>
      </div>
    </div>
  );
}

export function WaveSection({
  color,
  accent = "#CDEBFF",
  size = "md",
  id,
  className = "",
  children,
}: {
  color: string;
  accent?: string | null;
  size?: "md" | "sm";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative ${className}`}
      style={{ backgroundColor: color }}
    >
      <Edge color={color} accent={accent} position="top" size={size} />
      {children}
      <Edge color={color} accent={accent} position="bottom" size={size} />
    </section>
  );
}
