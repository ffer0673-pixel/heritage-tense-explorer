import { TENSES, type Tense } from "./tenses";// ambil TENSES type nya tense

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Template { //cetakan
  prompt: (subject: string, marker: string) => string;
  build: (forms: { v1: string; v3: string; ing: string; aux: string }) => string[]; // 4 options
  correctIndex: number;
  explain: (tenseName: string) => string;
}

// Verb pool — varied, NOT repeating lesson sentences.
// Each verb: [v1, v3, ing]
const VERBS: [string, string, string][] = [
  ["paint", "painted", "painting"],
  ["write", "written", "writing"],
  ["read", "read", "reading"],
  ["sing", "sung", "singing"],
  ["dance", "danced", "dancing"],
  ["bake", "baked", "baking"],
  ["fish", "fished", "fishing"],
  ["ride", "ridden", "riding"],
  ["climb", "climbed", "climbing"],
  ["plant", "planted", "planting"],
  ["clean", "cleaned", "cleaning"],
  ["repair", "repaired", "repairing"],
  ["photograph", "photographed", "photographing"],
  ["sketch", "sketched", "sketching"],
  ["polish", "polished", "polishing"],
  ["organise", "organised", "organising"],
  ["greet", "greeted", "greeting"],
  ["wrap", "wrapped", "wrapping"],
  ["taste", "tasted", "tasting"],
  ["deliver", "delivered", "delivering"],
];

const SUBJECTS_THIRD = ["My uncle", "The shopkeeper", "Mei", "The boat captain", "Pak Tan", "Bu Lina", "Andi", "The vendor"];
const SUBJECTS_PLURAL = ["The students", "We", "The dancers", "My cousins", "The volunteers", "The artists"];
const SUBJECTS_I_YOU = ["I", "You"];

const MARKERS: Record<string, string[]> = {
  "simple-present": ["every Saturday", "on weekends", "twice a week", "every morning", "on holidays"],
  "present-continuous": ["right now", "this afternoon", "at this moment", "today", "this evening"],
  "present-perfect": ["already", "just", "this week", "since last year", "recently"],
  "present-perfect-continuous": ["for two hours", "since dawn", "all morning", "for weeks", "lately"],
  "simple-past": ["last weekend", "yesterday", "in 2019", "two days ago", "last summer"],
  "past-continuous": ["at noon yesterday", "when the rain started", "all afternoon", "while we waited", "when she called"],
  "past-perfect": ["before lunch", "by the time we arrived", "before the festival", "by 2018", "before sunset"],
  "past-perfect-continuous": ["for two hours before the storm", "since morning", "for months by then", "for an hour before we met", "for weeks already"],
  "simple-future": ["tomorrow", "next month", "this weekend", "soon", "next year"],
  "future-continuous": ["at noon tomorrow", "this time next week", "all evening tomorrow", "during the festival", "at sunrise"],
  "future-perfect": ["by next Sunday", "by 2030", "before midnight", "by the end of the month", "by tomorrow"],
  "future-perfect-continuous": ["by next year for two months", "by 2030 for ten years", "by Sunday for a week", "by then for hours", "by evening all day"],
  "past-future": ["the next day", "later that week", "the following month", "soon after", "the day after"],
  "past-future-continuous": ["at noon the next day", "all that evening", "that morning", "during the parade", "that night"],
  "past-future-perfect": ["by the next day", "by that weekend", "before sunset", "by the time she arrived", "by the next month"],
  "past-future-perfect-continuous": ["for an hour by then", "for years by that day", "for weeks by the festival", "for months by then", "all day by evening"],
};

// One template per tense — produces grammatically-correct fill-in-the-blank
// where the correct form matches the tense and distractors are other tenses.
const TEMPLATES: Record<string, (s: string, m: string, v: [string, string, string], thirdPerson: boolean) => QuizQuestion> = {};

function makeOptions(correct: string, distractors: string[]): { options: string[]; idx: number } {
  const opts = [correct, ...distractors];
  // shuffle deterministic via simple swap so correct index is recorded
  // Use plain shuffle:
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return { options: opts, idx: opts.indexOf(correct) };
}

function q(
  id: string,
  prompt: string,
  correct: string,
  distractors: string[],
  explanation: string
): QuizQuestion {
  const { options, idx } = makeOptions(correct, distractors);
  return { id, prompt, options, correctIndex: idx, explanation };
}

const sx = (v: string) => (v.endsWith("s") || v.endsWith("sh") || v.endsWith("ch") ? v + "es" : v + "s");

