import type { YMD } from "../utils/dateOnly";

const BANK_HOLIDAYS_URL = "https://www.gov.uk/bank-holidays.json";

export type Region = "england-and-wales" | "scotland" | "northern-ireland";

type ApiEvent = { date: string; title: string; notes?: string; bunting?: boolean };
type ApiDivision = { events: ApiEvent[] };
type ApiResponse = Record<string, ApiDivision>;

function cacheKey(region: Region, year: number) {
  return `bankhols:${region}:${year}`;
}

export async function fetchBankHolidays(years: Set<number>, region: Region): Promise<Set<YMD>> {
  // Try cached per-year first
  const out = new Set<YMD>();
  const missing: number[] = [];

  for (const y of years) {
    const raw = localStorage.getItem(cacheKey(region, y));
    if (raw) {
      const arr = JSON.parse(raw) as YMD[];
      arr.forEach((d) => out.add(d));
    } else {
      missing.push(y);
    }
  }

  if (missing.length === 0) return out;

  // Fetch once; store per-year slices
  const res = await fetch(BANK_HOLIDAYS_URL);
  if (!res.ok) throw new Error(`Failed to fetch bank holidays: ${res.status}`);
  const data = (await res.json()) as ApiResponse;

  const events = data?.[region]?.events ?? [];
  const byYear = new Map<number, YMD[]>();

  for (const ev of events) {
    const y = Number(ev.date.slice(0, 4));
    if (!years.has(y)) continue;
    const ymd = ev.date.slice(0, 10) as YMD;
    out.add(ymd);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(ymd);
  }

  for (const y of years) {
    const arr = byYear.get(y) ?? [];
    localStorage.setItem(cacheKey(region, y), JSON.stringify(arr));
  }

  return out;
}
