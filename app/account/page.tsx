"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/component/layout/Navbar";
import Footer from "@/component/layout/Footer";

interface Me {
  userId: string;
  email: string;
  role: "user" | "admin";
  username?: string;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (!res.ok || !data.success) {
          router.replace("/login");
          return;
        }
        setMe(data.user);

        try {
          const oRes = await fetch("/api/orders", { credentials: "include" });
          const oData = await oRes.json();
          if (oRes.ok && oData.success) setOrders(oData.orders ?? []);
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const displayName = me ? me.username || me.email.split("@")[0] : "";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const recent = orders.slice(0, 5);

  return (
    <>
      <Navbar cartCount={0} />

      <main className="mx-auto min-h-[70vh] max-w-6xl px-6 pb-28 pt-40 sm:px-10">
        {loading || !me ? (
          <p className="text-sm text-neutral-500">Loading your account...</p>
        ) : (
          <div className="grid gap-14 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-20">
            {/* Left: profile */}
            <aside>
              <span className="grid h-20 w-20 place-items-center rounded-full bg-neutral-900 text-2xl font-semibold text-white">
                {initials}
              </span>

              <p className="mt-8 text-xs uppercase tracking-[0.2em] text-neutral-500">
                My Account
              </p>
              <h1 className="mt-2 break-words text-4xl font-semibold">
                {displayName}
              </h1>
              <p className="mt-2 break-all text-sm text-neutral-600">
                {me.email}
              </p>

              <div className="mt-8 border-t border-black/10 pt-6 text-sm">
                <p className="text-neutral-500">Total orders</p>
                <p className="mt-1 text-2xl font-semibold">{orders.length}</p>
              </div>

              {me.role === "admin" && (
                <Link
                  href="/admin"
                  className="mt-8 inline-block rounded-md border border-black/15 px-4 py-2 text-sm transition-colors hover:bg-black/5"
                >
                  Admin Panel
                </Link>
              )}
            </aside>

            {/* Right: recent orders */}
            <section>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-semibold">Recent Orders</h2>
                {orders.length > 5 && (
                  <Link
                    href="/orders"
                    className="text-sm underline underline-offset-4"
                  >
                    View all
                  </Link>
                )}
              </div>

              {recent.length === 0 ? (
                <div className="rounded-lg border border-dashed border-black/15 p-12 text-center">
                  <p className="text-sm text-neutral-600">
                    You haven&apos;t placed any orders yet.
                  </p>
                  <Link
                    href="/products"
                    className="mt-4 inline-block text-sm underline underline-offset-4"
                  >
                    Start shopping
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-black/10 rounded-lg border border-black/10">
                  {recent.map((order) => (
                    <li key={order._id}>
                      <Link
                        href={`/order/${order._id}`}
                        className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 transition-colors hover:bg-black/[0.03]"
                      >
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="rounded-full bg-black/5 px-3 py-1 text-xs capitalize">
                            {order.orderStatus}
                          </span>
                          <span className="font-medium">
                            ₹{inr.format(order.totalAmount)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}