import path, { dirname } from "path";
import updateLettersAndAnswers from "../server/updateLetters.js";
import { getJakartaDate } from "../server/utils.js";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import db from "../server/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
db.exec(readFileSync(path.resolve(__dirname, "seed.sql"), "utf-8"));

updateLettersAndAnswers(getJakartaDate(-1));
updateLettersAndAnswers(getJakartaDate());
updateLettersAndAnswers(getJakartaDate(1));
