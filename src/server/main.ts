import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import db from "./db.js";
import { CronJob } from "cron";
import updateLettersAndAnswers from "./updateLetters.js";
import ViteExpress from "vite-express";

const app = express();

// CORS
const privateKey = fs.readFileSync("eja-lebah.key", "utf-8");
const certificate = fs.readFileSync("eja-lebah.crt", "utf-8");
const credentials = { key: privateKey, cert: certificate };
app.use(cors());

// Job for update letter on start of day
new CronJob("0 0 0 * * *", updateLettersAndAnswers, null, true, "Asia/Jakarta");

const selectLastLettersStatement = db.prepare(`
  SELECT key_letter, letters, words, word_count, max_score, create_date FROM Letter ORDER BY id DESC LIMIT 1;
`);

// Routes

app.get("/api/answers", (req, res) => {
  const todayLettersAndAnswers = selectLastLettersStatement.get();
  res.status(200).json(todayLettersAndAnswers);
});

app.get("/api", (req, res) => {
  res.send("Hello Server!");
});

const httpsServer = https.createServer(credentials, app);
const server = httpsServer.listen(process.env.PORT, "0.0.0.0", () =>
  console.log(`Server is listening on port ${process.env.PORT}...`),
);

ViteExpress.bind(app, server);
