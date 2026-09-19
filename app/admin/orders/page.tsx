"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AdminCard } from "@/component/admin/AdminCard";
import { StatusBadge } from "@/component/admin/StatusBadge";

interface AdminOrder {
  _id: string;
  orderNumber: string;
  user: { username?: string; email?: string } | null;
  createdAt: string;
  items: { quantity: number }[];
  totalAmount: number;
  payment: { status: string; method: string };
  orderStatus: string;
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

function AdminOrders({ initialSearch }: { initialSearch: string }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async (q: string, status: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (status) params.set("status", status);
      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load orders");
        return;
      }
      setOrders(data.orders);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(search, statusFilter), 350);
    return () => clearTimeout(timer);
  }, [search, statusFilter, load]);

  const handleStatusChange = async (orderId: string, orderStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to update status");
        return;
      }
      toast.success(`Order marked as ${orderStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus } : o)),
      );
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          All orders across the StrideX store
        </p>
      </div>

      <AdminCard
        title="All Orders"
        description={`${orders.length} order${orders.length === 1 ? "" : "s"}`}
        bodyClassName="p-0"
        action={
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-champagne"
            >
              <option value="">All statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, customer..."
              className="w-56 rounded-md border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-champagne"
            />
          </div>
        }
      >
        {error && <p className="px-5 py-4 text-sm text-destructive">{error}</p>}
        {!error && loading && (
          <p className="px-5 py-6 text-center text-xs text-muted-foreground">
            Loading...
          </p>
        )}

        {!error && !loading && (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-215 text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Order ID
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Customer
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Items
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Amount
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Payment
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-6 text-center text-xs text-muted-foreground"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-border last:border-0 hover:bg-secondary/50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-4">
                      <span className="block font-medium">
                        {order.user?.username || "Unknown"}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {order.user?.email}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {order.items.reduce((s, it) => s + it.quantity, 0)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      ₹{inr.format(order.totalAmount)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.payment.status} />
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={updatingId === order._id}
                        className="rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-champagne disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s[0].toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}

function OrdersWithSearchParam() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  // urlSearch maarumbol key maarum, component remount aayi puthiya search pick aakum
  return <AdminOrders key={urlSearch} initialSearch={urlSearch} />;
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersWithSearchParam />
    </Suspense>
  );
}