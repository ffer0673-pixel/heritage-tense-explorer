import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CategoryKey = "present" | "past" | "future" | "past-future";

interface TenseProgress {
  exerciseDone: boolean;
  quizScore: number | null;
  completed: boolean;
}

interface StoryProgress {
  read: boolean;
  quizPassed: boolean;
}

interface ProgressState {
  tenses: Record<string, TenseProgress>;
  categoryQuiz: Record<CategoryKey, number | null>;
  finalAssessment: number | null;
  stories: Record<string, StoryProgress>;
  streak: number;
  setTenseQuiz: (slug: string, score: number) => void;
  setTenseExercise: (slug: string) => void;
  setCategoryQuiz: (cat: CategoryKey, score: number) => void;
  setFinal: (score: number) => void;
  markStoryRead: (slug: string) => void;
  markStoryQuiz: (slug: string) => void;
  reset: () => void;
}

const initial = {
  tenses: {} as Record<string, TenseProgress>,
  categoryQuiz: {
    present: null,
    past: null,
    future: null,
    "past-future": null,
  } as Record<CategoryKey, number | null>,
  finalAssessment: null as number | null,
  stories: {} as Record<string, StoryProgress>,
  streak: 0,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,
      setTenseQuiz: (slug, score) =>
        set((s) => ({
          tenses: {
            ...s.tenses,
            [slug]: {
              ...(s.tenses[slug] ?? { exerciseDone: false, quizScore: null, completed: false }),
              quizScore: score,
              completed: score >= 80,
            },
          },
          streak: s.streak + 1,
        })),
      setTenseExercise: (slug) =>
        set((s) => ({
          tenses: {
            ...s.tenses,
            [slug]: {
              ...(s.tenses[slug] ?? { exerciseDone: false, quizScore: null, completed: false }),
              exerciseDone: true,
            },
          },
        })),
      setCategoryQuiz: (cat, score) =>
        set((s) => ({ categoryQuiz: { ...s.categoryQuiz, [cat]: score } })),
      setFinal: (score) => set({ finalAssessment: score }),
      markStoryRead: (slug) =>
        set((s) => ({
          stories: {
            ...s.stories,
            [slug]: { ...(s.stories[slug] ?? { read: false, quizPassed: false }), read: true },
          },
        })),
      markStoryQuiz: (slug) =>
        set((s) => ({
          stories: {
            ...s.stories,
            [slug]: { ...(s.stories[slug] ?? { read: false, quizPassed: false }), quizPassed: true },
          },
        })),
      reset: () => set({ ...initial }),
    }),
    { name: "capgotense-progress" }
  )
);
