/**
 * Pembatas section bergelombang yang terus mengalir seperti air.
 *
 * Gelombang digambar menumpuk di tepi bawah section di atasnya, jadi
 * tepi atasnya SELALU melengkung (tidak ada garis lurus), berapa pun
 * warna section di atasnya.
 *
 * - `wave`    : warna section DI BAWAH divider (wajib sama persis).
 * - `accent`  : SATU warna garis aksen (default biru muda). `null` = tanpa garis.
 * - `accents` : BEBERAPA warna garis sekaligus (pita berwarna), urut dari
 *               yang paling luar/atas ke yang paling dekat dengan `wave`.
 *               Contoh: ["#FFC1DA", "#BFE6FF", "#FFE58A"]. Kalau diisi,
 *               `accent` diabaikan.
 * - `flip`    : cerminkan arah lengkungan supaya antar divider bervariasi.
 * - `size`    : "md" (default) atau "sm" untuk gelombang yang lebih pendek.
 * - `overlay` : dipakai di dalam hero (menempel di dasar section itu).
 * - `bg`      : tidak dipakai lagi, dipertahankan agar pemanggil lama aman.
 */
const SIZES = {
  md: "block h-8 md:h-[60px] lg:h-[72px]",
  sm: "block h-5 md:h-[36px] lg:h-[44px]",
} as const;

// Dua periode gelombang (masing-masing 1440 lebar) -> loop mulus
const wavePath = (base: number, amp: number) =>
  `M0,${base} C240,${base - amp} 480,${base - amp} 720,${base} ` +
  `C960,${base + amp} 1200,${base + amp} 1440,${base} ` +
  `C1680,${base - amp} 1920,${base - amp} 2160,${base} ` +
  `C2400,${base + amp} 2640,${base + amp} 2880,${base} L2880,81 L0,81 Z`;

// Gelombang tunggal (satu garis aksen)
const MAIN = wavePath(46, 24);
const ACCENT = wavePath(31, 24);

// Pita beberapa warna: amplitudo lebih kalem, tiap pita setebal 10 satuan
const RIBBON_BASE = 54;
const RIBBON_AMP = 18;
const RIBBON_STEP = 10;

export function WaveDivider({
  wave,
  accent = "#8FD3F4",
  accents,
  flip = false,
  size = "md",
  overlay = false,
}: {
  bg?: string;
  wave: string;
  accent?: string | null;
  accents?: string[];
  flip?: boolean;
  size?: "md" | "sm";
  overlay?: boolean;
}) {
  const SIZE = SIZES[size];
  const ribbon = accents && accents.length > 0 ? accents : null;

  const waves = (
    <div
      className="relative w-full overflow-hidden leading-[0]"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {ribbon ? (
        <>
          {ribbon.map((color, i) => {
            // i = 0 -> paling luar (paling tinggi)
            const level = ribbon.length - i;
            return (
              <svg
                key={`${color}-${i}`}
                viewBox="0 0 2880 80"
                preserveAspectRatio="none"
                className={`${SIZE} absolute bottom-0 left-0 animate-wave-scroll motion-reduce:animate-none`}
                style={{
                  width: "200%",
                  // geser fase sedikit tiap lapis -> pita terlihat mengalir
                  animationDelay: `${-0.7 * (level + 1)}s`,
                }}
              >
                <path
                  d={wavePath(RIBBON_BASE - RIBBON_STEP * level, RIBBON_AMP)}
                  fill={color}
                />
              </svg>
            );
          })}
          <svg
            viewBox="0 0 2880 80"
            preserveAspectRatio="none"
            className={`${SIZE} relative animate-wave-scroll motion-reduce:animate-none`}
            style={{ width: "200%" }}
          >
            <path d={wavePath(RIBBON_BASE, RIBBON_AMP)} fill={wave} />
          </svg>
        </>
      ) : (
        <>
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
        </>
      )}
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