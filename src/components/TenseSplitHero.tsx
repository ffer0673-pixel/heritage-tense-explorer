import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { TenseCategory } from "@/data/tenses";

export interface TenseHeroData {
  key: TenseCategory;
  word1: string;      // kata besar kiri, muncul dari kiri (misal "Present")
  word2: string;       // kata besar kanan, muncul dari kanan (misal "Tenses")
  subline: string;     // teks kecil pojok kanan atas
  tagline: string;     // teks kecil pojok kiri bawah
  byline?: string;     // teks kecil di dekat foto, misal jumlah sub-tense
  imageAlt: string;    // alt text untuk foto (kosong dulu, tinggal isi src)
  imageSrc?: string;   // <-- ISI DI SINI kalau sudah ada foto, biarkan undefined/"" dulu
}

/**
 * Berapa vh scroll yang dialokasikan per kategori tense di dalam section pinned.
 * Makin besar -> transisi makin "lambat" / makin banyak scroll yang dibutuhkan
 * untuk berpindah dari satu kategori ke kategori berikutnya.
 */
const SCROLL_VH_PER_ITEM = 130;

/**
 * Satu "slide" konten (word besar + foto + teks kecil) di dalam section pinned.
 * Posisinya absolute, menumpuk persis di atas slide lain — yang membuat efek
 * crossfade/slide Apple-style saat slide sebelumnya keluar & slide berikutnya masuk.
 *
 * Setiap slide punya "jatah" scroll sepanjang `segment` (1/jumlah item) dari total
 * scrollYProgress (0..1) section pinned. Di dalam jatah itu:
 *   - 0%–35%   : masuk (slide in + fade in)
 *   - 35%–65%  : diam di tengah, fully visible ("held")
 *   - 65%–100% : keluar (slide out + fade out), arah berlawanan dari masuk
 *
 * Posisi "held" (diam) SENGAJA dibuat FIXED untuk semua slide:
 *   - word1 selalu rata kiri
 *   - word2 selalu rata kanan
 * Tidak lagi bergantung index genap/ganjil (isEven), supaya setiap kategori
 * berhenti di posisi yang sama persis (lihat referensi: "Present" kiri-atas,
 * "Tenses" kanan-bawah).
 */
