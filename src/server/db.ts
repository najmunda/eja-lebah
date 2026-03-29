import Database from "better-sqlite3";
import { sql } from "../utils.js";

const db = new Database(process.env.DB_NAME, {
  fileMustExist: true,
});
db.pragma("journal_mode = WAL");
db.loadExtension("./regexp");
console.log(
  db
    .prepare(sql`
      SELECT
        true AS regexp_extension_loaded
      WHERE
        'the year is 2021' REGEXP '[0-9]+';

      -- 1
    `)
    .get(),
);

export default db;
