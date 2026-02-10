export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getClientTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
}
