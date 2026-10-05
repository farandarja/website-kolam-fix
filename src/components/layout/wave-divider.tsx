/**
 * Garis pembatas bergelombang antar section, bergerak terus seperti
 * arus air (bukan bentuk statis/kaku).
 *
 * PENTING soal warna supaya section terasa "nyambung" (tidak seperti
 * tempelan terpisah): `bg` harus sama/mendekati warna latar SECTION
 * DI ATAS divider ini (boleh solid color atau gradient CSS), dan
 * `wave` harus sama persis dengan warna latar SECTION DI BAWAHNYA.
 * Container selalu terisi penuh warna `bg` sehingga tidak ada celah
 * yang menampilkan warna lain.
 */
export function WaveDivider({
  bg,
  wave,
  flip = false,
  overlay = false,
}: {
  bg?: string;
  wave: string;
  flip?: boolean;
  overlay?: boolean;
}) {
  return (
    <div
      className={
        overlay
          ? "absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none"
          : "w-full overflow-hidden leading-[0]"
      }
      style={overlay ? undefined : { background: bg }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 2400 60"
        preserveAspectRatio="none"
        className={`block h-8 md:h-[60px] animate-wave-scroll ${flip ? "-scale-y-100" : ""}`}
        style={{ width: "200%" }}
      >
        <path
          d="M0,30 C150,58 350,0 600,28 C850,56 1050,4 1200,30 L1200,60 L0,60 Z"
          fill={wave}
        />
        <path
          d="M1200,30 C1350,58 1550,0 1800,28 C2050,56 2250,4 2400,30 L2400,60 L1200,60 Z"
          fill={wave}
        />
      </svg>
    </div>
  );
}
