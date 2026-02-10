import { countWordScore } from "../utils.js";
import { getRandomInt } from "./utils.js";
import db from "./db.js";

const selectWordsStatement = db.prepare(`
  SELECT DISTINCT word
  FROM Word
  WHERE 
    length(word) >= 4 -- Answer min length
    AND regexp('^[a-z]+$', word) = 1 -- Only contains alphabet
    AND instr(word, ?) > 0 -- Must contain key letter
    AND regexp(?, word) = 1
  ;
`);

export const selectLastLetterStatement = db.prepare(`
  SELECT key_letter, letters, words, word_count, max_score, create_date FROM Letter ORDER BY id DESC LIMIT 1;
`);

export const selectLetterByCreateDateStatement = db.prepare(`
  SELECT key_letter, letters, words, word_count, max_score, create_date FROM Letter WHERE create_date = ?;
`);

const selectLastLetterIdStatement = db.prepare(
  `SELECT seq FROM sqlite_sequence WHERE name = 'Letter';`,
);

const insertLettersStatement = db.prepare(`
  INSERT INTO Letter (key_letter, letters, words, word_count, max_score, create_date) VALUES (?, ?, ?, ?, ?, ?);
`);

const insertPrevLetterStatement = db.prepare(`
  INSERT INTO Letter (key_letter, letters, words, word_count, max_score, create_date)
  SELECT key_letter, letters, words, word_count, max_score, ? AS create_date FROM Letter WHERE id = ?;
`);

function getRandomLetters() {
  const LETTERS_TOTAL = 7;
  const VOCAL_TOTAL = getRandomInt(2, 3);

  const vocalLetters = "aiueo";
  const consonantLetters = "bcdfghjklmnpqrstvwxyz";
  let chosenLetters = "";

  let i = 1;
  while (i <= VOCAL_TOTAL) {
    const randomIndex = getRandomInt(0, vocalLetters.length - 1);
    const randomVocal = vocalLetters[randomIndex];
    if (chosenLetters.includes(randomVocal)) continue;
    chosenLetters += randomVocal;
    i++;
  }
  while (i <= LETTERS_TOTAL) {
    const randomIndex = getRandomInt(0, consonantLetters.length - 1);
    const randomConsonant = consonantLetters[randomIndex];
    if (chosenLetters.includes(randomConsonant)) continue;
    chosenLetters += randomConsonant;
    i++;
  }

  const randomIndex = getRandomInt(0, LETTERS_TOTAL - 1);
  const keyLetter = chosenLetters[randomIndex];
  const includeAllLettersRegex = `\\b[${chosenLetters}]+\\b`;
  const otherLetters = chosenLetters.replace(keyLetter, "");
  const words = selectWordsStatement
    .all(keyLetter, includeAllLettersRegex)
    .map((row: { word: string }) => row.word);

  return { keyLetter, otherLetters, words };
}

export default function updateLettersAndAnswers(createDate: string) {
  const ANSWER_TOTAL_MIN = 10;
  const LOOP_LIMIT = 100;
  let words = [];
  let keyLetter, otherLetters;
  let loopCount = 0;
  while (
    words.length < ANSWER_TOTAL_MIN ||
    new Set(words.join("")).size !== 7
  ) {
    ({ keyLetter, otherLetters, words } = getRandomLetters());
    loopCount++;
    if (loopCount >= LOOP_LIMIT) break;
  }
  if (loopCount < LOOP_LIMIT) {
    const wordsJSON = JSON.stringify(words);
    const maxScore = words.reduce(
      (currScore: number, word: string) => currScore + countWordScore(word),
      0,
    );
    insertLettersStatement.run(
      keyLetter,
      otherLetters,
      wordsJSON,
      words.length,
      maxScore,
      createDate,
    );
  } else {
    const { seq: lastLetterId } = selectLastLetterIdStatement.get();
    const randomId = getRandomInt(1, lastLetterId - 1);
    insertPrevLetterStatement.run(createDate, randomId);
  }
}
