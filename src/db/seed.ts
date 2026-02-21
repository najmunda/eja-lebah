import path, { dirname } from "path";
import getOrCreateQuiz from "../server/updateLetters.js";
import { getJakartaDate } from "../server/utils.js";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import db from "../server/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
db.exec(readFileSync(path.resolve(__dirname, "seed.sql"), "utf-8"));

getOrCreateQuiz(getJakartaDate(-1));
getOrCreateQuiz(getJakartaDate());
getOrCreateQuiz(getJakartaDate(1));
