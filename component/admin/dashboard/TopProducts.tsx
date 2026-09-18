import type { TopProduct } from "@/types/admin-dashboard";
import { AdminCard } from "../AdminCard";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function TopProducts({ products }: { products: TopProduct[] }) {
  return (
    <AdminCard title="Top Products" description="Best sellers this month" bodyClassName="p-3">
      <ul className="divide-y divide-border">
        {products.length === 0 && (
          <li className="px-2 py-4 text-center text-xs text-muted-foreground">No sales this month yet</li>
        )}
        {products.map((product) => (
          <li key={product.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-2 py-3">
            <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-border bg-secondary font-display text-xs font-bold tracking-wide text-muted-foreground">
              {product.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{product.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{product.brand} · {product.unitsSold} sold</span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-sm font-medium">₹{inr.format(product.revenue)}</span>
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}