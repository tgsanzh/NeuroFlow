export function chunkTextIntoParagraphs(text: string, maxSentences = 2): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [];
  }

  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length <= maxSentences) {
    return [normalized];
  }

  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += maxSentences) {
    chunks.push(sentences.slice(i, i + maxSentences).join(" "));
  }
  return chunks;
}
