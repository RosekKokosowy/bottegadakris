/** "piątek, 20 listopada 2026" for a YYYY-MM-DD date, independent of the server's time zone. */
export const formatDatePL = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("pl-PL", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
