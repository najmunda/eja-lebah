import Database from "better-sqlite3";
import * as sqlite_regex from "sqlite-regex";
import { readFileSync } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const db = new Database(process.env.DB_NAME);
db.pragma("journal_mode = WAL");
db.loadExtension(sqlite_regex.getLoadablePath());

const __dirname = dirname(fileURLToPath(import.meta.url));
db.exec(readFileSync(path.resolve(__dirname, "schema.sql"), "utf-8"));
