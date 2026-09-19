"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface AdminHeaderProps {
  title: string;
  onOpenMenu: () => void;
}

type SearchScope = "orders" | "products";

export function AdminHeader({ title, onOpenMenu }: AdminHeaderProps) {
  const { displayName, initials } = useCurrentUser();

  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [scopeOverride, setScopeOverride] = useState<SearchScope | null>(null);

  // Products page-il aanenkil default "products", allenkil "orders"
  const scope: SearchScope =
    scopeOverride ??
    (pathname.startsWith("/admin/products") ? "products" : "orders");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = query.trim();
    const base = scope === "products" ? "/admin/products" : "/admin/orders";
    router.push(term ? `${base}?search=${encodeURIComponent(term)}` : base);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <h1 className="truncate font-display text-lg font-semibold sm:text-xl">
            {title}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden items-center gap-2 md:flex"
          >
            <label htmlFor="admin-search-scope" className="sr-only">
              Search in
            </label>
            <select
              id="admin-search-scope"
              value={scope}
              onChange={(e) => setScopeOverride(e.target.value as SearchScope)}
              className="h-10 rounded-md border border-border bg-card px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="orders">Orders</option>
              <option value="products">Products</option>
            </select>

            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="admin-search" className="sr-only">
                Search the admin panel
              </label>
              <input
                id="admin-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  scope === "products" ? "Search products…" : "Search orders…"
                }
                className="h-10 w-48 rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring lg:w-60"
              />
            </div>
          </form>

          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-md border border-border bg-card transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-champagne" />
          </button>

          <div className="flex items-center gap-2 rounded-md border border-border bg-card py-1.5 pl-1.5 pr-2 sm:pr-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {initials}
            </span>
            <span className="hidden min-w-0 text-sm font-medium sm:block">
              {displayName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}