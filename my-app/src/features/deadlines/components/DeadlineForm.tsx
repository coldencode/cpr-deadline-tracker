import { useState } from "react";
import { Button } from "../../../ui/Button";
import { Card } from "../../../ui/Card";
import { Input } from "../../../ui/Input";
import { Select } from "../../../ui/Select";
import type { Region } from "../../../services/bankHolidays";
import type { DeadlineItem, RuleKind } from "../types";
import { uid } from "../../../utils/id";
import type { YMD } from "../../../utils/dateOnly";
import { computeCprDeadline, computeDeemedServiceDate } from "../../../utils/cpr";

export function DeadlineForm(props: { onCreate: (item: DeadlineItem) => void }) {
  const [title, setTitle] = useState("Particulars of Claim");
  const [kind, setKind] = useState<RuleKind>("cpr-deadline");
  const [startDate, setStartDate] = useState<YMD>("2025-03-01");
  const [periodDays, setPeriodDays] = useState<number>(14);
  const [region, setRegion] = useState<Region>("england-and-wales");
  const [useShortRule, setUseShortRule] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    setBusy(true);
    try {
      const computedDate =
        kind === "cpr-deadline"
          ? await computeCprDeadline(startDate, periodDays, region, useShortRule)
          : await computeDeemedServiceDate(startDate, region, periodDays);

      props.onCreate({
        id: uid(),
        title,
        kind,
        startDate,
        periodDays,
        region,
        useShortRule,
        computedDate,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="mb-4">
        <div className="text-lg font-semibold">Add deadline</div>
        <div className="text-sm text-black/60">CPR clear-days + bank holiday aware.</div>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-black/60">Title</span>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-xs font-medium text-black/60">Rule</span>
            <Select value={kind} onChange={(e) => setKind(e.target.value as RuleKind)}>
              <option value="cpr-deadline">CPR deadline</option>
              <option value="deemed-service">Deemed service (business days)</option>
            </Select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-medium text-black/60">Region</span>
            <Select value={region} onChange={(e) => setRegion(e.target.value as Region)}>
              <option value="england-and-wales">England &amp; Wales</option>
              <option value="scotland">Scotland</option>
              <option value="northern-ireland">Northern Ireland</option>
            </Select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-xs font-medium text-black/60">
              {kind === "cpr-deadline" ? "Event / issue date" : "Completion date"}
            </span>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value as YMD)} />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-medium text-black/60">
              {kind === "cpr-deadline" ? "Period (days)" : "Offset (business days)"}
            </span>
            <Input
              type="number"
              min={1}
              value={periodDays}
              onChange={(e) => setPeriodDays(Number(e.target.value))}
            />
          </label>
        </div>

        {kind === "cpr-deadline" && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useShortRule}
              onChange={(e) => setUseShortRule(e.target.checked)}
            />
            Apply “short period” rule for ≤ 7 days (skip weekends & bank holidays)
          </label>
        )}

        {err && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}

        <div className="flex gap-2">
          <Button onClick={submit} disabled={busy}>
            {busy ? "Calculating…" : "Add"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
