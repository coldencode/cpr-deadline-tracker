import type { YMD } from "./dateOnly";
import { addDays, formatYMD, parseYMD, weekdayUtc } from "./dateOnly";
import type { Region } from "../services/bankHolidays";
import { fetchBankHolidays } from "../services/bankHolidays";

export function isBusinessDay(date: Date, bankHolidays: Set<YMD>): boolean {
  const dow = weekdayUtc(date); // 0 Sun .. 6 Sat
  if (dow === 0 || dow === 6) return false;
  return !bankHolidays.has(formatYMD(date));
}

export function addCalendarClearDays(startDate: Date, periodDays: number): Date {
  // "Clear days": exclude start date; adding N days achieves that behaviour
  return addDays(startDate, periodDays);
}

export function addBusinessDays(startDate: Date, businessDays: number, bankHolidays: Set<YMD>): Date {
  let current = startDate;
  let added = 0;
  while (added < businessDays) {
    current = addDays(current, 1);
    if (isBusinessDay(current, bankHolidays)) added += 1;
  }
  return current;
}

export async function computeCprDeadline(
  issueOrEventDateStr: YMD,
  periodDays: number,
  region: Region = "england-and-wales",
  use7DayShortRule: boolean = true
): Promise<YMD> {
  const startDate = parseYMD(issueOrEventDateStr);
  const yearsNeeded = new Set<number>([
    startDate.getUTCFullYear(),
    startDate.getUTCFullYear() + 1,
  ]);
  const bankHolidays = await fetchBankHolidays(yearsNeeded, region);

  const deadline =
    use7DayShortRule && periodDays <= 7
      ? addBusinessDays(startDate, periodDays, bankHolidays)
      : addCalendarClearDays(startDate, periodDays);

  return formatYMD(deadline);
}

export async function computeDeemedServiceDate(
  completionDateStr: YMD,
  region: Region = "england-and-wales",
  businessDayOffset: number = 2
): Promise<YMD> {
  const completionDate = parseYMD(completionDateStr);
  const yearsNeeded = new Set<number>([
    completionDate.getUTCFullYear(),
    completionDate.getUTCFullYear() + 1,
  ]);
  const bankHolidays = await fetchBankHolidays(yearsNeeded, region);

  const deemed = addBusinessDays(completionDate, businessDayOffset, bankHolidays);
  return formatYMD(deemed);
}
