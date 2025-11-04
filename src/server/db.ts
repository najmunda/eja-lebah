import Database from "better-sqlite3";
import * as sqlite_regex from "sqlite-regex";

const db = new Database(process.env.DB_NAME, {
  fileMustExist: true,
});
db.pragma("journal_mode = WAL");
db.loadExtension(sqlite_regex.getLoadablePath());

export default db;
