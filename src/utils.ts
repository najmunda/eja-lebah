export function countWordScore(word: string): number {
  if (word.length === 4) return 1;
  if (new Set(word).size === 7) return word.length + 7;
  return word.length;
}

export function sql(strings: TemplateStringsArray): string {
  return strings[0];
}
