export type YMD = `${number}-${number}-${number}`;

export function parseYMD(s: string): Date {
  // Expect "YYYY-MM-DD"
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatYMD(dt: Date): YMD {
  return dt.toISOString().slice(0, 10) as YMD;
}

export function addDays(date: Date, days: number): Date {
  const ms = date.getTime() + days * 24 * 60 * 60 * 1000;
  return new Date(ms);
}

export function weekdayUtc(date: Date): number {
  // 0=Sun ... 6=Sat (UTC)
  return date.getUTCDay();
}