function TenseHeroSlide({
  data,
  index,
  scrollYProgress,
  segment,
}: {
  data: TenseHeroData;
  index: number;
  scrollYProgress: MotionValue<number>;
  segment: number;
}) {
  const segStart = index * segment;
  const segEnd = (index + 1) * segment;

  // breakpoint posisi (word slide) — rasio 0 / 0.35 / 0.65 / 1 dari jatah segment ini
  const posEnter = segStart + segment * 0.35;
  const posExit = segStart + segment * 0.65;

  // breakpoint opacity kata — fade sedikit lebih cepat dari posisi (rasio 0 / 0.18 / 0.82 / 1)
  const opEnter = segStart + segment * 0.18;
  const opExit = segStart + segment * 0.82;

  // breakpoint foto — rasio 0 / 0.3 / 0.7 / 1
  const imgEnter = segStart + segment * 0.3;
  const imgExit = segStart + segment * 0.7;

  // breakpoint teks kecil (subline/tagline) — rasio 0 / 0.22 / 0.78 / 1
  const textEnter = segStart + segment * 0.22;
  const textExit = segStart + segment * 0.78;

  // Kata 1: dari kiri (-) masuk ke tengah (0) lalu keluar ke kanan (+)
  const word1X = useTransform(scrollYProgress, [segStart, posEnter, posExit, segEnd], ["-45vw", "0vw", "0vw", "45vw"]);
  // Kata 2: dari kanan (+) masuk ke tengah (0) lalu keluar ke kiri (-) — berlawanan dari word1
  const word2X = useTransform(scrollYProgress, [segStart, posEnter, posExit, segEnd], ["45vw", "0vw", "0vw", "-45vw"]);
  const wordOpacity = useTransform(scrollYProgress, [segStart, opEnter, opExit, segEnd], [0, 1, 1, 0]);

  // Foto: hanya memudar (fade) tanpa bergerak
  const imgOpacity = useTransform(scrollYProgress, [segStart, imgEnter, imgExit, segEnd], [0, 1, 1, 0]);

  // Teks kecil: fade + slide up ringan
  const textOpacity = useTransform(scrollYProgress, [segStart, textEnter, textExit, segEnd], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [segStart, textEnter, textExit, segEnd], [24, 0, 0, -24]);

  // Nonaktifkan interaksi (klik) saat slide sedang tidak terlihat, supaya link/CTA
  // milik slide yang "tersembunyi" nggak ikut ke-klik pas menumpuk dengan slide aktif.
  const pointerEvents = useTransform(wordOpacity, (o) => (o > 0.35 ? "auto" : "none"));

  return (
    <motion.div
      style={{ pointerEvents }}
      className="absolute inset-0 flex items-center overflow-hidden"
    >
      <div className="mx-auto max-w-7xl w-full h-full px-6 sm:px-10 py-20 relative">
        {/* subline — kanan atas, ~14% dari top */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute top-[14%] right-[5%] sm:right-[8%] max-w-[220px] text-right z-40"
        >
          <p className="text-[12px] sm:text-[13px] text-neutral-500 leading-snug">{data.subline}</p>
        </motion.div>

        {/*
          Layout absolute-positioning dengan z-index bertingkat:
          word1 (z-10, paling belakang) → foto (z-20, tengah) → word2 (z-30, paling depan).
        */}
        <div className="absolute inset-0">
          {/* word1 — paling belakang (z-10), upper-left, baseline ~40% dari top */}
          <motion.h2
            style={{ x: word1X, opacity: wordOpacity, zIndex: 10 }}
            className="absolute left-[4%] sm:left-[6%] top-[18%] sm:top-[20%] heading-editorial select-none font-black leading-[0.85] tracking-tight text-primary text-[18vw] sm:text-[15vw] lg:text-[13vw] whitespace-nowrap lowercase"
          >
            {data.word1}
          </motion.h2>

          {/* foto + byline — tengah (z-20), center-bottom */}
          <motion.div
            style={{ opacity: imgOpacity, zIndex: 20 }}
            className="absolute left-1/2 bottom-0 -translate-x-[50%]"
          >
            <div className={`relative w-[260px] h-[62svh] sm:w-[300px] sm:h-[68svh] lg:w-[360px] lg:h-[72svh] overflow-hidden flex items-end justify-center shrink-0 ${data.imageSrc ? "" : "bg-neutral-100 border border-dashed border-neutral-300 rounded-2xl"}`}>
              {data.imageSrc ? (
                <img src={data.imageSrc} alt={data.imageAlt} className="w-full h-full object-cover object-top" />
              ) : (
                <span className="text-xs text-neutral-400 px-4 text-center absolute top-1/2 -translate-y-1/2">Taruh foto {data.word1} di sini</span>
              )}
            </div>

            {data.byline && (
              <motion.span
                style={{ opacity: textOpacity }}
                className="absolute -right-[90px] sm:-right-[130px] top-[30%] text-[11px] sm:text-xs tracking-[0.2em] uppercase text-neutral-400 whitespace-nowrap hidden sm:block"
              >
                {data.byline}
              </motion.span>
            )}
          </motion.div>

          {/* word2 — paling depan (z-30), lower-right, top ~52% dari viewport */}
          <motion.h2
            style={{ x: word2X, opacity: wordOpacity, zIndex: 30 }}
            className="absolute right-[4%] sm:right-[6%] top-[55%] sm:top-[52%] heading-editorial select-none font-black leading-[0.85] tracking-tight text-primary text-[18vw] sm:text-[15vw] lg:text-[13vw] whitespace-nowrap text-right"
          >
            {data.word2}
          </motion.h2>
        </div>

        {/* tagline — kiri bawah + CTA */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute bottom-[8%] left-[5%] sm:left-[8%] max-w-[260px] z-40"
        >
          <p className="text-[12px] sm:text-[13px] text-neutral-500 leading-snug">{data.tagline}</p>
          <Link
            to="/tenses"
            className="group mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 hover:text-primary transition-colors"
          >
            Jelajahi {data.word1} Tenses
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Section tenses versi "pinned/sticky" ala Apple storytelling:
 * - Section ini punya tinggi total = jumlah kategori × SCROLL_VH_PER_ITEM (vh),
 *   supaya ada "jatah" scroll yang cukup untuk semua transisi.
 * - Di dalamnya ada wrapper `sticky top-0 h-[100svh]` yang nempel diam di layar
 *   selama user scroll di sepanjang tinggi section.
 * - Semua slide kategori ditumpuk absolute di dalam wrapper sticky itu; masing-masing
 *   slide masuk & keluar (berlawanan arah) berdasarkan posisi scrollYProgress
 *   di jatah segmennya sendiri — bukan animasi "sekali jalan".
 */
export function TenseSplitHero({ items }: { items: TenseHeroData[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"], // 0 = section baru mulai pin, 1 = section selesai di-pin
  });

  const segment = 1 / items.length;

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${items.length * SCROLL_VH_PER_ITEM}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-white light-scope border-t border-neutral-100">
        {items.map((data, i) => (
          <TenseHeroSlide key={data.key} data={data} index={i} scrollYProgress={scrollYProgress} segment={segment} />
        ))}
      </div>
    </section>
  );
}