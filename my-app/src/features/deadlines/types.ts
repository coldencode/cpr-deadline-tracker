import type { Region } from "../../services/bankHolidays";
import type { YMD } from "../../utils/dateOnly";

export type RuleKind = "cpr-deadline" | "deemed-service";

export type DeadlineItem = {
  id: string;
  title: string;
  kind: RuleKind;

  startDate: YMD;        // event / completion date
  periodDays: number;    // CPR period days OR deemed offset
  region: Region;
  useShortRule: boolean; // only used for CPR kind

  computedDate: YMD;     // stored result for stability
  createdAt: string;
};
