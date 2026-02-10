export function getJakartaNextTwoDayDate(): string {
  const options = {
    timeZone: "Asia/Jakarta",
  };
  const date = new Date(new Date().toLocaleDateString("en-US", options));
  date.setDate(date.getDate() + 2);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
}

export function getRandomInt(min, max): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
