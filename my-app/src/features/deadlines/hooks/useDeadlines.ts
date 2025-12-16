import { useEffect, useMemo, useState } from "react";
import type { DeadlineItem } from "../types";

const KEY = "deadline-tracker:v1";

export function useDeadlines() {
  const [items, setItems] = useState<DeadlineItem[]>(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DeadlineItem[]) : [];
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const api = useMemo(() => ({
    items,
    add(item: DeadlineItem) {
      setItems((prev) => [item, ...prev]);
    },
    remove(id: string) {
      setItems((prev) => prev.filter((x) => x.id !== id));
    },
    clear() {
      setItems([]);
    },
  }), [items]);

  return api;
}
