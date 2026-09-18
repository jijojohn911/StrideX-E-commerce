"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import type { RevenueRange, RevenuePoint } from "@/types/admin-dashboard";
import { cn } from "@/lib/utils";

const ranges: { id: RevenueRange; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

interface RevenueChartProps {
  revenueSeries: Record<RevenueRange, RevenuePoint[]>;
  revenueSummary: Record<RevenueRange, { total: string; change: number; caption: string }>;
}

export function RevenueChart({ revenueSeries, revenueSummary }: RevenueChartProps) {
  const [range, setRange] = useState<RevenueRange>("daily");
  const data = revenueSeries[range];
  const summary = revenueSummary[range];
  const peak = data.length ? Math.max(...data.map((point) => point.revenue)) : 0;

  return (
    <section className="rounded-lg border border-border bg-card shadow-[var(--shadow-subtle)]">
      <header className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold">Revenue Overview</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="font-display text-2xl font-bold">{summary.total}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              {summary.change >= 0 ? "+" : ""}
              {summary.change}%
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{summary.caption}</p>
        </div>

        <div
          role="tablist"
          aria-label="Revenue period"
          className="inline-flex shrink-0 self-start rounded-md border border-border bg-secondary p-1"
        >
          {ranges.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={range === r.id}
              onClick={() => setRange(r.id)}
              className={cn(
                "rounded px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                range === r.id
                  ? "bg-card text-foreground shadow-[var(--shadow-subtle)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      <div className="h-64 w-full px-2 py-4 sm:h-72 sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={52}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              cursor={{ fill: "var(--secondary)" }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--foreground)",
              }}
              formatter={(value) => [`₹${inr.format(Number(value ?? 0))}`, "Revenue"]}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={56}>
              {data.map((point, i) => (
                <Cell
                  key={`${point.label}-${i}`}
                  fill={point.revenue === peak ? "var(--champagne)" : "var(--primary)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}