import { DeadlineForm } from "./features/deadlines/components/DeadlineForm";
import { DeadlineList } from "./features/deadlines/components/DeadlineList";
import { useDeadlines } from "./features/deadlines/hooks/useDeadlines";

export default function App() {
  const dl = useDeadlines();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <div className="text-2xl font-bold">Court Deadline Tracker</div>
          <div className="text-sm text-black/60">
            CPR-style clear days + short-period business-day rule + deemed service.
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <DeadlineForm onCreate={dl.add} />
          <DeadlineList items={dl.items} onRemove={dl.remove} />
        </div>

        <div className="mt-6 text-xs text-black/50">
          Note: This tool helps with calculation logic but isn’t legal advice.
        </div>
      </div>
    </div>
  );
}
