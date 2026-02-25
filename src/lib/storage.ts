"use client";

import type { ResultAttempt, SessionState, StudyContent } from "@/lib/types";

const SESSION_KEY = "neuroflow.session.v1";
const RESULTS_KEY = "neuroflow.results.v1";

export const defaultSessionState = (): SessionState => ({
  content: null,
  source: null,
  rawInput: "",
  importedAt: null,
  mode: "adhd",
  dyslexiaLargeText: false,
  readingFontSize: "base",
  readingLetterSpacing: "normal",
  highContrast: false,
  currentSectionIndex: 0,
  completedSections: [],
  sectionTests: {},
  finalTest: null
});

const hasWindow = () => typeof window !== "undefined";

function readJson<T>(key: string): T | null {
  if (!hasWindow()) {
    return null;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!hasWindow()) {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadSession(): SessionState {
  const saved = readJson<SessionState>(SESSION_KEY);
  if (!saved) {
    return defaultSessionState();
  }

  return {
    ...defaultSessionState(),
    ...saved,
    sectionTests: saved.sectionTests ?? {},
    completedSections: Array.isArray(saved.completedSections) ? saved.completedSections : []
  };
}

export function saveSession(session: SessionState): void {
  writeJson(SESSION_KEY, session);
}

export function updateSession(updater: (current: SessionState) => SessionState): SessionState {
  const next = updater(loadSession());
  saveSession(next);
  return next;
}

export function resetSession(): void {
  if (!hasWindow()) {
    return;
  }
  window.localStorage.removeItem(SESSION_KEY);
}

export function seedSessionWithContent(content: StudyContent, source: "demo" | "import", rawInput: string): SessionState {
  const current = loadSession();
  const next: SessionState = {
    ...defaultSessionState(),
    mode: current.mode,
    dyslexiaLargeText: current.dyslexiaLargeText,
    readingFontSize: current.readingFontSize,
    readingLetterSpacing: current.readingLetterSpacing,
    highContrast: current.highContrast,
    content,
    source,
    rawInput,
    importedAt: new Date().toISOString()
  };
  saveSession(next);
  return next;
}

export function hasContentInSession(): boolean {
  return Boolean(loadSession().content);
}

export function loadResults(): ResultAttempt[] {
  const results = readJson<ResultAttempt[]>(RESULTS_KEY);
  return Array.isArray(results) ? results : [];
}

export function saveResultAttempt(attempt: ResultAttempt): void {
  const results = loadResults();
  writeJson(RESULTS_KEY, [attempt, ...results]);
}

export function clearResults(): void {
  if (!hasWindow()) {
    return;
  }
  window.localStorage.removeItem(RESULTS_KEY);
}