TEMPLATES["simple-present"] = (s, m, v, third) => {
  const verb = third ? sx(v[0]) : v[0];
  const correct = `${s} ${verb} kue keranjang ${m}.`;
  return q(
    `sp-${s}-${v[0]}`,
    `Which sentence is in Simple Present?`,
    correct,
    [
      `${s} ${v[1]} kue keranjang ${m}.`,
      `${s} ${third ? "is" : "am"} ${v[2]} kue keranjang ${m}.`,
      `${s} will ${v[0]} kue keranjang ${m}.`,
    ],
    `Simple Present uses V1 (+s/es for third-person singular) for habits and repeated actions like "${m}".`
  );
};

TEMPLATES["present-continuous"] = (s, m, v, third) => {
  const be = third ? "is" : s === "I" ? "am" : "are";
  const correct = `${s} ${be} ${v[2]} lanterns at Pasar Lama ${m}.`;
  return q(
    `pc-${s}-${v[0]}`,
    `Which sentence is in Present Continuous?`,
    correct,
    [
      `${s} ${third ? sx(v[0]) : v[0]} lanterns at Pasar Lama ${m}.`,
      `${s} ${v[1]} lanterns at Pasar Lama ${m}.`,
      `${s} ${third ? "has" : "have"} ${v[1]} lanterns at Pasar Lama ${m}.`,
    ],
    `Present Continuous = am/is/are + V-ing for actions happening "${m}".`
  );
};

TEMPLATES["present-perfect"] = (s, m, v, third) => {
  const aux = third ? "has" : "have";
  const correct = `${s} ${aux} ${v[1]} a temple roof ${m}.`;
  return q(
    `pp-${s}-${v[0]}`,
    `Which sentence is in Present Perfect?`,
    correct,
    [
      `${s} ${aux} been ${v[2]} a temple roof ${m}.`,
      `${s} ${third ? sx(v[0]) : v[0]} a temple roof ${m}.`,
      `${s} ${third ? "was" : "were"} ${v[2]} a temple roof ${m}.`,
    ],
    `Present Perfect = have/has + V3, often with "${m}".`
  );
};

TEMPLATES["present-perfect-continuous"] = (s, m, v, third) => {
  const aux = third ? "has" : "have";
  const correct = `${s} ${aux} been ${v[2]} dim sum ${m}.`;
  return q(
    `ppc-${s}-${v[0]}`,
    `Which sentence is in Present Perfect Continuous?`,
    correct,
    [
      `${s} ${aux} ${v[1]} dim sum ${m}.`,
      `${s} ${third ? "is" : "am"} ${v[2]} dim sum ${m}.`,
      `${s} ${third ? sx(v[0]) : v[0]} dim sum ${m}.`,
    ],
    `Present Perfect Continuous = have/has + been + V-ing, emphasising duration "${m}".`
  );
};

TEMPLATES["simple-past"] = (s, m, v) => {
  const correct = `${s} ${v[1]} dodol at the night market ${m}.`;
  return q(
    `spast-${s}-${v[0]}`,
    `Which sentence is in Simple Past?`,
    correct,
    [
      `${s} ${v[0]}s dodol at the night market ${m}.`,
      `${s} has ${v[1]} dodol at the night market ${m}.`,
      `${s} will ${v[0]} dodol at the night market ${m}.`,
    ],
    `Simple Past uses V2 for completed actions at a specific past time like "${m}".`
  );
};

TEMPLATES["past-continuous"] = (s, m, v, third) => {
  const aux = third || s === "I" ? "was" : "were";
  const correct = `${s} ${aux} ${v[2]} jasmine flowers ${m}.`;
  return q(
    `pcont-${s}-${v[0]}`,
    `Which sentence is in Past Continuous?`,
    correct,
    [
      `${s} ${v[1]} jasmine flowers ${m}.`,
      `${s} ${third ? "is" : "are"} ${v[2]} jasmine flowers ${m}.`,
      `${s} had ${v[1]} jasmine flowers ${m}.`,
    ],
    `Past Continuous = was/were + V-ing for actions in progress "${m}".`
  );
};

TEMPLATES["past-perfect"] = (s, m, v) => {
  const correct = `${s} had ${v[1]} the courtyard ${m}.`;
  return q(
    `ppast-${s}-${v[0]}`,
    `Which sentence is in Past Perfect?`,
    correct,
    [
      `${s} ${v[1]} the courtyard ${m}.`,
      `${s} has ${v[1]} the courtyard ${m}.`,
      `${s} was ${v[2]} the courtyard ${m}.`,
    ],
    `Past Perfect = had + V3 for an action completed before another past moment ("${m}").`
  );
};

TEMPLATES["past-perfect-continuous"] = (s, m, v) => {
  const correct = `${s} had been ${v[2]} jamu ${m}.`;
  return q(
    `ppcont-${s}-${v[0]}`,
    `Which sentence is in Past Perfect Continuous?`,
    correct,
    [
      `${s} had ${v[1]} jamu ${m}.`,
      `${s} has been ${v[2]} jamu ${m}.`,
      `${s} was ${v[2]} jamu ${m}.`,
    ],
    `Past Perfect Continuous = had + been + V-ing — duration before a past point ("${m}").`
  );
};

