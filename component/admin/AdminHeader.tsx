import { Bell, Menu, Search } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  onOpenMenu: () => void;
}

export function AdminHeader({ title, onOpenMenu }: AdminHeaderProps) {
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
          <h1 className="truncate font-display text-lg font-semibold sm:text-xl">{title}</h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block">
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
              placeholder="Search orders, products…"
              className="h-10 w-56 rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring lg:w-72"
            />
          </div>

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
              RS
            </span>
            <span className="hidden min-w-0 text-sm font-medium sm:block">Riya Sharma</span>
          </div>
        </div>
      </div>
    </header>
  );
}