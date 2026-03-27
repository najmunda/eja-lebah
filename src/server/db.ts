import Database from "better-sqlite3";
import { sql } from "../utils.js";

const db = new Database(process.env.DB_NAME, {
  fileMustExist: true,
});
db.pragma("journal_mode = WAL");
db.loadExtension("./regex0");
console.log(
  db
    .prepare(sql`
      SELECT
        regex_version ()
    `)
    .get(),
);

export default db;
