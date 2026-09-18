import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function AdminCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: AdminCardProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card shadow-[var(--shadow-subtle)]",
        className,
      )}
    >
      {(title || action) && (
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-base font-semibold text-foreground">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}