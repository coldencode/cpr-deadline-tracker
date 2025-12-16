import { Card } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import type { DeadlineItem } from "../types";

export function DeadlineList(props: { items: DeadlineItem[]; onRemove: (id: string) => void }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Deadlines</div>
          <div className="text-sm text-black/60">{props.items.length} item(s)</div>
        </div>
      </div>

      <div className="grid gap-3">
        {props.items.map((it) => (
          <div key={it.id} className="rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-black/60">
                  {it.kind === "cpr-deadline" ? "CPR deadline" : "Deemed service"} • {it.region}
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-black/60">Start:</span> {it.startDate}{" "}
                  <span className="text-black/60">→ Result:</span>{" "}
                  <span className="font-semibold">{it.computedDate}</span>
                </div>
              </div>
              <Button variant="ghost" onClick={() => props.onRemove(it.id)}>
                Remove
              </Button>
            </div>
          </div>
        ))}

        {props.items.length === 0 && (
          <div className="rounded-xl border border-dashed p-6 text-sm text-black/60">
            No deadlines yet. Add one on the left.
          </div>
        )}
      </div>
    </Card>
  );
}
