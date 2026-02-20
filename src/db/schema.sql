CREATE TABLE "Letter" (
  "id" INTEGER NOT NULL UNIQUE,
  "key_letter" TEXT NOT NULL,
  "letters" TEXT NOT NULL,
  "words" TEXT NOT NULL DEFAULT '[]',
  "word_count" INTEGER NOT NULL DEFAULT 0,
  "max_score" INTEGER NOT NULL DEFAULT 0,
  "create_date" TEXT NOT NULL UNIQUE,
  "create_time" TEXT NOT NULL DEFAULT (time('now', '+7 hour')),
  PRIMARY KEY ("id" AUTOINCREMENT)
);

CREATE TABLE "Word" (word TEXT);
