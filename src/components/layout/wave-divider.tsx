/**
 * Pembatas section bergelombang yang terus mengalir seperti air.
 *
 * Gelombang digambar menumpuk di tepi bawah section di atasnya, jadi
 * tepi atasnya SELALU melengkung (tidak ada garis lurus), berapa pun
 * warna section di atasnya.
 *
 * Ada dua lapis: lapisan aksen (garis tipis) bergerak ke arah
 * berlawanan dan lebih lambat dari lapisan utama, sehingga bentuknya
 * terus berubah dan terasa seperti riak air, bukan pola yang
 * menggeser kaku. Bentuknya periodik sehingga loop-nya mulus.
 *
 * - `wave`   : warna section DI BAWAH divider (wajib sama persis).
 * - `accent` : warna garis aksen (default biru muda). `null` = tanpa garis.
 * - `flip`   : cerminkan arah lengkungan supaya antar divider bervariasi.
 * - `size`   : "md" (default) atau "sm" untuk gelombang yang lebih tipis/kalem.
 * - `overlay`: dipakai di dalam hero (menempel di dasar section itu).
 * - `bg`     : tidak dipakai lagi, dipertahankan agar pemanggil lama aman.
 */
const SIZES = {
  md: "block h-8 md:h-[60px] lg:h-[72px]",
  sm: "block h-5 md:h-[36px] lg:h-[44px]",
} as const;

// Dua periode gelombang (masing-masing 1440 lebar) -> loop mulus
// saat digeser -50%.
const MAIN =
  "M0,46 C240,22 480,22 720,46 C960,70 1200,70 1440,46 " +
  "C1680,22 1920,22 2160,46 C2400,70 2640,70 2880,46 L2880,81 L0,81 Z";
const ACCENT =
  "M0,31 C240,7 480,7 720,31 C960,55 1200,55 1440,31 " +
  "C1680,7 1920,7 2160,31 C2400,55 2640,55 2880,31 L2880,81 L0,81 Z";

export function WaveDivider({
  wave,
  accent = "#8FD3F4",
  flip = false,
  size = "md",
  overlay = false,
}: {
  bg?: string;
  wave: string;
  accent?: string | null;
  flip?: boolean;
  size?: "md" | "sm";
  overlay?: boolean;
}) {
  const SIZE = SIZES[size];
  const waves = (
    <div
      className="relative w-full overflow-hidden leading-[0]"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
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
        <path d={MAIN} fill={wave} />
      </svg>
    </div>
  );

  if (overlay) {
    return (
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        aria-hidden="true"
      >
        {waves}
      </div>
    );
  }

  return (
    <div className="relative z-10 h-0 w-full" aria-hidden="true">
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        {waves}
      </div>
    </div>
  );
}
