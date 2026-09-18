"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { AdminSidebar } from "@/component/admin/AdminSidebar";
import { AdminHeader } from "@/component/admin/AdminHeader";
import "@/styles/admin-theme.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  const title = pathname === "/admin" ? "Dashboard" : "Admin";

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();

        if (!res.ok || !data.success || data.user?.role !== "admin") {
          router.push("/login");
          return;
        }

        setChecking(false);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    checkAdminAccess();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="motion-safe-spinner animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-ink" />
      </div>
    );
  }

  return (
    <div className="admin-theme min-h-screen w-full overflow-x-hidden">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:block">
        <AdminSidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] animate-in slide-in-from-left duration-200"
          >
            <AdminSidebar onNavigate={() => setOpen(false)} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-md text-sidebar-muted hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <AdminHeader title={title} onOpenMenu={() => setOpen(true)} />
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}