import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const db = new Database(process.env.DB_NAME);
db.pragma("journal_mode = WAL");

const __dirname = dirname(fileURLToPath(import.meta.url));
db.exec(readFileSync(path.resolve(__dirname, "schema.sql"), "utf-8"));
db.exec(readFileSync(path.resolve(__dirname, "seed.sql"), "utf-8"));
