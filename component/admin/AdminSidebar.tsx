"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminNavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
}

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
  { label: "Products", icon: Package, href: "/admin/products" },
  // { label: "Customers", icon: Users, href: "/admin/customers" },
  // { label: "Inventory", icon: Boxes, href: "/admin/inventory" },
  // { label: "Payments", icon: CreditCard, href: "/admin/payments" },
  // { label: "Revenue", icon: TrendingUp, href: "/admin/revenue" },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<{ username?: string; role?: string } | null>(
    null,
  );

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.success) setMe(data.user);
      } catch (err) {
        console.error(err);
      }
    };
    loadMe();
  }, []);

  const displayName = me?.username || "Admin";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
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

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-5 py-5">
        <p className="font-display text-xl font-extrabold tracking-[0.22em]">
          STRIDEX
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-sidebar-muted">
          Admin Panel
        </p>
      </div>

      <nav
        aria-label="Admin sections"
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <ul className="space-y-0.5">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const base =
              "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne";
            const isActive = item.href
              ? item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
              : false;

            return (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      base,
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground font-semibold"
                        : "text-sidebar-muted hover:bg-sidebar-accent/60",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    aria-disabled="true"
                    title="Coming soon"
                    className={cn(
                      base,
                      "text-sidebar-muted/70 hover:bg-sidebar-accent/40",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-md px-2 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-champagne text-sm font-semibold text-primary">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">
              {displayName}
            </span>
            <span className="block truncate text-xs text-sidebar-muted">
              {me?.role === "admin" ? "Store Admin" : (me?.role ?? "")}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}