TEMPLATES["simple-future"] = (s, m, v) => {
  const correct = `${s} will ${v[0]} a heritage tour ${m}.`;
  return q(
    `sf-${s}-${v[0]}`,
    `Which sentence is in Simple Future?`,
    correct,
    [
      `${s} ${v[1]} a heritage tour ${m}.`,
      `${s} will be ${v[2]} a heritage tour ${m}.`,
      `${s} have ${v[1]} a heritage tour ${m}.`,
    ],
    `Simple Future = will + V1 for predictions and plans like "${m}".`
  );
};

TEMPLATES["future-continuous"] = (s, m, v) => {
  const correct = `${s} will be ${v[2]} along the riverside ${m}.`;
  return q(
    `fc-${s}-${v[0]}`,
    `Which sentence is in Future Continuous?`,
    correct,
    [
      `${s} will ${v[0]} along the riverside ${m}.`,
      `${s} will have ${v[1]} along the riverside ${m}.`,
      `${s} is ${v[2]} along the riverside ${m}.`,
    ],
    `Future Continuous = will + be + V-ing — an action in progress at a future moment ("${m}").`
  );
};

TEMPLATES["future-perfect"] = (s, m, v) => {
  const correct = `${s} will have ${v[1]} the new mural ${m}.`;
  return q(
    `fp-${s}-${v[0]}`,
    `Which sentence is in Future Perfect?`,
    correct,
    [
      `${s} will ${v[0]} the new mural ${m}.`,
      `${s} will be ${v[2]} the new mural ${m}.`,
      `${s} has ${v[1]} the new mural ${m}.`,
    ],
    `Future Perfect = will + have + V3 for actions completed before a future point ("${m}").`
  );
};

TEMPLATES["future-perfect-continuous"] = (s, m, v) => {
  const correct = `${s} will have been ${v[2]} ${m}.`;
  return q(
    `fpc-${s}-${v[0]}`,
    `Which sentence is in Future Perfect Continuous?`,
    correct,
    [
      `${s} will have ${v[1]} ${m}.`,
      `${s} will be ${v[2]} ${m}.`,
      `${s} has been ${v[2]} ${m}.`,
    ],
    `Future Perfect Continuous = will + have + been + V-ing — duration up to a future point.`
  );
};

TEMPLATES["past-future"] = (s, m, v) => {
  const correct = `${s} said ${s.toLowerCase()} would ${v[0]} the temple ${m}.`;
  return q(
    `pf-${s}-${v[0]}`,
    `Which sentence is in Past Future?`,
    correct,
    [
      `${s} said ${s.toLowerCase()} will ${v[0]} the temple ${m}.`,
      `${s} said ${s.toLowerCase()} had ${v[1]} the temple ${m}.`,
      `${s} said ${s.toLowerCase()} was ${v[2]} the temple ${m}.`,
    ],
    `Past Future uses "would + V1" to express a future seen from a past moment.`
  );
};

TEMPLATES["past-future-continuous"] = (s, m, v) => {
  const correct = `${s} said ${s.toLowerCase()} would be ${v[2]} ${m}.`;
  return q(
    `pfcont-${s}-${v[0]}`,
    `Which sentence is in Past Future Continuous?`,
    correct,
    [
      `${s} said ${s.toLowerCase()} would ${v[0]} ${m}.`,
      `${s} said ${s.toLowerCase()} will be ${v[2]} ${m}.`,
      `${s} said ${s.toLowerCase()} was ${v[2]} ${m}.`,
    ],
    `Past Future Continuous = would + be + V-ing — action in progress at a future moment from a past viewpoint.`
  );
};

TEMPLATES["past-future-perfect"] = (s, m, v) => {
  const correct = `${s} thought ${s.toLowerCase()} would have ${v[1]} the article ${m}.`;
  return q(
    `pfp-${s}-${v[0]}`,
    `Which sentence is in Past Future Perfect?`,
    correct,
    [
      `${s} thought ${s.toLowerCase()} would ${v[0]} the article ${m}.`,
      `${s} thought ${s.toLowerCase()} will have ${v[1]} the article ${m}.`,
      `${s} thought ${s.toLowerCase()} had ${v[1]} the article ${m}.`,
    ],
    `Past Future Perfect = would + have + V3 — completed before a future point, viewed from the past.`
  );
};

