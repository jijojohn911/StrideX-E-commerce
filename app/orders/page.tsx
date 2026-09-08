"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  product: string;
  title: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  payment: { method: "cod" | "razorpay"; status: string };
  orderStatus: string;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load orders");
        return;
      }

      setOrders(data.orders ?? []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="motion-safe-spinner animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-ink" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-stridex section-y">
        <p className="eyebrow text-champagne mb-3">Account</p>
        <h1 className="font-display text-display-md text-ink mb-10">
          My Orders
        </h1>

        {error && <p className="text-red-600 text-caption mb-6">{error}</p>}

        {!error && orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-body text-stone mb-6">
              You haven&apos;t placed any orders yet.
            </p>
            <Link href="/" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        )}

        <div className="space-y-4 max-w-4xl">
          {orders.map((order) => {
            const orderDate = new Date(order.createdAt).toLocaleDateString(
              "en-IN",
              { day: "numeric", month: "long", year: "numeric" }
            );

            return (
              <Link
                key={order._id}
                href={`/order/${order._id}`}
                className="block border border-stone-light rounded-lg p-6 bg-white hover:border-ink transition-colors duration-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-body font-semibold text-ink">
                      #{order.orderNumber}
                    </p>
                    <p className="text-caption text-stone">{orderDate}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-caption capitalize px-3 py-1 rounded-full bg-stone-light text-ink">
                      {order.orderStatus}
                    </span>
                    <span className="text-body font-semibold text-ink">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                <div className="text-caption text-stone">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.title} × {item.quantity}
                      {idx < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>

                <div className="mt-3 text-caption text-stone">
                  Payment:{" "}
                  <span className="text-ink">
                    {order.payment.method === "cod"
                      ? "Cash on Delivery"
                      : "Razorpay"}
                  </span>{" "}
                  ·{" "}
                  <span className="capitalize text-ink">
                    {order.payment.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}