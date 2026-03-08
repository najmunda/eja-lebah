import { Client } from "pg";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const client = new Client({
  connectionString: process.env.DB_CONNECTION_STRING,
});
const __dirname = dirname(fileURLToPath(import.meta.url));

await client.connect();

try {
  await client.query("BEGIN");
  await client.query(
    readFileSync(path.resolve(__dirname, "seed.sql"), "utf-8"),
  );
  await client.query("COMMIT");
} catch (error) {
  console.error(error);
  await client.query("ROLLBACK");
} finally {
  await client.end();
}
