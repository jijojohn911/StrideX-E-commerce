import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-secondary text-secondary-foreground border-border",
  success: "bg-success-soft text-success border-transparent",
  warning: "bg-warning-soft text-warning border-transparent",
  danger: "bg-destructive-soft text-destructive border-transparent",
  info: "bg-champagne-soft text-secondary-foreground border-transparent",
};

const labelMap: Record<string, { label: string; tone: BadgeTone }> = {
  paid: { label: "Paid", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  refunded: { label: "Refunded", tone: "neutral" },
  failed: { label: "Failed", tone: "danger" },
  processing: { label: "Processing", tone: "info" },
  shipped: { label: "Shipped", tone: "info" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
  "in-stock": { label: "In Stock", tone: "success" },
  "low-stock": { label: "Low Stock", tone: "warning" },
  "out-of-stock": { label: "Out of Stock", tone: "danger" },
};

export function StatusBadge({ status }: { status: string }) {
  const entry = labelMap[status] ?? { label: status, tone: "neutral" as BadgeTone };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClasses[entry.tone],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {entry.label}
    </span>
  );
}