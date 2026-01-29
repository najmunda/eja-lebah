export function countWordScore(word: string): number {
  if (word.length === 4) return 1;
  if (new Set(word).size === 7) return word.length + 7;
  return word.length;
}

export function getRandomInt(min, max): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
