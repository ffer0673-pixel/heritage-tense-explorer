export interface ReferenceItem {
  title: string;
  url?: string;
  note?: string;
}
export interface ReferenceGroup {
  category: string;
  items: ReferenceItem[];
}

export const REFERENCES: ReferenceGroup[] = [
  {
    category: "Grammar Sources",
    items: [
      { title: "Cambridge Dictionary — English Grammar", url: "https://dictionary.cambridge.org/grammar/" },
      { title: "British Council — Learn English Grammar", url: "https://learnenglish.britishcouncil.org/grammar" },
      { title: "Oxford Learner's Dictionaries — Grammar", url: "https://www.oxfordlearnersdictionaries.com/grammar/" },
      { title: "Murphy, Raymond. English Grammar in Use. Cambridge University Press." },
    ],
  },
  {
    category: "Cultural Sources",
    items: [
      { title: "Museum Benteng Heritage — Official site", url: "https://bentengheritage.com/" },
      { title: "Disparbud Kota Tangerang — Culture & Tourism", note: "Local government tourism resources for Tangerang." },
      { title: "Cina Benteng — Wikipedia", url: "https://en.wikipedia.org/wiki/Cina_Benteng" },
      { title: "Tempo & Kompas archive articles on Pasar Lama and Cap Go Meh in Tangerang" },
    ],
  },
  {
    category: "Image Credits",
    items: [
      { title: "Illustrative emoji & icon glyphs by Lucide and the Unicode Consortium" },
      { title: "All custom illustrations and photography generated specifically for this project." },
    ],
  },
  {
    category: "Tools & Technologies",
    items: [
      { title: "React 19 + TanStack Start", url: "https://tanstack.com/start" },
      { title: "Vite 7", url: "https://vitejs.dev/" },
      { title: "Tailwind CSS v4", url: "https://tailwindcss.com/" },
      { title: "Framer Motion", url: "https://www.framer.com/motion/" },
      { title: "Lenis smooth scroll", url: "https://github.com/darkroomengineering/lenis" },
      { title: "Zustand state management", url: "https://github.com/pmndrs/zustand" },
      { title: "Lucide React icons", url: "https://lucide.dev/" },
    ],
  },
];
