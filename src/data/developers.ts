export interface Developer {// export =  izin kan file lain menggunakan file ini ,interface = Membuat aturan atau blueprint sebuah object.,developer = nama interface nya, {}Isi aturan dimulai dari sini.
  name: string;
  role: string;
  bio: string;
  initials: string;
  gradient: string;
  image?: string; // ? = blueprint ini artinya boleh ada boleh tidak image nya, contoh yg di bawah role
}

export const DEVELOPERS: Developer[] = [ // Jadi setiap object di dalam DEVELOPERS harus mengikuti blueprint itu.,[] Array yang isinya banyak object Developer.
  {
    name: "Ferdian",
    role: "Engineering lead",
    image: "/ferdian.png",
    bio: "Crafts the visual identity of Tenses Around Us — blending modern SaaS polish with Tangerang's heritage warmth.",
    initials: "",
    gradient: "from-[oklch(0.6_0.18_258)] to-[oklch(0.78_0.14_65)]",
  },
  {
    name: "Nursyahidah Hanifah",
    role: "Curriculum Lead",
    bio: "Maps every tense to a story from Pasar Lama, Cisadane, and the Cina-Benteng community.",
    initials: "",
    gradient: "from-[oklch(0.7_0.16_30)] to-[oklch(0.55_0.19_258)]",
  },
  {
    name: "Novita anggraini",
    role: "Lead Designer",
    bio: "Builds the smooth-scrolling, animation-rich experience that makes learning tenses feel premium.",
    initials: "",
    gradient: "from-[oklch(0.6_0.16_180)] to-[oklch(0.55_0.19_258)]",
  },
];
