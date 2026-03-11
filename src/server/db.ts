import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

export function query(query, params) {
  return pool.query(query, params);
}
