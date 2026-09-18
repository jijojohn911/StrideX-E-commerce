import { AlertTriangle } from "lucide-react";
import type { StockItem } from "@/types/admin-dashboard";
import { AdminCard } from "../AdminCard";
import { StatusBadge } from "../StatusBadge";

export function LowStockProducts({ items }: { items: StockItem[] }) {
  return (
    <AdminCard
      title="Low Stock"
      description="Products that need restocking soon"
      bodyClassName="p-3"
      action={
        <button
          type="button"
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          View inventory
        </button>
      }
    >
      <ul className="divide-y divide-border">
        {items.length === 0 && (
          <li className="px-2 py-4 text-center text-xs text-muted-foreground">
            Everything&apos;s well stocked
          </li>
        )}

        {items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-2 py-3"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-warning-soft text-warning">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">
                {item.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {item.size} · {item.stock} left
              </span>
            </span>
            <StatusBadge status={item.status} />
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}
