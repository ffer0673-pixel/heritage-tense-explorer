export type TenseCategory = 'Present' | 'Past' | 'Future' | 'Future in the Past';

export interface TenseData {
  /** Stable unique key, also used for anchor links / analytics */
  id: string;
  /** 1–16, drives the progress timeline + "01 / 16" counter */
  number: number;
  category: TenseCategory;
  /** e.g. "Present Simple" */
  title: string;
  /** e.g. "Subject + V1 / V(s)" */
  structure: string;
  /** One or two sentence explanation, kept short for the viewport */
  explanation: string;
  /** Example sentence — rendered word-by-word via AnimatedSentence */
  example: string;
  /** Large cultural photograph representing the tense's "feeling" */
  image: string;
  imageAlt: string;
}
