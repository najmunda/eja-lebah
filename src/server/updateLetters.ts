import db from "./db.js";

const whereClause = `
  WHERE 
    length(word) >= 4 -- Answer min length
    AND regexp('^[a-z]+$', word) = 1 -- Only contains alphabet
    AND instr(word, ?) > 0 -- Must contain key letter
    AND regexp(?, word) = 1
`;

const getWordCountStatement = db.prepare(`
  SELECT COUNT(DISTINCT word) AS word_count
  FROM Word 
  ${whereClause}
  ;
`);

const getWordsStatement = db.prepare(`
  SELECT DISTINCT word
  FROM Word 
  ${whereClause}
  ;
`);

const insertLettersStatement = db.prepare(`
  INSERT INTO Letter (key_letter, letters, words, word_count, max_score) VALUES (?, ?, ?, ?, ?);
`);

function getRandomLetters() {
  const LETTERS_TOTAL = 7;
  const VOCAL_TOTAL = 2;

  const vocalLetters = "aiueo";
  const consonantLetters = "bcdfghjklmnpqrstvwxyz";
  let chosenLetters = "";

  let i = 1;
  while (i <= VOCAL_TOTAL) {
    const randomIndex = Math.floor(Math.random() * vocalLetters.length);
    const randomVocal = vocalLetters[randomIndex];
    if (chosenLetters.includes(randomVocal)) continue;
    chosenLetters += randomVocal;
    i++;
  }
  while (i <= LETTERS_TOTAL) {
    const randomIndex = Math.floor(Math.random() * consonantLetters.length);
    const randomConsonant = consonantLetters[randomIndex];
    if (chosenLetters.includes(randomConsonant)) continue;
    chosenLetters += randomConsonant;
    i++;
  }

  const randomIndex = Math.floor(Math.random() * LETTERS_TOTAL);
  const keyLetter = chosenLetters[randomIndex];
  const includeAllLettersRegex = `\\b[${chosenLetters}]+\\b`;
  chosenLetters = chosenLetters.replace(keyLetter, "");
  const wordCount = getWordCountStatement.get(
    keyLetter,
    includeAllLettersRegex,
  )["word_count"];

  return [keyLetter, chosenLetters, includeAllLettersRegex, wordCount];
}

export default function updateLettersAndAnswers() {
  const ANSWER_TOTAL_MIN = 10;
  let wordCount = 0;
  let keyLetter, chosenLetters, includeAllLettersRegex;
  while (wordCount < ANSWER_TOTAL_MIN) {
    [keyLetter, chosenLetters, includeAllLettersRegex, wordCount] =
      getRandomLetters();
  }
  const words = getWordsStatement
    .all(keyLetter, includeAllLettersRegex)
    .map((row) => row.word);
  const wordsJSON = JSON.stringify(words);
  const maxScore = words.reduce(
    (totalLength, word) => totalLength + word.length,
    0,
  );
  insertLettersStatement.run(
    keyLetter,
    chosenLetters,
    wordsJSON,
    wordCount,
    maxScore,
  );
}
