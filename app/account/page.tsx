"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const QUICK_LINKS = [
  { label: "My Orders", desc: "Track and review your orders", href: "/orders" },
  { label: "Wishlist", desc: "Shoes you've saved", href: "/wishlist" },
  { label: "Cart", desc: "Continue where you left off", href: "/cart" },
];

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (!res.ok || !data.success) {
          router.replace("/login");
          return;
        }
        setMe(data.user);

        // recent orders (failed aayaalum page break aavilla)
        try {
          const oRes = await fetch("/api/orders", { credentials: "include" });
          const oData = await oRes.json();
          if (oRes.ok && oData.success) {
            setOrders((oData.orders ?? []).slice(0, 3));
          }
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

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-24 text-center text-sm text-neutral-500">
        Loading your account...
      </main>
    );
  }

  if (!me) return null;

  const displayName = me.username || me.email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      {/* Profile */}
      <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-neutral-900 text-lg font-semibold text-white">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              My Account
            </p>
            <h1 className="truncate text-3xl font-semibold">{displayName}</h1>
            <p className="truncate text-sm text-neutral-600">{me.email}</p>
          </div>
        </div>

        <div className="flex gap-3">
          {me.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-md border border-black/15 px-4 py-2 text-sm transition-colors hover:bg-black/5"
            >
              Admin Panel
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-md border border-black/15 px-4 py-2 text-sm transition-colors hover:bg-black/5 disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </section>

      {/* Quick links */}
      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-black/10 p-5 transition-colors hover:border-black/30 hover:bg-black/[0.03]"
          >
            <p className="font-medium">{item.label}</p>
            <p className="mt-1 text-sm text-neutral-600">{item.desc}</p>
          </Link>
        ))}
      </section>

      {/* Recent orders */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          {orders.length > 0 && (
            <Link href="/orders" className="text-sm underline underline-offset-4">
              View all
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/15 p-8 text-center">
            <p className="text-sm text-neutral-600">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/products"
              className="mt-3 inline-block text-sm underline underline-offset-4"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-black/10 rounded-lg border border-black/10">
            {orders.map((order) => (
              <li key={order._id}>
                <Link
                  href={`/order/${order._id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-black/[0.03]"
                >
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-black/5 px-3 py-1 text-xs capitalize">
                      {order.orderStatus}
                    </span>
                    <span className="text-sm font-medium">
                      ₹{inr.format(order.totalAmount)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}