TEMPLATES["past-future-perfect-continuous"] = (s, m, v) => {
  const correct = `${s} believed ${s.toLowerCase()} would have been ${v[2]} ${m}.`;
  return q(
    `pfpc-${s}-${v[0]}`,
    `Which sentence is in Past Future Perfect Continuous?`,
    correct,
    [
      `${s} believed ${s.toLowerCase()} would have ${v[1]} ${m}.`,
      `${s} believed ${s.toLowerCase()} will have been ${v[2]} ${m}.`,
      `${s} believed ${s.toLowerCase()} had been ${v[2]} ${m}.`,
    ],
    `Past Future Perfect Continuous = would + have + been + V-ing — duration up to a future point, from a past viewpoint.`
  );
};

function pronounLower(s: string): string {
  if (s === "I") return "I";
  if (s === "You") return "you";
  if (s === "We") return "we";
  // Use he/she/they appropriately — but to keep grammar safe we use lowercase first word
  return s.toLowerCase();
}

// Override .toLowerCase() in templates by patching with pronounLower where it matters.
// (We'll just leave the simpler form — for "Mei said Mei would..." it still reads ok in quiz context.)
// To make it nicer, post-process subject => pronoun for reported speech tenses.
function reportedPronoun(s: string): string {
  if (s === "I") return "I";
  if (s === "You") return "you";
  if (s === "We") return "we";
  if (SUBJECTS_PLURAL.includes(s)) return "they";
  return "she"; // default singular
}

function fixReported(text: string, s: string): string {
  return text.replaceAll(s.toLowerCase(), reportedPronoun(s));
}

function generateQuestions(tense: Tense, count = 20): QuizQuestion[] {
  const tpl = TEMPLATES[tense.slug];
  const markers = MARKERS[tense.slug];
  const out: QuizQuestion[] = [];
  let i = 0;
  while (out.length < count) {
    const v = VERBS[i % VERBS.length];
    const marker = markers[i % markers.length];
    const pool = i % 3 === 0 ? SUBJECTS_I_YOU : i % 3 === 1 ? SUBJECTS_THIRD : SUBJECTS_PLURAL;
    const s = pool[i % pool.length];
    const third = SUBJECTS_THIRD.includes(s);
    let qq = tpl(s, marker, v, third);
    if (tense.category === "past-future") {
      qq = {
        ...qq,
        options: qq.options.map((o) => fixReported(o, s)),
      };
      // recompute correctIndex unchanged (same shuffle), text is just patched
    }
    qq.id = `${tense.slug}-${out.length}`;
    out.push(qq);
    i++;
  }
  return out;
}

// Generate at module load — same fixed set per tense for the session.
export const QUIZZES: Record<string, QuizQuestion[]> = Object.fromEntries(
  TENSES.map((t) => [t.slug, generateQuestions(t, 20)])
);

// Category quizzes: 20 questions sampled across the 4 sub-tenses
export const CATEGORY_QUIZZES: Record<string, QuizQuestion[]> = {
  present: [],
  past: [],
  future: [],
  "past-future": [],
};
for (const cat of Object.keys(CATEGORY_QUIZZES)) {
  const tenses = TENSES.filter((t) => t.category === cat);
  const pool: QuizQuestion[] = [];
  tenses.forEach((t) => pool.push(...QUIZZES[t.slug].slice(0, 5)));
  CATEGORY_QUIZZES[cat] = pool;
}

export const FINAL_QUIZ: QuizQuestion[] = TENSES.flatMap((t) =>
  QUIZZES[t.slug].slice(0, 2)
);

export interface QuizMeta {
  id: string;
  title: string;
  subtitle: string;
  type: "tense" | "category" | "final";
  tenseSlug?: string;
  categoryKey?: string;
}

export const ALL_QUIZZES: QuizMeta[] = [
  ...TENSES.map<QuizMeta>((t) => ({
    id: `tense-${t.slug}`,
    title: t.name,
    subtitle: `${t.indonesian} • 20 questions`,
    type: "tense",
    tenseSlug: t.slug,
  })),
  ...(["present", "past", "future", "past-future"] as const).map<QuizMeta>((k) => ({
    id: `category-${k}`,
    title: `${k === "past-future" ? "Past Future" : k[0].toUpperCase() + k.slice(1)} Category Quiz`,
    subtitle: `Mixed practice • 20 questions`,
    type: "category",
    categoryKey: k,
  })),
  {
    id: "final-assessment",
    title: "Final Assessment",
    subtitle: "All 16 tenses • 32 questions",
    type: "final",
  },
];

export function getQuestionsFor(quizId: string): QuizQuestion[] {
  if (quizId.startsWith("tense-")) return QUIZZES[quizId.slice(6)] ?? [];
  if (quizId.startsWith("category-")) return CATEGORY_QUIZZES[quizId.slice(9)] ?? [];
  if (quizId === "final-assessment") return FINAL_QUIZ;
  return [];
}
