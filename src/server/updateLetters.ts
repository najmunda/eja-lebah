import { countWordScore, sql } from "../utils.js";
import { getRandomInt } from "./utils.js";
import db from "./db.js";

const selectWordsStatement = db.prepare(sql`
  SELECT DISTINCT
    word
  FROM
    Word
  WHERE
    length(word) >= 4 -- Answer min length
    AND REGEXP ('^[a-z]+$', word) = 1 -- Only contains alphabet
    AND instr(word, ?) > 0 -- Must contain key letter
    AND REGEXP (?, word) = 1;
`);

const selectLetterByCreateDateStatement = db.prepare(sql`
  SELECT
    key_letter,
    letters,
    words,
    word_count,
    max_score,
    create_date
  FROM
    Letter
  WHERE
    create_date = ?;
`);

const selectRandomLetterByCreateDateStatement = db.prepare(sql`
  SELECT
    key_letter,
    letters,
    words,
    word_count,
    max_score,
    create_date
  FROM
    Letter
  WHERE
    create_date NOT BETWEEN DATE(?, '-1 day') AND DATE(?, '+1 day')
  ORDER BY
    RANDOM()
  LIMIT
    1;
`);

const insertLettersStatement = db.prepare(sql`
  INSERT INTO
    Letter (
      key_letter,
      letters,
      words,
      word_count,
      max_score,
      create_date
    )
  VALUES
    (?, ?, ?, ?, ?, ?)
  ON CONFLICT (create_date) DO UPDATE
  SET
    create_date = create_date
  RETURNING
    key_letter,
    letters,
    words,
    word_count,
    max_score,
    create_date;
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
  const letter = selectLetterByCreateDateStatement.get(createDate);
  if (letter) return letter;
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
    return insertLettersStatement.get(
      keyLetter,
      otherLetters,
      wordsJSON,
      words.length,
      maxScore,
      createDate,
    );
  } else {
    const randomLetter = selectRandomLetterByCreateDateStatement.get(
      createDate,
      createDate,
    );
    return insertLettersStatement.get(
      randomLetter["key_letter"],
      randomLetter["letters"],
      randomLetter["words"],
      randomLetter["word_count"],
      randomLetter["max_score"],
      createDate,
    );
  }
}
