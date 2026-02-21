import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import { CronJob } from "cron";
import getOrCreateQuiz from "./updateLetters.js";
import ViteExpress from "vite-express";
import { getJakartaDate } from "./utils.js";

const app = express();

// CORS
const privateKey = fs.readFileSync("eja-lebah.key", "utf-8");
const certificate = fs.readFileSync("eja-lebah.crt", "utf-8");
const credentials = { key: privateKey, cert: certificate };
app.use(cors());

// Job for update letter on start of day
function dailyJob() {
  getOrCreateQuiz(getJakartaDate(-1));
  getOrCreateQuiz(getJakartaDate());
  getOrCreateQuiz(getJakartaDate(1));
}

new CronJob("0 0 0 * * *", dailyJob, null, true, "Asia/Jakarta", null, true);

// Routes

app.get("/api/quiz/:date", (req, res) => {
  const dateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
  const userTodayDate = req.params["date"];
  if (dateRegex.test(userTodayDate)) {
    const todayQuiz = getOrCreateQuiz(userTodayDate);
    res.status(200).json(todayQuiz);
  }
});

app.get("/api", (req, res) => {
  res.send("Hello Server!");
});

const httpsServer = https.createServer(credentials, app);
const server = httpsServer.listen(process.env.PORT, "0.0.0.0", () =>
  console.log(`Server is listening on port ${process.env.PORT}...`),
);

ViteExpress.bind(app, server);
