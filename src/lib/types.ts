export type ReaderMode = "adhd" | "dyslexia";
export type ReadingFontSize = "base" | "large" | "xlarge";
export type ReadingLetterSpacing = "normal" | "wide" | "wider";

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  fact: string;
}

export interface ContentSection {
  title: string;
  content: string;
  key_points?: string[];
  mini_test: QuizQuestion[];
}

export interface StudyContent {
  overall_title: string;
  sections: ContentSection[];
  final_test: QuizQuestion[];
}

export interface SectionTestState {
  answers: number[];
  submitted: boolean;
  score: number;
}

export interface FinalTestState {
  answers: number[];
  submitted: boolean;
  score: number;
}

export interface SessionState {
  content: StudyContent | null;
  source: "demo" | "import" | null;
  rawInput: string;
  importedAt: string | null;
  mode: ReaderMode;
  dyslexiaLargeText: boolean;
  readingFontSize: ReadingFontSize;
  readingLetterSpacing: ReadingLetterSpacing;
  highContrast: boolean;
  currentSectionIndex: number;
  completedSections: number[];
  sectionTests: Record<string, SectionTestState>;
  finalTest: FinalTestState | null;
}

export interface ResultAttempt {
  id: string;
  timestamp: string;
  mode: ReaderMode;
  score: number;
  total: number;
  title: string;
}
