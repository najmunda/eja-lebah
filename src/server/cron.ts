import getOrCreateQuiz from "./getOrCreateQuiz.js";
import { getJakartaDate } from "./utils.js";

// Job for update letter on start of day
async function dailyJob() {
  await getOrCreateQuiz(getJakartaDate(-1));
  await getOrCreateQuiz(getJakartaDate());
  await getOrCreateQuiz(getJakartaDate(1));
}

await dailyJob();
