SET
  TIMEZONE = "Asia/Jakarta";

CREATE TABLE quiz (
  id SERIAL PRIMARY KEY,
  key_letter TEXT NOT NULL,
  letters TEXT NOT NULL,
  words TEXT NOT NULL DEFAULT '[]',
  word_count INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 0,
  create_date DATE NOT NULL UNIQUE,
  create_time TIME NOT NULL DEFAULT LOCALTIME
);

CREATE TABLE word (word TEXT);
