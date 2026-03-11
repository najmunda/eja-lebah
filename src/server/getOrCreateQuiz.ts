import { countWordScore, sql } from "../utils.js";
import { getRandomInt } from "./utils.js";
import * as db from "./db.js";

const selectWordsStatement = sql`
  SELECT DISTINCT
    word
  FROM
    word
  WHERE
    length(word) >= 4 -- Answer min length
    AND word ~ '^[a-z]+$' -- Only contains alphabet
    AND POSITION($1 IN word) > 0 -- Must contain key letter
    AND word ~ $2 -- Only contains 7 letter
  ;
`;

const selectQuizByCreateDateStatement = sql`
  SELECT
    key_letter,
    letters,
    words,
    word_count,
    max_score,
    create_date
  FROM
    Quiz
  WHERE
    create_date = $1;
`;

const insertQuizStatement = sql`
  INSERT INTO
    Quiz (
      key_letter,
      letters,
      words,
      word_count,
      max_score,
      create_date
    )
  VALUES
    ($1, $2, $3, $4, $5, $6)
  ON CONFLICT (create_date) DO UPDATE
  SET
    create_date = quiz.create_date
  RETURNING
    key_letter,
    letters,
    words,
    word_count,
    max_score,
    create_date;
`;

async function getRandomLettersAndWords() {
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
  const includeAllLettersRegex = `^[${chosenLetters}]+$`;
  const otherLetters = chosenLetters.replace(keyLetter, "");
  const words = (
    await db.query(selectWordsStatement, [keyLetter, includeAllLettersRegex])
  ).rows.map((row: { word: string }) => row.word);

  return { keyLetter, otherLetters, words };
}

export default async function getOrCreateQuiz(createDate: string) {
  const selectQuizResult = await db.query(selectQuizByCreateDateStatement, [
    createDate,
  ]);
  if (selectQuizResult.rows.length) return selectQuizResult.rows[0];
  const ANSWER_TOTAL_MIN = 10;
  const LOOP_LIMIT = 100;
  let words = [];
  let keyLetter, otherLetters;
  let loopCount = 0;
  while (
    words.length < ANSWER_TOTAL_MIN ||
    new Set(words.join("")).size !== 7
  ) {
    ({ keyLetter, otherLetters, words } = await getRandomLettersAndWords());
    loopCount++;
    if (loopCount >= LOOP_LIMIT) break;
  }
  if (loopCount < LOOP_LIMIT) {
    const wordsJSON = JSON.stringify(words);
    const maxScore = words.reduce(
      (currScore: number, word: string) => currScore + countWordScore(word),
      0,
    );
    const insertQuizResult = await db.query(insertQuizStatement, [
      keyLetter,
      otherLetters,
      wordsJSON,
      words.length,
      maxScore,
      createDate,
    ]);
    return insertQuizResult.rows[0];
  } else {
    throw new Error("Quiz failed to generate");
  }
}
