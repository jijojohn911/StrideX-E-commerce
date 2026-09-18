import type { OrderRow } from "@/types/admin-dashboard";
import { AdminCard } from "../AdminCard";
import { StatusBadge } from "../StatusBadge";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function RecentOrders({ orders }: { orders: OrderRow[] }) {
  return (
    <AdminCard
      title="Recent Orders"
      description="Latest activity across the StrideX store"
      bodyClassName="p-0"
      action={
        <button type="button" className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          View all orders
        </button>
      }
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <caption className="sr-only">Five most recent StrideX orders</caption>
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th scope="col" className="px-5 py-3 font-medium">Order ID</th>
              <th scope="col" className="px-5 py-3 font-medium">Customer</th>
              <th scope="col" className="px-5 py-3 font-medium">Date</th>
              <th scope="col" className="px-5 py-3 font-medium">Items</th>
              <th scope="col" className="px-5 py-3 font-medium">Amount</th>
              <th scope="col" className="px-5 py-3 font-medium">Payment</th>
              <th scope="col" className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-6 text-center text-xs text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                <td className="whitespace-nowrap px-5 py-4 font-medium">{order.id}</td>
                <td className="px-5 py-4">
                  <span className="block font-medium">{order.customer}</span>
                  <span className="block text-xs text-muted-foreground">{order.email}</span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{order.date}</td>
                <td className="px-5 py-4 text-muted-foreground">{order.items}</td>
                <td className="whitespace-nowrap px-5 py-4 font-medium">₹{inr.format(order.amount)}</td>
                <td className="px-5 py-4"><StatusBadge status={order.payment} /></td>
                <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}