import type { ReadingFontSize, ReadingLetterSpacing, SessionState } from "@/lib/types";

export function fontSizeClass(size: ReadingFontSize): string {
  switch (size) {
    case "large":
      return "text-lg";
    case "xlarge":
      return "text-xl";
    default:
      return "text-base";
  }
}

export function letterSpacingClass(spacing: ReadingLetterSpacing): string {
  switch (spacing) {
    case "wide":
      return "tracking-wide";
    case "wider":
      return "tracking-widest";
    default:
      return "tracking-normal";
  }
}

export function lineHeightClass(session: SessionState): string {
  if (session.mode === "dyslexia") {
    return session.dyslexiaLargeText ? "leading-10" : "leading-9";
  }
  return "leading-8";
}

export function readingTextClass(session: SessionState): string {
  return [fontSizeClass(session.readingFontSize), letterSpacingClass(session.readingLetterSpacing), lineHeightClass(session)]
    .join(" ")
    .trim();
}

export function cardThemeClass(session: SessionState): string {
  if (session.highContrast) {
    return "border-calm-800 bg-white";
  }
  return session.mode === "dyslexia" ? "border-warm-200 bg-warm-50" : "border-calm-200 bg-white";
}
