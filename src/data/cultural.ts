export interface CulturalCard {
  slug: string;
  title: string;
  short: string;
  exampleEn: string;
  tense: string;
  tenseSlug: string;
  extended: string;
  extraExamples: { en: string; tense: string }[];
  emoji: string;
  image?: string;
}

export const CULTURAL_CARDS: CulturalCard[] = [
  {
    slug: "benteng-heritage",
    title: "Benteng Heritage",
    short: "The historic Cina-Benteng quarter and Museum Benteng tell centuries of Tangerang's Peranakan story.",
    exampleEn: "The museum has preserved Cina-Benteng heritage for many generations.",
    tense: "Present Perfect",
    tenseSlug: "present-perfect",
    extended:
      "Museum Benteng Heritage occupies a beautifully restored Cina-Benteng house in Pasar Lama. Its collection reveals how Chinese settlers shaped Tangerang since the 17th century — from architecture to wedding rituals.",
    extraExamples: [
      { en: "Visitors are walking through the old courtyard today.", tense: "Present Continuous" },
      { en: "The Dutch built a fort here in the 1600s.", tense: "Simple Past" },
    ],
    emoji: "🏛️",
   image: "/bentenghirarci.png",
  },
  {
    slug: "pasar-lama",
    title: "Pasar Lama",
    short: "Tangerang's oldest market — a buzzing mix of street food, heritage shops, and lantern-lit nights.",
    exampleEn: "Pasar Lama opens every evening with stalls full of laksa and dim sum.",
    tense: "Simple Present",
    tenseSlug: "simple-present",
    extended:
      "Pasar Lama is the heart of nighttime Tangerang. From dusk, the street fills with the aroma of laksa, the sizzle of dim sum, and the glow of red lanterns over century-old shophouses.",
    extraExamples: [
      { en: "Vendors are setting up their stalls right now.", tense: "Present Continuous" },
      { en: "We will try the famous laksa at Pasar Lama tomorrow.", tense: "Simple Future" },
    ],
    emoji: "🏮",
    image: "/pasarlama.png",
  },
  {
    slug: "sungai-cisadane",
    title: "Sungai Cisadane",
    short: "The river that shaped Tangerang — from colonial trade routes to today's riverside promenades.",
    exampleEn: "Families are walking along the Cisadane promenade this evening.",
    tense: "Present Continuous",
    tenseSlug: "present-continuous",
    extended:
      "The Cisadane River has carried boats, traders, and stories for centuries. Today its banks host morning runners, sunset markets, and the iconic Jembatan Berendeng — a meeting point for old and new Tangerang.",
    extraExamples: [
      { en: "The river had supported trade long before the railways arrived.", tense: "Past Perfect" },
      { en: "By 2030, Tangerang will have transformed its riverside.", tense: "Future Perfect" },
    ],
    emoji: "🌊",
    image: "/sungaicisadane.png",
  },
  {
    slug: "kuliner-tangerang",
    title: "Kuliner Tangerang",
    short: "Laksa, sayur besan, nasi sumsum, dodol — every dish carries a piece of Peranakan history.",
    exampleEn: "I have tried laksa Tangerang at three different stalls this week.",
    tense: "Present Perfect",
    tenseSlug: "present-perfect",
    extended:
      "Tangerang cuisine blends Sundanese, Chinese, and Betawi influences. Laksa Tangerang's coconut-coriander broth, sayur besan from Peranakan weddings, and chewy dodol are local must-tries.",
    extraExamples: [
      { en: "My grandmother used to cook sayur besan for every wedding.", tense: "Simple Past" },
      { en: "We will eat nasi sumsum for breakfast tomorrow.", tense: "Simple Future" },
    ],
    emoji: "🍜",
    image: "/kulinertangerang.png",
  },
  {
    slug: "budaya-cina-benteng",
    title: "Budaya Cina Benteng",
    short: "A unique Peranakan community that has called Tangerang home for over five centuries.",
    exampleEn: "Cina-Benteng families have celebrated Cap Go Meh in Tangerang for centuries.",
    tense: "Present Perfect",
    tenseSlug: "present-perfect",
    extended:
      "Cina Benteng (literally 'Chinese of the Fort') are descendants of Chinese settlers who arrived as early as the 1400s. They speak Indonesian and Sundanese, wear local dress, and have crafted a distinctive Peranakan identity.",
    extraExamples: [
      { en: "The community is preparing for Cap Go Meh right now.", tense: "Present Continuous" },
      { en: "By next year, the temple will have hosted thousands of pilgrims.", tense: "Future Perfect" },
    ],
    emoji: "🎎",
    image: "/budayacinabenteng.png"
  },
];
