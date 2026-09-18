import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { StatItem } from "@/types/admin-dashboard";
import { cn } from "@/lib/utils";

export function StatCard({
  stat,
  icon: Icon,
}: {
  stat: StatItem;
  icon: LucideIcon;
}) {
  const up = stat.direction === "up";
  const TrendIcon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-subtle)]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="min-w-0 truncate text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {stat.label}
        </p>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-champagne-soft text-secondary-foreground">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 font-display text-2xl font-bold sm:text-3xl">
        {stat.value}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            up
              ? "bg-success-soft text-success"
              : "bg-destructive-soft text-destructive",
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {up ? "+" : "-"}
          {Math.abs(stat.change)}%
        </span>
        <span className="text-xs text-muted-foreground">{stat.hint}</span>
      </div>
    </article>
  );
}
